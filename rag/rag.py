#!/usr/bin/env python3
"""
Simple RAG model using LangChain, ChromaDB, and LM Studio.
This connects to your phi-3.1-mini-4k-instruct model running on http://127.0.0.1:1234
"""

import json
import os
from typing import List, Optional
from langchain_openai import ChatOpenAI
from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

class RAGModel:
    def __init__(self, json_path: str = "rag.json", persist_directory: str = "vector_db"):
        self.json_path = json_path
        self.persist_directory = persist_directory
        self.llm = None
        self.vectorstore = None
        self.retriever = None
        self.rag_chain = None
        
    def setup_llm(self):
        """Setup connection to LM Studio running phi-3.1-mini-4k-instruct"""
        print("🤖 Connecting to LM Studio...")
        self.llm = ChatOpenAI(
            base_url="http://127.0.0.1:1234/v1",
            api_key="lm-studio",
            model="phi-3.1-mini-4k-instruct",
            temperature=0.1,
            max_tokens=500,
            top_p=0.9,
        )
        print("✅ Connected to LM Studio")
        
    def load_and_process_data(self):
        """Load JSON data and create text chunks"""
        print(f"📄 Loading data from {self.json_path}...")
        
        if not os.path.exists(self.json_path):
            raise FileNotFoundError(f"RAG data file not found: {self.json_path}")
            
        with open(self.json_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        
        # Convert JSON data to documents
        documents = []
        for item in data:
            # Create a comprehensive text representation of each domain
            content = f"""
Domain: {item.get('domain', 'Unknown')}

Eligibility: {item.get('eligibility', 'Not specified')}

Required Skills:
{chr(10).join(f"• {skill}" for skill in item.get('skills_required', []))}

Recommended Projects:
{chr(10).join(f"• {project}" for project in item.get('projects_recommended', []))}

Common Employers:
{chr(10).join(f"• {employer}" for employer in item.get('common_employers', []))}

Career Tips: {item.get('career_tips', 'No tips available')}

Internship Advice: {item.get('internship_advice', 'No advice available')}
"""
            
            documents.append(Document(
                page_content=content,
                metadata={
                    "domain": item.get('domain', 'Unknown'),
                    "source": "internship_guidance"
                }
            ))
        
        print(f"✅ Loaded {len(documents)} domain documents")
        
        # Split documents into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )
        
        chunks = text_splitter.split_documents(documents)
        print(f"✅ Created {len(chunks)} text chunks")
        
        return chunks
        
    def setup_vectorstore(self, chunks):
        """Create ChromaDB vector store with embeddings"""
        print("🧠 Setting up vector store...")
        
        # Use HuggingFace embeddings
        embeddings = HuggingFaceEmbeddings(
            model_name="all-MiniLM-L6-v2",
            model_kwargs={'device': 'cpu'}
        )
        
        # Create ChromaDB vector store
        self.vectorstore = Chroma.from_documents(
            documents=chunks,
            embedding=embeddings,
            persist_directory=self.persist_directory
        )
        
        # Create retriever
        self.retriever = self.vectorstore.as_retriever(
            search_kwargs={"k": 3}
        )
        
        print("✅ Vector store ready")
        
    def setup_rag_chain(self):
        """Setup the RAG chain with prompt template"""
        print("⚙️ Setting up RAG chain...")
        
        # Create prompt template optimized for phi-3.1
        prompt = ChatPromptTemplate.from_template("""
You are an expert career advisor specializing in internships. Use the following context to provide detailed, actionable advice.

Context:
{context}

Question: {question}

Instructions:
- Provide specific, practical advice based on the context
- Include relevant skills, companies, and tips when available
- If the question is about a specific domain, focus on that domain's information
- Be encouraging and supportive
- If you cannot find relevant information in the context, say so clearly

Answer:
""")
        
        # Create the RAG chain
        def format_docs(docs):
            return "\n\n".join(doc.page_content for doc in docs)
        
        self.rag_chain = (
            {"context": self.retriever | format_docs, "question": RunnablePassthrough()}
            | prompt
            | self.llm
            | StrOutputParser()
        )
        
        print("✅ RAG chain ready")
        
    def initialize(self):
        """Initialize the complete RAG system"""
        print("🚀 Initializing RAG system...")
        
        try:
            # Setup LLM connection
            self.setup_llm()
            
            # Load and process data
            chunks = self.load_and_process_data()
            
            # Setup vector store
            self.setup_vectorstore(chunks)
            
            # Setup RAG chain
            self.setup_rag_chain()
            
            print("🎉 RAG system initialized successfully!")
            return True
            
        except Exception as e:
            print(f"❌ Failed to initialize RAG system: {str(e)}")
            return False
    
    def query(self, question: str) -> str:
        """Query the RAG system"""
        if not self.rag_chain:
            return "RAG system not initialized. Please call initialize() first."
        
        try:
            response = self.rag_chain.invoke(question)
            return response
        except Exception as e:
            return f"Error processing query: {str(e)}"
    
    def test_connection(self) -> bool:
        """Test LM Studio connection"""
        if not self.llm:
            return False
        
        try:
            response = self.llm.invoke("Hello")
            return True
        except Exception:
            return False

# Example usage
if __name__ == "__main__":
    # Initialize RAG model
    rag = RAGModel()
    
    if rag.initialize():
        # Test queries
        test_questions = [
            "How do I prepare for software engineering internships?",
            "What skills do I need for data science roles?",
            "Which companies hire for product management internships?"
        ]
        
        print("\n" + "="*50)
        print("Testing RAG system:")
        print("="*50)
        
        for question in test_questions:
            print(f"\n❓ Question: {question}")
            print("-" * 30)
            answer = rag.query(question)
            print(f"💡 Answer: {answer}")
            print("-" * 50)
    else:
        print("Failed to initialize RAG system")