#!/usr/bin/env python3
"""
Script to check Gemini API credits and test connectivity
"""

import os
import requests
import json
from dotenv import load_dotenv

def check_api_key():
    """Check if Gemini API key is set and valid"""
    load_dotenv()
    api_key = os.environ.get("GEMINI_API_KEY")
    
    if not api_key:
        print("❌ GEMINI_API_KEY is not set")
        print("\n💡 To get a Gemini API key:")
        print("   1. Go to https://makersuite.google.com/app/apikey")
        print("   2. Create a new API key")
        print("   3. Set it as environment variable: export GEMINI_API_KEY='your-key'")
        return None
    
    print("✅ GEMINI_API_KEY is set")
    return api_key

def test_api_connectivity(api_key):
    """Test if the API key works with a simple request"""
    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        
        # Try vision models first for visual analysis
        model_names = [
            'gemini-1.5-pro-vision',
            'gemini-pro-vision',
            'gemini-1.5-pro',
            'gemini-1.5-flash',
            'gemini-pro'
        ]
        
        for model_name in model_names:
            try:
                print(f"   Trying model: {model_name}")
                model = genai.GenerativeModel(model_name)
                
                # Simple test request
                response = model.generate_content("Hello, this is a test. Please respond with 'API is working' if you can see this message.")
                
                if response.text:
                    print(f"✅ API connectivity test successful with model: {model_name}")
                    print(f"   Response: {response.text}")
                    return True, model_name
                else:
                    print(f"   Model {model_name} returned empty response")
                    
            except Exception as e:
                print(f"   Model {model_name} failed: {str(e)[:100]}...")
                continue
        
        print("❌ All model attempts failed")
        return False, None
            
    except Exception as e:
        print(f"❌ API connectivity test failed: {e}")
        return False, None

def check_usage_dashboard():
    """Provide information about checking usage"""
    print("\n📊 To check your API usage and credits:")
    print("   1. Go to https://makersuite.google.com/app/apikey")
    print("   2. Click on your API key")
    print("   3. Check the 'Usage' tab")
    print("   4. Monitor your quota and billing")

def main():
    print("🔍 Checking Gemini API Setup")
    print("=" * 40)
    
    # Check API key
    api_key = check_api_key()
    if not api_key:
        return
    
    # Test connectivity
    print("\n🧪 Testing API connectivity...")
    success, working_model = test_api_connectivity(api_key)
    
    if success:
        print(f"\n✅ Your Gemini API is working correctly with model: {working_model}!")
        print("   You can now use the Chrome extension.")
        
        # Update the server to use the working model
        print(f"\n💡 Note: The server will use model: {working_model}")
    else:
        print("\n❌ API connectivity issues detected.")
        print("   Please check your API key and try again.")
    
    # Usage information
    check_usage_dashboard()

if __name__ == "__main__":
    main() 