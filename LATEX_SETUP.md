# LaTeX Installation Guide for Resume Generation

The resume generation system can work without LaTeX by generating HTML resumes, but for the best PDF output, install LaTeX on your system.

## Quick Installation

### macOS
```bash
# Using Homebrew (recommended)
brew install --cask mactex

# Or download directly from:
# https://www.tug.org/mactex/
```

### Ubuntu/Debian Linux
```bash
# Install basic LaTeX packages
sudo apt-get update
sudo apt-get install texlive-latex-base texlive-latex-extra texlive-fonts-recommended

# For full installation (larger download):
sudo apt-get install texlive-full
```

### Windows
1. Download MiKTeX from: https://miktex.org/
2. Run the installer and follow the setup wizard
3. Choose "Install missing packages on-the-fly: Yes"

### CentOS/RHEL/Fedora
```bash
# Fedora
sudo dnf install texlive-latex texlive-xetex

# CentOS/RHEL
sudo yum install texlive-latex texlive-xetex
```

## Verification

After installation, verify LaTeX is working:

```bash
# Check if pdflatex is available
pdflatex --version

# Check if xelatex is available (for advanced templates)
xelatex --version
```

## Current System Status

You can check if LaTeX is available on your server by visiting:
- http://localhost:8001/resume-health

This endpoint will show:
- ✅ LaTeX available → PDF generation
- ❌ LaTeX not available → HTML generation (can be printed as PDF)

## Troubleshooting

### macOS Issues
- If `brew install --cask mactex` fails, try updating Homebrew first:
  ```bash
  brew update
  brew upgrade
  ```

### Linux Issues
- If packages are missing, install the full TeXLive distribution:
  ```bash
  sudo apt-get install texlive-full
  ```

### Path Issues
- After installation, you may need to restart your terminal or add LaTeX to your PATH:
  ```bash
  # Add to ~/.bashrc or ~/.zshrc
  export PATH="/usr/local/texlive/2023/bin/x86_64-linux:$PATH"
  ```

### Server Restart
After installing LaTeX, restart the backend server:
```bash
cd backend
source venv/bin/activate
python start_server.py
```

## Alternative: HTML to PDF

If you can't install LaTeX, the system will generate HTML resumes that can be:
1. Opened in any web browser
2. Printed as PDF using browser's "Print to PDF" feature
3. Styled professionally with CSS

The HTML output includes print-optimized CSS for clean PDF conversion.