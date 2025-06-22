#!/usr/bin/env python3
"""
Test script to verify Chrome extension and server functionality
"""

import os
import sys
import subprocess
import time
import requests
import json

def check_extension_files():
    """Check if all required extension files exist"""
    required_files = [
        'chrome-extension/manifest.json',
        'chrome-extension/background.js',
        'chrome-extension/assistant.js',
        'chrome-extension/icon.png'
    ]
    
    missing_files = []
    for file_path in required_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
    
    if missing_files:
        print(f"❌ Missing required files: {missing_files}")
        return False
    else:
        print("✅ All required extension files found")
        return True

def check_server_files():
    """Check if all required server files exist"""
    required_files = [
        'server/server.py',
        'server/prompts.py',
        'server/requirements.txt'
    ]
    
    missing_files = []
    for file_path in required_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
    
    if missing_files:
        print(f"❌ Missing required server files: {missing_files}")
        return False
    else:
        print("✅ All required server files found")
        return True

def test_server_health():
    """Test if the server is running and healthy"""
    try:
        response = requests.get('http://localhost:5001/api/health', timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Server is healthy - API: {data.get('api', 'unknown')}")
            return True
        else:
            print(f"❌ Server returned status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Server is not running on localhost:5001")
        return False
    except Exception as e:
        print(f"❌ Error testing server: {e}")
        return False

def check_api_key():
    """Check if Gemini API key is set"""
    api_key = os.environ.get("GEMINI_API_KEY")
    if api_key:
        print("✅ GEMINI_API_KEY is set")
        return True
    else:
        print("❌ GEMINI_API_KEY is not set")
        print("   Please set your Gemini API key:")
        print("   export GEMINI_API_KEY='your-api-key-here'")
        return False

def validate_manifest():
    """Validate the manifest.json file"""
    try:
        with open('chrome-extension/manifest.json', 'r') as f:
            manifest = json.load(f)
        
        required_fields = ['manifest_version', 'name', 'version', 'permissions', 'background', 'content_scripts']
        missing_fields = []
        
        for field in required_fields:
            if field not in manifest:
                missing_fields.append(field)
        
        if missing_fields:
            print(f"❌ Missing required manifest fields: {missing_fields}")
            return False
        else:
            print("✅ Manifest.json is valid")
            return True
    except Exception as e:
        print(f"❌ Error validating manifest: {e}")
        return False

def main():
    print("🔍 Testing Chrome Extension and Server Setup")
    print("=" * 50)
    
    # Check extension files
    print("\n1. Checking extension files...")
    extension_ok = check_extension_files()
    
    # Check server files
    print("\n2. Checking server files...")
    server_files_ok = check_server_files()
    
    # Validate manifest
    print("\n3. Validating manifest.json...")
    manifest_ok = validate_manifest()
    
    # Check API key
    print("\n4. Checking API key...")
    api_key_ok = check_api_key()
    
    # Test server health
    print("\n5. Testing server health...")
    server_ok = test_server_health()
    
    # Summary
    print("\n" + "=" * 50)
    print("📋 SUMMARY:")
    
    if all([extension_ok, server_files_ok, manifest_ok, api_key_ok]):
        print("✅ Extension setup looks good!")
        if server_ok:
            print("✅ Server is running and healthy!")
            print("\n🚀 You can now:")
            print("   1. Load the extension in Chrome:")
            print("      - Go to chrome://extensions/")
            print("      - Enable 'Developer mode'")
            print("      - Click 'Load unpacked'")
            print("      - Select the 'chrome-extension' folder")
            print("   2. Visit any website and use the floating assistant!")
        else:
            print("⚠️  Server is not running. Start it with:")
            print("   cd server && python server.py")
    else:
        print("❌ Some issues found. Please fix them before loading the extension.")
        
        if not api_key_ok:
            print("\n💡 To get a Gemini API key:")
            print("   1. Go to https://makersuite.google.com/app/apikey")
            print("   2. Create a new API key")
            print("   3. Set it as environment variable: export GEMINI_API_KEY='your-key'")

if __name__ == "__main__":
    main() 