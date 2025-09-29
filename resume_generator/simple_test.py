#!/usr/bin/env python3
"""
Simple test script to verify basic functionality without external dependencies
"""

import sys
import os
import tempfile
import subprocess
from datetime import datetime

def test_latex_availability():
    """Test if LaTeX is available"""
    print("Testing LaTeX availability...")
    
    try:
        result = subprocess.run(['pdflatex', '--version'], 
                              capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            print("✅ pdflatex is available")
            return True
        else:
            print("❌ pdflatex not working")
            return False
    except FileNotFoundError:
        print("❌ pdflatex not found")
        return False
    except subprocess.TimeoutExpired:
        print("❌ pdflatex timeout")
        return False

def test_xelatex_availability():
    """Test if XeLaTeX is available"""
    print("Testing XeLaTeX availability...")
    
    try:
        result = subprocess.run(['xelatex', '--version'], 
                              capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            print("✅ xelatex is available")
            return True
        else:
            print("❌ xelatex not working")
            return False
    except FileNotFoundError:
        print("❌ xelatex not found")
        return False
    except subprocess.TimeoutExpired:
        print("❌ xelatex timeout")
        return False

def test_resume_templates():
    """Test if resume templates exist"""
    print("Testing resume templates...")
    
    template_dir = "../resume"
    expected_templates = [
        "LaTeXTemplates_deedy-resume-cv_v1",
        "LaTeXTemplates_medium-length-graduate-cv_v1", 
        "LaTeXTemplates_medium-length-professional-cv_v3"
    ]
    
    if not os.path.exists(template_dir):
        print(f"❌ Template directory not found: {template_dir}")
        return False
    
    missing_templates = []
    for template in expected_templates:
        template_path = os.path.join(template_dir, template)
        if not os.path.exists(template_path):
            missing_templates.append(template)
    
    if missing_templates:
        print(f"❌ Missing templates: {missing_templates}")
        return False
    else:
        print("✅ All resume templates found")
        return True

def test_simple_latex_compilation():
    """Test basic LaTeX compilation"""
    print("Testing LaTeX compilation...")
    
    simple_latex = r"""
\documentclass{article}
\begin{document}
\title{Test Resume}
\author{Test User}
\date{\today}
\maketitle

\section{Education}
Test University - Bachelor of Science in Computer Science

\section{Experience}
Test Company - Software Developer Intern

\end{document}
"""
    
    try:
        with tempfile.TemporaryDirectory() as temp_dir:
            tex_file = os.path.join(temp_dir, "test.tex")
            
            # Write LaTeX file
            with open(tex_file, 'w') as f:
                f.write(simple_latex)
            
            # Compile with pdflatex
            result = subprocess.run(
                ['pdflatex', '-interaction=nonstopmode', 'test.tex'],
                cwd=temp_dir,
                capture_output=True,
                text=True,
                timeout=30
            )
            
            if result.returncode == 0:
                pdf_file = os.path.join(temp_dir, "test.pdf")
                if os.path.exists(pdf_file):
                    print("✅ LaTeX compilation successful")
                    return True
                else:
                    print("❌ PDF not generated")
                    return False
            else:
                print(f"❌ LaTeX compilation failed: {result.stderr}")
                return False
                
    except Exception as e:
        print(f"❌ LaTeX compilation error: {e}")
        return False

def test_professional_template():
    """Test professional template compilation"""
    print("Testing professional template...")
    
    professional_latex = r"""
\documentclass[11pt]{article}
\usepackage[margin=0.75in]{geometry}
\usepackage{array}
\usepackage{ifthen}
\pagestyle{empty}

% Simple resume class simulation
\newcommand{\name}[1]{\renewcommand{\name}{#1}}
\newcommand{\address}[1]{}
\newenvironment{rSection}[1]{
    \medskip
    \MakeUppercase{\textbf{#1}}
    \medskip
    \hrule
    \begin{list}{}{
        \setlength{\leftmargin}{1.5em}
    }
    \item[]
}{
    \end{list}
}

\newenvironment{rSubsection}[4]{
    \textbf{#1} \hfill {#2}
    \ifthenelse{\equal{#3}{}}{}{
        \\
        \textit{#3} \hfill \textit{#4}
    }%
    \smallskip
    \begin{list}{$\cdot$}{\leftmargin=0em}
        \setlength{\itemsep}{-0.5em} \vspace{-0.5em}
}{
    \end{list}
    \vspace{0.5em}
}

\name{John Doe}
\address{123 Main St \\ City, State 12345}
\address{(555) 123-4567 \\ john.doe@email.com}

\begin{document}

\begin{center}
{\huge\bfseries JOHN DOE}\\[5pt]
123 Main St, City, State 12345\\
(555) 123-4567 | john.doe@email.com
\end{center}

\begin{rSection}{Education}
\textbf{University of Technology} \hfill \textit{May 2024} \\
Bachelor of Science in Computer Science \\
GPA: 3.8
\end{rSection}

\begin{rSection}{Experience}
\begin{rSubsection}{Tech Corp}{June 2023 - August 2023}{Software Developer Intern}{City, State}
\item Developed web applications using React and Node.js
\item Collaborated with team of 5 developers on user-facing features
\item Improved application performance through database optimization
\end{rSubsection}
\end{rSection}

\begin{rSection}{Technical Strengths}
\begin{tabular}{@{} >{\bfseries}l @{\hspace{6ex}} l @{}}
Programming Languages & JavaScript, Python, Java \\
Frameworks & React, Node.js, Express \\
Databases & MongoDB, PostgreSQL
\end{tabular}
\end{rSection}

\end{document}
"""
    
    try:
        with tempfile.TemporaryDirectory() as temp_dir:
            tex_file = os.path.join(temp_dir, "professional_test.tex")
            
            # Write LaTeX file
            with open(tex_file, 'w') as f:
                f.write(professional_latex)
            
            # Compile with pdflatex
            result = subprocess.run(
                ['pdflatex', '-interaction=nonstopmode', 'professional_test.tex'],
                cwd=temp_dir,
                capture_output=True,
                text=True,
                timeout=30
            )
            
            if result.returncode == 0:
                pdf_file = os.path.join(temp_dir, "professional_test.pdf")
                if os.path.exists(pdf_file):
                    print("✅ Professional template compilation successful")
                    
                    # Copy to current directory for inspection
                    import shutil
                    shutil.copy2(pdf_file, "test_professional_resume.pdf")
                    print("📄 Test resume saved as: test_professional_resume.pdf")
                    return True
                else:
                    print("❌ Professional template PDF not generated")
                    return False
            else:
                print(f"❌ Professional template compilation failed: {result.stderr}")
                return False
                
    except Exception as e:
        print(f"❌ Professional template error: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Resume Generator System Tests")
    print("=" * 40)
    
    tests = [
        ("LaTeX Availability", test_latex_availability),
        ("XeLaTeX Availability", test_xelatex_availability),
        ("Resume Templates", test_resume_templates),
        ("Basic LaTeX Compilation", test_simple_latex_compilation),
        ("Professional Template", test_professional_template)
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n🔍 {test_name}")
        print("-" * 30)
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ Test failed with exception: {e}")
            results.append((test_name, False))
    
    print("\n" + "=" * 40)
    print("📊 Test Results Summary")
    print("=" * 40)
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
        if result:
            passed += 1
    
    print(f"\nPassed: {passed}/{len(results)} tests")
    
    if passed == len(results):
        print("\n🎉 All tests passed! The system is ready for use.")
    elif passed >= len(results) - 1:
        print("\n⚠️  Most tests passed. System should work with minor limitations.")
    else:
        print("\n❌ Multiple tests failed. Please check your setup.")
        print("\nSetup instructions:")
        print("1. Install LaTeX: brew install --cask mactex (macOS)")
        print("2. Ensure resume templates are in ../resume/ directory")
        print("3. Check file permissions")

if __name__ == "__main__":
    main()