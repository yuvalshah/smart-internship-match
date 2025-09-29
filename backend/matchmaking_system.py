#!/usr/bin/env python3
"""
Advanced AI-Powered Internship Matchmaking System
=================================================

This module implements a comprehensive internship recommendation system that combines:
1. SBERT embeddings for semantic skill similarity
2. Policy-aware weighted scoring for equity and fairness
3. LinUCB contextual bandit for adaptive learning
4. Transparent explanations for each recommendation

Author: AI Assistant
Date: 2025
"""

import numpy as np
import pandas as pd
from typing import List, Dict, Any, Tuple, Optional
from dataclasses import dataclass
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import json
import logging
from datetime import datetime
import sqlite3
import os
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class StudentProfile:
    """Student profile data structure"""
    id: str
    full_name: str
    email: str
    phone: str
    date_of_birth: str
    state: str
    district: str
    city: str
    pincode: str
    current_education: str
    university: str
    course: str
    graduation_year: str
    cgpa: str
    social_category: str
    family_income: str
    participation_type: str  # 'first-time' or 'returning'
    skills: List[str]
    preferred_locations: List[str]
    stipend_expectation: str
    available_duration: str
    additional_info: str

@dataclass
class Internship:
    """Internship data structure"""
    id: str
    title: str
    company: str
    description: str
    skills_required: List[str]
    cgpa_requirement: Optional[float]
    location: str
    state: str
    district: str
    city: str
    internship_type: str  # 'remote', 'on-site', 'hybrid'
    duration_weeks: int
    stipend_amount: Optional[float]
    stipend_currency: str
    application_deadline: str
    start_date: str
    end_date: str
    available_positions: int
    filled_positions: int
    benefits: List[str]
    application_process: str
    is_active: bool
    tags: List[str]
    department: str
    category: str
    company_size: str

@dataclass
class MatchExplanation:
    """Detailed explanation for a match"""
    sbert_score: float
    policy_score: float
    linucb_score: float
    final_score: float
    skill_matches: List[str]
    location_match: str
    equity_boost: str
    cgpa_eligibility: bool
    participation_boost: str
    confidence: float

@dataclass
class Recommendation:
    """Complete recommendation with explanation"""
    internship: Internship
    match_score: float
    explanation: MatchExplanation
    rank: int

class SBERTEmbeddingService:
    """Service for generating and managing SBERT embeddings"""
    
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        """Initialize SBERT model"""
        self.model_name = model_name
        self.model = None
        self._load_model()
    
    def _load_model(self):
        """Load the SBERT model"""
        try:
            logger.info(f"Loading SBERT model: {self.model_name}")
            self.model = SentenceTransformer(self.model_name)
            logger.info("SBERT model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load SBERT model: {e}")
            raise
    
    def encode_skills(self, skills: List[str]) -> np.ndarray:
        """Encode skills into embeddings"""
        if not skills:
            return np.zeros((1, 384))  # Default dimension for all-MiniLM-L6-v2
        
        # Combine skills into a single text for better context
        skills_text = " ".join(skills)
        return self.model.encode([skills_text])
    
    def encode_description(self, description: str) -> np.ndarray:
        """Encode job description into embeddings"""
        if not description:
            return np.zeros((1, 384))
        
        return self.model.encode([description])
    
    def calculate_similarity(self, student_skills: List[str], 
                           internship_skills: List[str], 
                           internship_description: str) -> float:
        """Calculate semantic similarity between student and internship"""
        try:
            # Encode student skills
            student_embedding = self.encode_skills(student_skills)
            
            # Combine internship skills and description
            internship_text = " ".join(internship_skills) + " " + internship_description
            internship_embedding = self.encode_description(internship_text)
            
            # Calculate cosine similarity
            similarity = cosine_similarity(student_embedding, internship_embedding)[0][0]
            
            return float(similarity)
        except Exception as e:
            logger.error(f"Error calculating SBERT similarity: {e}")
            return 0.0

class PolicyAwareScoring:
    """Policy-aware scoring system for equity and fairness"""
    
    def __init__(self):
        """Initialize policy scoring weights"""
        self.weights = {
            'location': 0.25,
            'social_category': 0.20,
            'participation_type': 0.15,
            'family_income': 0.10,
            'cgpa_eligibility': 0.15,
            'stipend_expectation': 0.10,
            'available_duration': 0.05
        }
    
    def calculate_location_score(self, student: StudentProfile, internship: Internship) -> Tuple[float, str]:
        """Calculate location-based score with detailed explanation"""
        # Exact location match (city + district)
        if (internship.city == student.city and 
            internship.district == student.district):
            return 1.0, f"Exact location match: {internship.city}, {internship.district}"
        
        # Same district
        if internship.district == student.district:
            return 0.8, f"Same district: {internship.district}"
        
        # Same state
        if internship.state == student.state:
            return 0.6, f"Same state: {internship.state}"
        
        # Preferred location match
        if any(loc.lower() in internship.location.lower() 
               for loc in student.preferred_locations):
            return 0.4, f"Matches preferred location: {internship.location}"
        
        # Remote work preference
        if internship.internship_type == 'remote':
            return 0.3, "Remote work opportunity"
        
        return 0.1, "Different location"
    
    def calculate_social_category_score(self, student: StudentProfile) -> Tuple[float, str]:
        """Calculate social category equity boost"""
        equity_categories = {
            'Scheduled Caste (SC)': 1.0,
            'Scheduled Tribe (ST)': 1.0,
            'Other Backward Classes (OBC)': 0.8,
            'Economically Weaker Section (EWS)': 0.8,
            'Person with Disability (PwD)': 1.0,
            'Minority': 0.6,
            'General': 0.0
        }
        
        score = equity_categories.get(student.social_category, 0.0)
        return score, f"Equity boost for {student.social_category}"
    
    def calculate_participation_score(self, student: StudentProfile) -> Tuple[float, str]:
        """Calculate participation type score"""
        if student.participation_type == 'first-time':
            return 0.8, "First-time participant support"
        elif student.participation_type == 'returning':
            return 0.6, "Returning participant"
        else:
            return 0.5, "Unknown participation type"
    
    def calculate_income_score(self, student: StudentProfile, internship: Internship) -> Tuple[float, str]:
        """Calculate family income-based score"""
        if not student.family_income or not internship.stipend_amount:
            return 0.5, "Income data not available"
        
        # Parse income range (assuming format like "₹2,00,000 - ₹5,00,000")
        try:
            income_str = student.family_income.replace('₹', '').replace(',', '')
            if '-' in income_str:
                min_income, max_income = map(int, income_str.split(' - '))
                avg_income = (min_income + max_income) / 2
            else:
                avg_income = int(income_str)
            
            # Higher boost for lower income families
            if avg_income < 200000:  # Less than 2 lakhs
                return 1.0, "High priority: Low family income"
            elif avg_income < 500000:  # Less than 5 lakhs
                return 0.8, "Medium priority: Moderate family income"
            elif avg_income < 1000000:  # Less than 10 lakhs
                return 0.6, "Standard priority: Middle income"
            else:
                return 0.4, "Lower priority: Higher family income"
        except:
            return 0.5, "Could not parse income data"
    
    def calculate_cgpa_eligibility(self, student: StudentProfile, internship: Internship) -> Tuple[float, str]:
        """Calculate CGPA eligibility score"""
        if not internship.cgpa_requirement:
            return 1.0, "No CGPA requirement specified"
        
        try:
            student_cgpa = float(student.cgpa)
            required_cgpa = float(internship.cgpa_requirement)
            
            if student_cgpa >= required_cgpa:
                # Bonus for exceeding requirement
                if student_cgpa >= required_cgpa + 0.5:
                    return 1.0, f"Exceeds CGPA requirement ({student_cgpa} >= {required_cgpa})"
                else:
                    return 0.9, f"Meets CGPA requirement ({student_cgpa} >= {required_cgpa})"
            else:
                # Partial score for being close
                if student_cgpa >= required_cgpa - 0.5:
                    return 0.6, f"Close to CGPA requirement ({student_cgpa} vs {required_cgpa})"
                else:
                    return 0.2, f"Below CGPA requirement ({student_cgpa} < {required_cgpa})"
        except:
            return 0.5, "Could not parse CGPA data"
    
    def calculate_stipend_score(self, student: StudentProfile, internship: Internship) -> Tuple[float, str]:
        """Calculate stipend expectation match score"""
        if not student.stipend_expectation or not internship.stipend_amount:
            return 0.5, "Stipend data not available"
        
        try:
            # Parse student expectation (assuming format like "₹5,000 - ₹10,000")
            exp_str = student.stipend_expectation.replace('₹', '').replace(',', '')
            if '-' in exp_str:
                min_exp, max_exp = map(int, exp_str.split(' - '))
                avg_exp = (min_exp + max_exp) / 2
            else:
                avg_exp = int(exp_str)
            
            stipend = float(internship.stipend_amount)
            
            # Calculate match score
            if stipend >= avg_exp:
                return 1.0, f"Stipend meets expectation (₹{stipend:,.0f} >= ₹{avg_exp:,.0f})"
            elif stipend >= avg_exp * 0.8:
                return 0.8, f"Stipend close to expectation (₹{stipend:,.0f} vs ₹{avg_exp:,.0f})"
            elif stipend >= avg_exp * 0.6:
                return 0.6, f"Stipend below expectation (₹{stipend:,.0f} vs ₹{avg_exp:,.0f})"
            else:
                return 0.3, f"Stipend significantly below expectation (₹{stipend:,.0f} vs ₹{avg_exp:,.0f})"
        except:
            return 0.5, "Could not parse stipend data"
    
    def calculate_duration_score(self, student: StudentProfile, internship: Internship) -> Tuple[float, str]:
        """Calculate duration availability score"""
        if not student.available_duration or not internship.duration_weeks:
            return 0.5, "Duration data not available"
        
        try:
            # Parse student availability (assuming format like "3 months", "6 months")
            avail_str = student.available_duration.lower()
            if 'month' in avail_str:
                months = int(''.join(filter(str.isdigit, avail_str)))
                student_weeks = months * 4.33  # Approximate weeks per month
            elif 'week' in avail_str:
                student_weeks = int(''.join(filter(str.isdigit, avail_str)))
            else:
                return 0.5, "Could not parse duration format"
            
            internship_weeks = int(internship.duration_weeks)
            
            if student_weeks >= internship_weeks:
                return 1.0, f"Available duration sufficient ({student_weeks:.0f} weeks >= {internship_weeks} weeks)"
            elif student_weeks >= internship_weeks * 0.8:
                return 0.8, f"Available duration close to requirement ({student_weeks:.0f} weeks vs {internship_weeks} weeks)"
            else:
                return 0.4, f"Available duration below requirement ({student_weeks:.0f} weeks < {internship_weeks} weeks)"
        except:
            return 0.5, "Could not parse duration data"
    
    def calculate_policy_score(self, student: StudentProfile, internship: Internship) -> Tuple[float, Dict[str, Any]]:
        """Calculate overall policy-aware score"""
        scores = {}
        explanations = {}
        
        # Location score
        loc_score, loc_explanation = self.calculate_location_score(student, internship)
        scores['location'] = loc_score
        explanations['location'] = loc_explanation
        
        # Social category score
        soc_score, soc_explanation = self.calculate_social_category_score(student)
        scores['social_category'] = soc_score
        explanations['social_category'] = soc_explanation
        
        # Participation type score
        part_score, part_explanation = self.calculate_participation_score(student)
        scores['participation_type'] = part_score
        explanations['participation_type'] = part_explanation
        
        # Family income score
        inc_score, inc_explanation = self.calculate_income_score(student, internship)
        scores['family_income'] = inc_score
        explanations['family_income'] = inc_explanation
        
        # CGPA eligibility score
        cgpa_score, cgpa_explanation = self.calculate_cgpa_eligibility(student, internship)
        scores['cgpa_eligibility'] = cgpa_score
        explanations['cgpa_eligibility'] = cgpa_explanation
        
        # Stipend expectation score
        stip_score, stip_explanation = self.calculate_stipend_score(student, internship)
        scores['stipend_expectation'] = stip_score
        explanations['stipend_expectation'] = stip_explanation
        
        # Duration availability score
        dur_score, dur_explanation = self.calculate_duration_score(student, internship)
        scores['available_duration'] = dur_score
        explanations['available_duration'] = dur_explanation
        
        # Calculate weighted average
        total_score = sum(scores[key] * self.weights[key] for key in scores)
        
        return total_score, {
            'scores': scores,
            'explanations': explanations,
            'weights': self.weights
        }

class LinUCBContextualBandit:
    """LinUCB contextual bandit for adaptive learning"""
    
    def __init__(self, context_dim: int = 50, alpha: float = 1.0):
        """Initialize LinUCB bandit"""
        self.context_dim = context_dim
        self.alpha = alpha
        self.arms = {}  # internship_id -> arm parameters
        self.db_path = "matchmaking_learning.db"
        self._init_database()
    
    def _init_database(self):
        """Initialize SQLite database for learning data"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Create tables for learning data
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS interactions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    student_id TEXT,
                    internship_id TEXT,
                    context_vector TEXT,
                    reward REAL,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS arm_parameters (
                    internship_id TEXT PRIMARY KEY,
                    A_matrix TEXT,
                    b_vector TEXT,
                    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            conn.commit()
            conn.close()
            logger.info("LinUCB database initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize LinUCB database: {e}")
    
    def _create_context_vector(self, student: StudentProfile, internship: Internship, 
                             sbert_score: float, policy_score: float) -> np.ndarray:
        """Create context vector for LinUCB"""
        # Combine various features into context vector
        context = []
        
        # Student features
        context.extend([
            float(student.cgpa) if student.cgpa else 0.0,
            len(student.skills),
            1.0 if student.participation_type == 'first-time' else 0.0,
            1.0 if student.social_category in ['Scheduled Caste (SC)', 'Scheduled Tribe (ST)'] else 0.0,
            1.0 if student.social_category in ['Other Backward Classes (OBC)', 'Economically Weaker Section (EWS)'] else 0.0,
            1.0 if student.social_category == 'Person with Disability (PwD)' else 0.0,
        ])
        
        # Internship features
        context.extend([
            float(internship.cgpa_requirement) if internship.cgpa_requirement else 0.0,
            len(internship.skills_required),
            float(internship.stipend_amount) if internship.stipend_amount else 0.0,
            float(internship.duration_weeks) if internship.duration_weeks else 0.0,
            1.0 if internship.internship_type == 'remote' else 0.0,
            1.0 if internship.internship_type == 'hybrid' else 0.0,
        ])
        
        # Match scores
        context.extend([sbert_score, policy_score])
        
        # Location match features
        location_match = 0.0
        if internship.city == student.city and internship.district == student.district:
            location_match = 1.0
        elif internship.district == student.district:
            location_match = 0.8
        elif internship.state == student.state:
            location_match = 0.6
        context.append(location_match)
        
        # Pad or truncate to context_dim
        while len(context) < self.context_dim:
            context.append(0.0)
        context = context[:self.context_dim]
        
        return np.array(context, dtype=np.float32)
    
    def _get_arm_parameters(self, internship_id: str) -> Tuple[np.ndarray, np.ndarray]:
        """Get arm parameters from database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute(
                "SELECT A_matrix, b_vector FROM arm_parameters WHERE internship_id = ?",
                (internship_id,)
            )
            result = cursor.fetchone()
            conn.close()
            
            if result:
                A_matrix = np.array(json.loads(result[0]))
                b_vector = np.array(json.loads(result[1]))
                return A_matrix, b_vector
            else:
                # Initialize new arm
                A_matrix = np.eye(self.context_dim)
                b_vector = np.zeros(self.context_dim)
                return A_matrix, b_vector
        except Exception as e:
            logger.error(f"Error getting arm parameters: {e}")
            return np.eye(self.context_dim), np.zeros(self.context_dim)
    
    def _update_arm_parameters(self, internship_id: str, A_matrix: np.ndarray, b_vector: np.ndarray):
        """Update arm parameters in database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute(
                "INSERT OR REPLACE INTO arm_parameters (internship_id, A_matrix, b_vector) VALUES (?, ?, ?)",
                (internship_id, json.dumps(A_matrix.tolist()), json.dumps(b_vector.tolist()))
            )
            conn.commit()
            conn.close()
        except Exception as e:
            logger.error(f"Error updating arm parameters: {e}")
    
    def _record_interaction(self, student_id: str, internship_id: str, 
                          context_vector: np.ndarray, reward: float):
        """Record interaction for learning"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute(
                "INSERT INTO interactions (student_id, internship_id, context_vector, reward) VALUES (?, ?, ?, ?)",
                (student_id, internship_id, json.dumps(context_vector.tolist()), reward)
            )
            conn.commit()
            conn.close()
        except Exception as e:
            logger.error(f"Error recording interaction: {e}")
    
    def select_arm(self, student: StudentProfile, internship: Internship, 
                   sbert_score: float, policy_score: float) -> Tuple[float, float]:
        """Select arm using LinUCB algorithm"""
        internship_id = internship.id
        context_vector = self._create_context_vector(student, internship, sbert_score, policy_score)
        
        # Get arm parameters
        A_matrix, b_vector = self._get_arm_parameters(internship_id)
        
        try:
            # Calculate LinUCB score
            A_inv = np.linalg.inv(A_matrix)
            theta = A_inv @ b_vector
            
            # Calculate upper confidence bound
            confidence = self.alpha * np.sqrt(context_vector.T @ A_inv @ context_vector)
            linucb_score = theta.T @ context_vector + confidence
            
            return float(linucb_score), float(confidence)
        except np.linalg.LinAlgError:
            # Fallback if matrix is singular
            return 0.5, 0.1
    
    def update_arm(self, student_id: str, internship_id: str, 
                   context_vector: np.ndarray, reward: float):
        """Update arm parameters based on feedback"""
        try:
            # Get current parameters
            A_matrix, b_vector = self._get_arm_parameters(internship_id)
            
            # Update parameters
            A_matrix += np.outer(context_vector, context_vector)
            b_vector += reward * context_vector
            
            # Save updated parameters
            self._update_arm_parameters(internship_id, A_matrix, b_vector)
            
            # Record interaction
            self._record_interaction(student_id, internship_id, context_vector, reward)
            
        except Exception as e:
            logger.error(f"Error updating arm: {e}")

class AdvancedMatchmakingSystem:
    """Main matchmaking system that combines all components"""
    
    def __init__(self):
        """Initialize the matchmaking system"""
        self.sbert_service = SBERTEmbeddingService()
        self.policy_scorer = PolicyAwareScoring()
        self.linucb_bandit = LinUCBContextualBandit()
        
        # Scoring weights
        self.weights = {
            'sbert': 0.4,      # 40% for semantic similarity
            'policy': 0.4,     # 40% for policy/equity factors
            'linucb': 0.2      # 20% for adaptive learning
        }
    
    def calculate_match(self, student: StudentProfile, internship: Internship) -> Recommendation:
        """Calculate comprehensive match score and explanation"""
        
        # 1. Calculate SBERT semantic similarity
        sbert_score = self.sbert_service.calculate_similarity(
            student.skills,
            internship.skills_required,
            internship.description
        )
        
        # 2. Calculate policy-aware score
        policy_score, policy_details = self.policy_scorer.calculate_policy_score(student, internship)
        
        # 3. Calculate LinUCB adaptive score
        linucb_score, confidence = self.linucb_bandit.select_arm(
            student, internship, sbert_score, policy_score
        )
        
        # 4. Calculate final weighted score
        final_score = (
            self.weights['sbert'] * sbert_score +
            self.weights['policy'] * policy_score +
            self.weights['linucb'] * linucb_score
        )
        
        # 5. Create detailed explanation
        explanation = MatchExplanation(
            sbert_score=sbert_score,
            policy_score=policy_score,
            linucb_score=linucb_score,
            final_score=final_score,
            skill_matches=self._find_skill_matches(student.skills, internship.skills_required),
            location_match=policy_details['explanations']['location'],
            equity_boost=policy_details['explanations']['social_category'],
            cgpa_eligibility=policy_details['scores']['cgpa_eligibility'] > 0.5,
            participation_boost=policy_details['explanations']['participation_type'],
            confidence=confidence
        )
        
        return Recommendation(
            internship=internship,
            match_score=final_score,
            explanation=explanation,
            rank=0  # Will be set when ranking
        )
    
    def _find_skill_matches(self, student_skills: List[str], internship_skills: List[str]) -> List[str]:
        """Find matching skills between student and internship"""
        matches = []
        for skill in internship_skills:
            for student_skill in student_skills:
                if (skill.lower() in student_skill.lower() or 
                    student_skill.lower() in skill.lower()):
                    matches.append(skill)
                    break
        return matches
    
    def get_recommendations(self, student: StudentProfile, internships: List[Internship], 
                          top_k: int = 10) -> List[Recommendation]:
        """Get top-k recommendations for a student"""
        
        # Calculate matches for all internships
        recommendations = []
        for internship in internships:
            if internship.is_active:  # Only consider active internships
                recommendation = self.calculate_match(student, internship)
                recommendations.append(recommendation)
        
        # Sort by final score (descending)
        recommendations.sort(key=lambda x: x.match_score, reverse=True)
        
        # Set ranks and return top-k
        for i, rec in enumerate(recommendations[:top_k]):
            rec.rank = i + 1
        
        return recommendations[:top_k]
    
    def record_feedback(self, student_id: str, internship_id: str, 
                       student: StudentProfile, internship: Internship,
                       applied: bool, approved: bool):
        """Record student feedback for learning"""
        
        # Calculate reward (1 if applied AND approved, 0 otherwise)
        reward = 1.0 if (applied and approved) else 0.0
        
        # Calculate context vector
        sbert_score = self.sbert_service.calculate_similarity(
            student.skills, internship.skills_required, internship.description
        )
        policy_score, _ = self.policy_scorer.calculate_policy_score(student, internship)
        
        context_vector = self.linucb_bandit._create_context_vector(
            student, internship, sbert_score, policy_score
        )
        
        # Update LinUCB bandit
        self.linucb_bandit.update_arm(student_id, internship_id, context_vector, reward)
        
        logger.info(f"Recorded feedback: student={student_id}, internship={internship_id}, "
                   f"applied={applied}, approved={approved}, reward={reward}")

# Global instance
matchmaking_system = AdvancedMatchmakingSystem()
