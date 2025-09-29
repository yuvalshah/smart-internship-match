#!/usr/bin/env python3
"""
Script to start the FastAPI server for SmartPM Resume Analyzer
"""

import uvicorn
import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    print("Starting SmartPM Resume Analyzer API Server...")
    print("API will be available at: http://localhost:8002")
    print("API Documentation: http://localhost:8002/docs")
    print("Health Check: http://localhost:8002/health")
    print("\nPress Ctrl+C to stop the server")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8002,
        reload=True,
        log_level="info"
    )