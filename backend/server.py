"""
server.py - Compatibility wrapper for Supervisor
This file imports the main FastAPI app from main.py
The actual application code is now in the modular structure.
"""
from main import app

# This allows both:
# - Supervisor to continue using: uvicorn server:app
# - Railway to use: uvicorn main:app
