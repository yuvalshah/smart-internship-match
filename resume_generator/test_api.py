#!/usr/bin/env python3
"""
Test script for the Resume Generator API
"""

import requests
import json
import os

API_BASE_URL = "http://localhost:8000"

def test_health():
    """Test the health endpoint"""
    print("Testing health endpoint...")
    try:
        response = requests.get(f"{API_BASE_URL}/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Health check failed: {e}")
        return False

def test_templates():
    """Test the templates endpoint"""
    print("\nTesting templates endpoint...")
    try:
        response = requests.get(f"{API_BASE_URL}/templates")
        print(f"Status: {response.status_code}")
        print(f"Templates: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Templates test failed: {e}")
        return False

def test_resume_generation():
    """Test resume generation with sample data"""
    print("\nTesting resume generation...")
    
    sample_data = {
        "personal_info": {
            "first_name": "John",
            "last_name": "Doe", 
            "email": "john.doe@email.com",
            "phone": "(555) 123-4567",
            "address": "123 Main St, Anytown, ST 12345",
            "website": "https://johndoe.dev",
            "linkedin": "https://linkedin.com/in/johndoe",
            "github": "https://github.com/johndoe"
        },
        "education": [{
            "institution": "University of Technology",
            "degree": "Bachelor of Science",
            "field_of_study": "Computer Science",
            "graduation_date": "May 2024",
            "location": "Tech City, ST",
            "gpa": "3.8"
        }],
        "work_experience": [{
            "company": "Tech Innovations Inc",
            "position": "Software Developer Intern",
            "location": "San Francisco, CA",
            "start_date": "June 2023",
            "end_date": "August 2023",
            "description": "Developed web applications using React and Node.js. Worked with a team of 5 developers to build user-facing features. Improved application performance by optimizing database queries."
        }],
        "projects": [{
            "name": "E-commerce Platform",
            "description": "Built a full-stack e-commerce website with user authentication, product catalog, shopping cart, and payment processing. Implemented responsive design and optimized for mobile devices.",
            "technologies": ["React", "Node.js", "MongoDB", "Stripe API"],
            "start_date": "January 2024",
            "end_date": "March 2024",
            "github_url": "https://github.com/johndoe/ecommerce-platform"
        }],
        "skills": [
            {
                "category": "Programming Languages",
                "skills": ["JavaScript", "Python", "Java", "TypeScript"]
            },
            {
                "category": "Frameworks & Libraries", 
                "skills": ["React", "Node.js", "Express", "Django"]
            },
            {
                "category": "Databases",
                "skills": ["MongoDB", "PostgreSQL", "MySQL"]
            }
        ],
        "achievements": [{
            "title": "Dean's List",
            "description": "Achieved Dean's List recognition for maintaining GPA above 3.5",
            "date": "2023",
            "organization": "University of Technology"
        }],
        "template_choice": "professional"
    }
    
    # Test each template
    templates = ["professional", "graduate", "deedy"]
    
    for template in templates:
        print(f"\n  Testing {template} template...")
        sample_data["template_choice"] = template
        
        try:
            response = requests.post(
                f"{API_BASE_URL}/generate-resume",
                json=sample_data,
                timeout=60
            )
            
            if response.status_code == 200:
                # Save the PDF
                filename = f"test_resume_{template}.pdf"
                with open(filename, 'wb') as f:
                    f.write(response.content)
                print(f"    ✓ {template} template generated successfully: {filename}")
            else:
                print(f"    ✗ {template} template failed: {response.status_code}")
                print(f"    Error: {response.text}")
                
        except Exception as e:
            print(f"    ✗ {template} template error: {e}")

def main():
    """Run all tests"""
    print("Resume Generator API Test Suite")
    print("=" * 40)
    
    # Test if server is running
    if not test_health():
        print("\n❌ Server is not running or not responding")
        print("Please start the server with: python main.py")
        return
    
    # Test templates endpoint
    if not test_templates():
        print("\n❌ Templates endpoint failed")
        return
    
    # Test resume generation
    test_resume_generation()
    
    print("\n" + "=" * 40)
    print("Test suite completed!")
    print("\nGenerated files:")
    for file in os.listdir("."):
        if file.startswith("test_resume_") and file.endswith(".pdf"):
            print(f"  - {file}")

if __name__ == "__main__":
    main()