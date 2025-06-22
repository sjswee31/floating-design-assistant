# === server.py ===
from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
from PIL import Image
import io
import time
import os
import logging
from logging_config import logger, log_request, log_response, log_error
from prompts import PROMPTS

# Configuration
SECTION_WIDTH = 800  # Width of each section in pixels
SECTION_HEIGHT = 600  # Height of each section in pixels
MAX_SECTIONS_PER_REQUEST = 5  # Number of sections to process at once
REQUEST_TIMEOUT = 300  # 5 minutes
MAX_IMAGE_SIZE = 20 * 1024 * 1024  # 20MB max image size

# Caching setup
cache = {}  # Simple in-memory cache
CACHE_TTL = 300  # Cache entries expire after 5 minutes

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Google Gemini API
try:
    # Try loading from .env file first
    try:
        from dotenv import load_dotenv
        load_dotenv()
    except ImportError:
        logger.warning("python-dotenv not installed, falling back to environment variables")

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found. Please set it in your environment or .env file")
    
    import google.generativeai as genai
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-pro')
    logger.info("Successfully initialized Gemini API")

except Exception as e:
    log_error(f"Failed to initialize Gemini API: {str(e)}")
    raise

def validate_image_size(image_data):
    """Validate that an image is within allowed size limits."""
    if len(image_data) > MAX_IMAGE_SIZE:
        raise ValueError(f"Image too large: {len(image_data)} bytes > {MAX_IMAGE_SIZE} bytes")
    return image_data

def compress_image_section(image_data, section_id):
    """Optimize image compression for a specific section."""
    try:
        if not image_data.startswith('data:image/'):
            raise ValueError("Invalid image format")
        
        # Use cache if available
        cache_key = f"section_{section_id}"
        if cache_key in cache:
            cached = cache[cache_key]
            if time.time() - cached['timestamp'] < CACHE_TTL:
                return cached['data']

        # Decode and process image
        image = Image.open(io.BytesIO(base64.b64decode(image_data.split(",")[1])))

        # Resize to optimal dimensions
        image = image.resize((SECTION_WIDTH, SECTION_HEIGHT), Image.Resampling.LANCZOS)

        # Convert to RGB if not already
        if image.mode != 'RGB':
            image = image.convert('RGB')

        # Save with optimized settings
        buffer = io.BytesIO()
        image.save(
            buffer,
            format="JPEG",
            quality=85,
            optimize=True,
            progressive=True
        )

        compressed_data = buffer.getvalue()

        # Store in cache
        cache[cache_key] = {
            'data': compressed_data,
            'timestamp': time.time()
        }

        return compressed_data

    except Exception as e:
        logger.error(f"Image processing failed for section {section_id}: {e}")
        return None

@app.route("/api/check", methods=["POST"])
def check():
    start_time = time.time()
    try:
        data = request.get_json()
        log_request(f"Mode: {data.get('mode')}, Image received: {bool(data.get('image'))}")
        
        if not data:
            log_error("No data received")
            return jsonify({"error": "No data received"}), 400

        mode = data.get("mode", "accessibility")
        prompt = data.get("prompt") or PROMPTS.get(mode, "Please critique this website's UI.")
        image_data = data.get("image")

        if not image_data:
            log_error("No image data received")
            return jsonify({"error": "No image data received"}), 400

        # Validate and compress the image
        try:
            validate_image_size(image_data)
            compressed_image = compress_image_section(image_data, "main")
            if not compressed_image:
                return jsonify({"error": "Failed to process image"}), 400
        except Exception as e:
            log_error(f"Image validation failed: {str(e)}")
            return jsonify({"error": f"Image processing error: {str(e)}"}), 400

        try:
            # Create image part for Gemini using the correct format
            image_part = {
                "mime_type": "image/jpeg",
                "data": compressed_image
            }

            # Generate response using Gemini with proper content format
            response = model.generate_content([prompt, image_part])
            
            if response.text:
                feedback = response.text
                log_response(f"Successfully generated feedback using Gemini")
            else:
                feedback = "No feedback generated from Gemini API"
                log_error("Empty response from Gemini API")

            processing_time = time.time() - start_time

            return jsonify({
                "success": True,
                "feedback": feedback,
                "processing_time": processing_time,
                "api_used": "gemini-1.5-pro"
            })

        except Exception as e:
            log_error(f"Gemini API error: {str(e)}")
            return jsonify({
                "error": True,
                "message": f"API Error: {str(e)}",
                "api_used": "gemini-1.5-pro"
            }), 500

    except Exception as e:
        logger.error(f"Unhandled error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint to verify API connectivity"""
    try:
        # Test Gemini API with a simple prompt
        response = model.generate_content("Hello")
        return jsonify({
            "status": "healthy",
            "api": "gemini-1.5-pro",
            "timestamp": time.time()
        })
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "error": str(e),
            "api": "gemini-1.5-pro",
            "timestamp": time.time()
        }), 500

if __name__ == "__main__":
    app.run(port=5001, debug=False)
