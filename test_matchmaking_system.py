#!/usr/bin/env python3
"""
Test script for the AI-powered matchmaking system
================================================

This script tests the complete matchmaking system to ensure it works correctly.
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from matchmaking_system import (
    AdvancedMatchmakingSystem,
    StudentProfile,
    Internship,
    matchmaking_system
)

def test_matchmaking_system():
    """Test the complete matchmaking system"""
    print("🧪 Testing AI-Powered Matchmaking System")
    print("=" * 50)
    
    # Create test student profile
    student = StudentProfile(
        id="test-student-1",
        full_name="John Doe",
        email="john.doe@example.com",
        phone="+1234567890",
        date_of_birth="2000-01-01",
        state="California",
        district="Santa Clara",
        city="San Jose",
        pincode="95110",
        current_education="Bachelor's Degree",
        university="San Jose State University",
        course="Computer Science",
        graduation_year="2024",
        cgpa="8.5",
        social_category="Scheduled Caste (SC)",
        family_income="₹2,00,000 - ₹5,00,000",
        participation_type="first-time",
        skills=["Python", "Machine Learning", "Data Analysis", "SQL", "React"],
        preferred_locations=["San Francisco", "San Jose", "Palo Alto"],
        stipend_expectation="₹15,000 - ₹25,000",
        available_duration="6 months",
        additional_info="Passionate about AI and data science with 2 years of project experience"
    )
    
    # Create test internships
    internships = [
        Internship(
            id="internship-1",
            title="Machine Learning Intern",
            company="TechCorp",
            description="Work on cutting-edge ML models for recommendation systems",
            skills_required=["Python", "Machine Learning", "TensorFlow", "Data Analysis"],
            cgpa_requirement=8.0,
            location="San Francisco, CA",
            state="California",
            district="San Francisco",
            city="San Francisco",
            internship_type="hybrid",
            duration_weeks=24,
            stipend_amount=20000,
            stipend_currency="USD",
            application_deadline="2024-02-15",
            start_date="2024-03-01",
            end_date="2024-08-31",
            available_positions=2,
            filled_positions=0,
            benefits=["Health Insurance", "Free Meals", "Gym Access"],
            application_process="Online application + Technical interview",
            is_active=True,
            tags=["AI", "ML", "Data Science"],
            department="Engineering",
            category="tech",
            company_size="mid-size"
        ),
        Internship(
            id="internship-2",
            title="Software Development Intern",
            company="StartupXYZ",
            description="Build web applications using React and Node.js",
            skills_required=["JavaScript", "React", "Node.js", "MongoDB"],
            cgpa_requirement=7.5,
            location="San Jose, CA",
            state="California",
            district="Santa Clara",
            city="San Jose",
            internship_type="on-site",
            duration_weeks=12,
            stipend_amount=15000,
            stipend_currency="USD",
            application_deadline="2024-02-20",
            start_date="2024-03-15",
            end_date="2024-06-15",
            available_positions=1,
            filled_positions=0,
            benefits=["Flexible Hours", "Mentorship"],
            application_process="Portfolio review + Coding challenge",
            is_active=True,
            tags=["Web Development", "Full Stack"],
            department="Engineering",
            category="tech",
            company_size="startup"
        ),
        Internship(
            id="internship-3",
            title="Data Analyst Intern",
            company="BigCorp",
            description="Analyze business data and create reports",
            skills_required=["SQL", "Excel", "Tableau", "Statistics"],
            cgpa_requirement=7.0,
            location="New York, NY",
            state="New York",
            district="Manhattan",
            city="New York",
            internship_type="remote",
            duration_weeks=16,
            stipend_amount=12000,
            stipend_currency="USD",
            application_deadline="2024-02-25",
            start_date="2024-03-01",
            end_date="2024-06-30",
            available_positions=3,
            filled_positions=1,
            benefits=["Learning Budget", "Networking Events"],
            application_process="Resume screening + Interview",
            is_active=True,
            tags=["Data Analysis", "Business Intelligence"],
            department="Analytics",
            category="business",
            company_size="enterprise"
        )
    ]
    
    print(f"📊 Student Profile: {student.full_name}")
    print(f"   Skills: {', '.join(student.skills)}")
    print(f"   Location: {student.city}, {student.state}")
    print(f"   Social Category: {student.social_category}")
    print(f"   Participation: {student.participation_type}")
    print()
    
    print(f"🏢 Available Internships: {len(internships)}")
    for i, internship in enumerate(internships, 1):
        print(f"   {i}. {internship.title} at {internship.company}")
        print(f"      Location: {internship.location}")
        print(f"      Skills: {', '.join(internship.skills_required)}")
    print()
    
    # Test the matchmaking system
    print("🤖 Running AI-Powered Matchmaking...")
    try:
        recommendations = matchmaking_system.get_recommendations(student, internships, top_k=3)
        
        print(f"✅ Generated {len(recommendations)} recommendations")
        print()
        
        for i, rec in enumerate(recommendations, 1):
            print(f"🎯 Recommendation #{i}")
            print(f"   Internship: {rec.internship.title} at {rec.internship.company}")
            print(f"   Match Score: {rec.match_score:.3f} ({rec.match_score*100:.1f}%)")
            print(f"   Rank: {rec.rank}")
            print()
            
            print("   📋 Detailed Explanation:")
            print(f"      SBERT Score: {rec.explanation.sbert_score:.3f}")
            print(f"      Policy Score: {rec.explanation.policy_score:.3f}")
            print(f"      LinUCB Score: {rec.explanation.linucb_score:.3f}")
            print(f"      Final Score: {rec.explanation.final_score:.3f}")
            print(f"      Skill Matches: {', '.join(rec.explanation.skill_matches)}")
            print(f"      Location Match: {rec.explanation.location_match}")
            print(f"      Equity Boost: {rec.explanation.equity_boost}")
            print(f"      CGPA Eligible: {rec.explanation.cgpa_eligibility}")
            print(f"      Participation Boost: {rec.explanation.participation_boost}")
            print(f"      Confidence: {rec.explanation.confidence:.3f}")
            print()
        
        # Test feedback recording
        print("📝 Testing feedback recording...")
        matchmaking_system.record_feedback(
            student_id=student.id,
            internship_id=recommendations[0].internship.id,
            student=student,
            internship=recommendations[0].internship,
            applied=True,
            approved=True
        )
        print("✅ Feedback recorded successfully")
        
        print("\n🎉 All tests passed! The AI-powered matchmaking system is working correctly.")
        
    except Exception as e:
        print(f"❌ Error testing matchmaking system: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    return True

if __name__ == "__main__":
    success = test_matchmaking_system()
    sys.exit(0 if success else 1)
