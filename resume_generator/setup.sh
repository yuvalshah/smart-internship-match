#!/bin/bash

echo "🚀 Setting up Resume Generator System"
echo "===================================="

# Check Python
echo "📋 Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi
echo "✅ Python found: $(python3 --version)"

# Check LaTeX
echo "📋 Checking LaTeX installation..."
if ! command -v pdflatex &> /dev/null; then
    echo "⚠️  pdflatex not found. Installing LaTeX..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            echo "Installing MacTeX via Homebrew..."
            brew install --cask mactex
        else
            echo "❌ Homebrew not found. Please install MacTeX manually from https://www.tug.org/mactex/"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        echo "Installing TeX Live..."
        sudo apt-get update
        sudo apt-get install -y texlive-full
    else
        echo "❌ Unsupported OS. Please install LaTeX manually."
        exit 1
    fi
else
    echo "✅ LaTeX found: $(pdflatex --version | head -n1)"
fi

# Check XeLaTeX (needed for Deedy template)
if ! command -v xelatex &> /dev/null; then
    echo "⚠️  XeLaTeX not found (needed for Deedy template)"
else
    echo "✅ XeLaTeX found"
fi

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip3 install -r requirements.txt

# Create directories
echo "📁 Creating directories..."
mkdir -p generated_resumes
mkdir -p logs

# Check if resume templates exist
echo "📋 Checking resume templates..."
if [ ! -d "../resume" ]; then
    echo "❌ Resume templates directory not found at ../resume"
    echo "Please ensure the resume folder is in the parent directory"
    exit 1
fi

echo "✅ Resume templates found"

# Test LM Studio connection (optional)
echo "📋 Checking LM Studio connection..."
if curl -s http://localhost:1234/v1/models > /dev/null 2>&1; then
    echo "✅ LM Studio is running and accessible"
else
    echo "⚠️  LM Studio not detected (optional for AI enhancement)"
    echo "   To enable AI features:"
    echo "   1. Download LM Studio from https://lmstudio.ai/"
    echo "   2. Load the Phi-3-mini-4k-instruct model"
    echo "   3. Start the local server on port 1234"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "To start the system:"
echo "  1. Start the backend: python3 main.py"
echo "  2. The API will be available at http://localhost:8000"
echo "  3. Test with: python3 test_api.py"
echo ""
echo "For frontend integration, use the ResumeBuilder.jsx component"
echo "in your React application."