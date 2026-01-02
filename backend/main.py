"""gltz.de API - Main Application Entry Point

This is the main FastAPI application file for the gltz.de family website.
For deployment on Railway or similar platforms.
"""
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import logging
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Import database connection
from database import close_db_connection

# Import all route modules
from routes import admin, pages, blog, gallery, news, contacts, static_pages, landing, search

# Create FastAPI application
app = FastAPI(
    title="gltz.de API",
    description="Backend API for the gltz.de family website",
    version="1.0.0"
)

# Include all routers
app.include_router(admin.router)
app.include_router(pages.router)
app.include_router(blog.router)
app.include_router(gallery.router)
app.include_router(news.router)
app.include_router(contacts.router)
app.include_router(static_pages.router)
app.include_router(landing.router)
app.include_router(search.router)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Clean up resources on shutdown"""
    await close_db_connection()

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint for deployment monitoring"""
    return {"status": "healthy", "version": "1.0.0"}
