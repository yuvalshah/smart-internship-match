#!/usr/bin/env python3
"""
FastAPI server for the RAG chatbot system.
Uses the new RAG model with LangChain, ChromaDB, and LM Studio.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import logging
import uvicorn
from datetime import datetime
import asyncio
from contextlib import asynccontextmanager

# Import our RAG model
from rag import RAGModel

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global RAG model instance
rag_model = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global rag_model
    logger.info("🚀 Starting RAG system initialization...")
    
    rag_model = RAGModel()
    success = rag_model.initialize()
    
    if success:
        logger.info("✅ RAG system initialized successfully")
    else:
        logger.error("❌ RAG system initialization failed")
    
    yield
    
    # Shutdown
    logger.info("👋 Shutting down RAG system...")

# Initialize FastAPI app with lifespan
app = FastAPI(
    title="RAG Chatbot API",
    description="AI-powered internship mentoring chatbot using RAG with LM Studio",
    version="2.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:3000", "http://127.0.0.1:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = "anonymous"
    session_id: Optional[str] = None
    context: Optional[str] = "internship_mentoring"

class ChatResponse(BaseModel):
    response: str
    status: str
    context_used: bool
    timestamp: str
    error: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    message: str
    rag_initialized: bool
    llm_connected: bool

@app.get("/", response_model=HealthResponse)
async def root():
    """Root endpoint for health check."""
    global rag_model
    
    rag_initialized = rag_model is not None and rag_model.rag_chain is not None
    llm_connected = rag_model.test_connection() if rag_model else False
    
    return HealthResponse(
        status="online",
        message="RAG Chatbot API is running",
        rag_initialized=rag_initialized,
        llm_connected=llm_connected
    )

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Detailed health check endpoint."""
    global rag_model
    
    rag_initialized = rag_model is not None and rag_model.rag_chain is not None
    llm_connected = rag_model.test_connection() if rag_model else False
    
    status = "healthy" if rag_initialized and llm_connected else "degraded"
    
    return HealthResponse(
        status=status,
        message="RAG system health check",
        rag_initialized=rag_initialized,
        llm_connected=llm_connected
    )

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Main chat endpoint using RAG system."""
    global rag_model
    
    if not rag_model or not rag_model.rag_chain:
        return ChatResponse(
            response="I'm currently initializing my knowledge base. Please try again in a moment.",
            status="error",
            context_used=False,
            timestamp=datetime.now().isoformat(),
            error="RAG system not initialized"
        )
    
    if not request.message.strip():
        return ChatResponse(
            response="Please ask me a question about internships, career advice, or skill development!",
            status="error",
            context_used=False,
            timestamp=datetime.now().isoformat(),
            error="Empty message"
        )
    
    try:
        logger.info(f"Processing question: {request.message[:100]}...")
        
        # Query the RAG system
        response_text = rag_model.query(request.message)
        
        # Check if we got a valid response
        if "Error processing query" in response_text:
            return ChatResponse(
                response="I'm having trouble processing your request right now. Please ensure LM Studio is running with the phi-3.1-mini-4k-instruct model loaded.",
                status="error",
                context_used=False,
                timestamp=datetime.now().isoformat(),
                error="LLM processing error"
            )
        
        logger.info("Response generated successfully")
        
        return ChatResponse(
            response=response_text,
            status="success",
            context_used=True,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Error processing chat request: {str(e)}")
        
        # Fallback response
        fallback_response = get_fallback_response(request.message)
        
        return ChatResponse(
            response=fallback_response,
            status="fallback",
            context_used=False,
            timestamp=datetime.now().isoformat(),
            error=str(e)
        )

def get_fallback_response(message: str) -> str:
    """Provide fallback responses when RAG system fails."""
    message_lower = message.lower()
    
    if any(word in message_lower for word in ['software', 'programming', 'coding']):
        return "For software engineering internships: Focus on Data Structures & Algorithms, build projects like e-commerce websites or chat applications, practice on LeetCode, and apply to companies like Google, Microsoft, Amazon. (Note: I'm currently in limited mode - please ensure LM Studio is running)"
    
    elif any(word in message_lower for word in ['data science', 'machine learning', 'ml']):
        return "For data science internships: Learn Python, SQL, and machine learning. Build projects like customer churn prediction or sentiment analysis. Apply to companies like TCS, Infosys, Fractal Analytics. (Note: I'm currently in limited mode)"
    
    elif any(word in message_lower for word in ['resume', 'cv']):
        return "For a strong internship resume: 1) Quantify your impact with numbers, 2) Highlight relevant projects, 3) Include leadership experiences, 4) Use action verbs, 5) Keep it to 1-2 pages. (Note: I'm currently in limited mode)"
    
    else:
        return "I'm here to help with internship advice across 20+ domains! Ask me about software engineering, data science, product management, consulting, finance, and more. (Note: I'm currently in limited mode - please ensure LM Studio is running on http://127.0.0.1:1234)"

@app.post("/initialize")
async def force_initialize():
    """Force re-initialization of the RAG system."""
    global rag_model
    
    try:
        rag_model = RAGModel()
        success = rag_model.initialize()
        
        if success:
            return {"status": "success", "message": "RAG system re-initialized successfully"}
        else:
            raise Exception("Initialization failed")
            
    except Exception as e:
        logger.error(f"Failed to re-initialize RAG system: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Initialization failed: {str(e)}")

@app.get("/stats")
async def get_stats():
    """Get statistics about the RAG system."""
    global rag_model
    
    if not rag_model:
        return {"error": "RAG system not initialized"}
    
    return {
        "rag_initialized": rag_model.rag_chain is not None,
        "llm_connected": rag_model.test_connection(),
        "vector_db_path": rag_model.persist_directory,
        "model_name": "phi-3.1-mini-4k-instruct",
        "embedding_model": "all-MiniLM-L6-v2",
        "lm_studio_url": "http://127.0.0.1:1234"
    }

if __name__ == "__main__":
    print("🚀 Starting RAG Chatbot API Server...")
    print("📍 Server will be available at: http://localhost:8000")
    print("📖 API documentation at: http://localhost:8000/docs")
    print("🔍 Health check at: http://localhost:8000/health")
    print("📊 Stats at: http://localhost:8000/stats")
    print("")
    print("🔧 Requirements:")
    print("   • LM Studio running on http://127.0.0.1:1234")
    print("   • phi-3.1-mini-4k-instruct model loaded")
    print("   • rag.json file in current directory")
    print("")
    print("Press Ctrl+C to stop the server")
    print("=" * 50)
    
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )