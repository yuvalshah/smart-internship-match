#!/bin/bash

echo "🍎 macOS LaTeX Setup for Resume Generator"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    print_error "This script is designed for macOS only"
    exit 1
fi

print_info "Checking system requirements..."

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    print_warning "Homebrew not found. Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Add Homebrew to PATH for Apple Silicon Macs
    if [[ $(uname -m) == "arm64" ]]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
else
    print_status "Homebrew found"
fi

# Check if LaTeX is already installed
if command -v pdflatex &> /dev/null; then
    LATEX_PATH=$(which pdflatex)
    print_status "LaTeX already installed at: $LATEX_PATH"
    
    # Test LaTeX
    if pdflatex --version &> /dev/null; then
        print_status "LaTeX is working correctly"
        LATEX_VERSION=$(pdflatex --version | head -n1)
        print_info "Version: $LATEX_VERSION"
    else
        print_warning "LaTeX found but not working properly"
    fi
else
    print_warning "LaTeX not found. Installing MacTeX..."
    
    # Ask user for installation preference
    echo ""
    echo "Choose LaTeX installation option:"
    echo "1) MacTeX (no GUI) - Recommended, smaller download (~2GB)"
    echo "2) Full MacTeX - Includes GUI applications (~4GB)"
    echo "3) Skip LaTeX installation (use HTML/WeasyPrint fallback)"
    echo ""
    read -p "Enter your choice (1-3): " choice
    
    case $choice in
        1)
            print_info "Installing MacTeX (no GUI)..."
            brew install --cask mactex-no-gui
            ;;
        2)
            print_info "Installing Full MacTeX..."
            brew install --cask mactex
            ;;
        3)
            print_warning "Skipping LaTeX installation"
            print_info "System will use WeasyPrint for PDF generation"
            ;;
        *)
            print_error "Invalid choice. Exiting."
            exit 1
            ;;
    esac
fi

# Update PATH
print_info "Updating PATH configuration..."

# Add LaTeX to PATH in shell configuration
SHELL_CONFIG=""
if [[ $SHELL == *"zsh"* ]]; then
    SHELL_CONFIG="$HOME/.zshrc"
elif [[ $SHELL == *"bash"* ]]; then
    SHELL_CONFIG="$HOME/.bash_profile"
fi

if [[ -n "$SHELL_CONFIG" ]]; then
    # Check if LaTeX path is already in shell config
    if ! grep -q "/Library/TeX/texbin" "$SHELL_CONFIG" 2>/dev/null; then
        echo "" >> "$SHELL_CONFIG"
        echo "# LaTeX PATH for Resume Generator" >> "$SHELL_CONFIG"
        echo 'export PATH="/Library/TeX/texbin:$PATH"' >> "$SHELL_CONFIG"
        print_status "Added LaTeX to PATH in $SHELL_CONFIG"
    else
        print_status "LaTeX PATH already configured in $SHELL_CONFIG"
    fi
fi

# Update current session PATH
export PATH="/Library/TeX/texbin:$PATH"
eval "$(/usr/libexec/path_helper)"

# Verify installation
echo ""
print_info "Verifying LaTeX installation..."

if command -v pdflatex &> /dev/null; then
    LATEX_PATH=$(which pdflatex)
    print_status "LaTeX found at: $LATEX_PATH"
    
    # Test compilation
    TEMP_DIR=$(mktemp -d)
    cat > "$TEMP_DIR/test.tex" << 'EOF'
\documentclass{article}
\begin{document}
\title{Test Document}
\author{Resume Generator}
\date{\today}
\maketitle
This is a test document to verify LaTeX installation.
\end{document}
EOF
    
    cd "$TEMP_DIR"
    if pdflatex -interaction=nonstopmode test.tex &> /dev/null; then
        if [[ -f "test.pdf" ]]; then
            print_status "LaTeX compilation test successful"
        else
            print_warning "LaTeX compilation completed but PDF not generated"
        fi
    else
        print_error "LaTeX compilation test failed"
    fi
    
    # Cleanup
    rm -rf "$TEMP_DIR"
else
    print_warning "LaTeX not found after installation"
    print_info "You may need to restart your terminal or run:"
    echo "  source ~/.zshrc"
    echo "  eval \"\$(/usr/libexec/path_helper)\""
fi

# Setup Python backend
echo ""
print_info "Setting up Python backend..."

cd "$(dirname "$0")"

if [[ -d "backend" ]]; then
    cd backend
    
    # Create virtual environment if it doesn't exist
    if [[ ! -d "venv" ]]; then
        print_info "Creating Python virtual environment..."
        python3 -m venv venv
    fi
    
    # Activate virtual environment and install dependencies
    print_info "Installing Python dependencies..."
    source venv/bin/activate
    pip install --upgrade pip
    pip install -r requirements.txt
    
    print_status "Backend setup complete"
else
    print_warning "Backend directory not found"
fi

# Final status check
echo ""
print_info "Running final system check..."

# Check backend health
if [[ -d "backend" ]]; then
    cd backend
    source venv/bin/activate
    
    # Start server in background for testing
    python start_server.py &
    SERVER_PID=$!
    
    # Wait for server to start
    sleep 3
    
    # Test health endpoint
    if curl -s http://localhost:8002/resume-health > /dev/null; then
        HEALTH_RESPONSE=$(curl -s http://localhost:8002/resume-health)
        LATEX_AVAILABLE=$(echo "$HEALTH_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['latex_available'])")
        OUTPUT_FORMAT=$(echo "$HEALTH_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['output_format'])")
        
        if [[ "$LATEX_AVAILABLE" == "True" ]]; then
            print_status "Resume generator ready with LaTeX support"
            print_info "Output format: $OUTPUT_FORMAT"
        else
            print_warning "Resume generator ready with fallback support"
            print_info "Output format: $OUTPUT_FORMAT"
        fi
    else
        print_error "Could not connect to resume generator API"
    fi
    
    # Stop test server
    kill $SERVER_PID 2>/dev/null
fi

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "📋 Summary:"
echo "  • LaTeX Status: $(command -v pdflatex &> /dev/null && echo "✅ Installed" || echo "❌ Not found")"
echo "  • Python Backend: ✅ Ready"
echo "  • WeasyPrint Fallback: ✅ Available"
echo ""
echo "🚀 To start the resume generator:"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  python start_server.py"
echo ""
echo "🌐 Then visit: http://localhost:8002/resume-health"
echo ""

if ! command -v pdflatex &> /dev/null; then
    echo "⚠️  LaTeX Installation Notes:"
    echo "  • If LaTeX was just installed, restart your terminal"
    echo "  • Or run: source ~/.zshrc && eval \"\$(/usr/libexec/path_helper)\""
    echo "  • The system will use WeasyPrint for PDF generation as fallback"
    echo ""
fi