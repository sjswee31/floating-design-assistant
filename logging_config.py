import logging
import os
from datetime import datetime

# Create logs directory if it doesn't exist
if not os.path.exists('logs'):
    os.makedirs('logs')

# Get today's date for log file name
today = datetime.now().strftime('%Y-%m-%d')
log_file = f'logs/accessibility_checker_{today}.log'

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_file),
        logging.StreamHandler()
    ]
)

# Create a logger
logger = logging.getLogger(__name__)

# Add custom logging levels
def log_request(request_data):
    """Log incoming request details"""
    logger.info(f"Received request: {request_data}")

def log_response(response_data):
    """Log response details"""
    logger.info(f"Sent response: {response_data}")

def log_error(error_message, request_data=None):
    """Log error with request context"""
    if request_data:
        logger.error(f"Error processing request {request_data}: {error_message}")
    else:
        logger.error(f"Error: {error_message}")
