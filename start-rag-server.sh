#!/bin/bash

echo "🚀 Starting RAG Chatbot Server..."
echo "📍 Make sure LM Studio is running on http://127.0.0.1:1234"
echo "📍 Make sure phi-3.1-mini-4k-instruct model is loaded"
echo ""

# Navigate to RAG directory and start server
cd rag
source rag_env/bin/activate
python server.py