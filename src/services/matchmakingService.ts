/**
 * AI-Powered Matchmaking Service
 * =============================
 * 
 * This service handles all API calls to the backend matchmaking system.
 * It provides a clean interface for the frontend to interact with the
 * AI-powered recommendation engine.
 */

export interface StudentProfileData {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  state: string;
  district: string;
  city: string;
  pincode: string;
  current_education: string;
  university: string;
  course: string;
  graduation_year: string;
  cgpa: string;
  social_category: string;
  family_income: string;
  participation_type: string;
  skills: string[];
  preferred_locations: string[];
  stipend_expectation: string;
  available_duration: string;
  additional_info: string;
}

export interface InternshipData {
  id: string;
  title: string;
  company: string;
  description: string;
  skills_required: string[];
  cgpa_requirement?: number;
  location: string;
  state: string;
  district: string;
  city: string;
  internship_type: string;
  duration_weeks: number;
  stipend_amount?: number;
  stipend_currency: string;
  application_deadline: string;
  start_date: string;
  end_date: string;
  available_positions: number;
  filled_positions: number;
  benefits: string[];
  application_process: string;
  is_active: boolean;
  tags: string[];
  department: string;
  category: string;
  company_size: string;
}

export interface MatchExplanation {
  sbert_score: number;
  policy_score: number;
  linucb_score: number;
  final_score: number;
  skill_matches: string[];
  location_match: string;
  equity_boost: string;
  cgpa_eligibility: boolean;
  participation_boost: string;
  confidence: number;
}

export interface Recommendation {
  internship: InternshipData;
  match_score: number;
  rank: number;
  explanation: MatchExplanation;
}

export interface MatchmakingRequest {
  student_profile: StudentProfileData;
  internships: InternshipData[];
  top_k?: number;
}

export interface FeedbackRequest {
  student_id: string;
  internship_id: string;
  student_profile: StudentProfileData;
  internship: InternshipData;
  applied: boolean;
  approved: boolean;
}

class MatchmakingService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8000') {
    this.baseUrl = baseUrl;
  }

  /**
   * Get AI-powered internship recommendations for a student
   */
  async getRecommendations(
    studentProfile: StudentProfileData,
    internships: InternshipData[],
    topK: number = 10
  ): Promise<Recommendation[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_profile: studentProfile,
          internships: internships,
          top_k: topK
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const recommendations = await response.json();
      return recommendations;
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
      throw error;
    }
  }

  /**
   * Record student feedback for adaptive learning
   */
  async recordFeedback(feedback: FeedbackRequest): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Feedback recorded:', result);
    } catch (error) {
      console.error('Error recording feedback:', error);
      throw error;
    }
  }

  /**
   * Check the health of the matchmaking system
   */
  async checkHealth(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/matchmaking-health`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking matchmaking health:', error);
      throw error;
    }
  }

  /**
   * Convert frontend student profile to API format
   */
  convertStudentProfile(profile: any): StudentProfileData {
    return {
      id: profile.id || 'temp-id',
      full_name: profile.fullName || '',
      email: profile.email || '',
      phone: profile.phone || '',
      date_of_birth: profile.dateOfBirth || '',
      state: profile.state || '',
      district: profile.district || '',
      city: profile.city || '',
      pincode: profile.pincode || '',
      current_education: profile.currentEducation || '',
      university: profile.university || '',
      course: profile.course || '',
      graduation_year: profile.graduationYear || '',
      cgpa: profile.cgpa || '',
      social_category: profile.socialCategory || '',
      family_income: profile.familyIncome || '',
      participation_type: profile.participationType || 'first-time',
      skills: profile.skills || [],
      preferred_locations: profile.preferredLocations || [],
      stipend_expectation: profile.stipendExpectation || '',
      available_duration: profile.availableDuration || '',
      additional_info: profile.additionalInfo || ''
    };
  }

  /**
   * Convert frontend internship to API format
   */
  convertInternship(internship: any): InternshipData {
    return {
      id: internship.id || '',
      title: internship.title || '',
      company: internship.company || '',
      description: internship.description || '',
      skills_required: internship.skills || [],
      cgpa_requirement: internship.cgpaRequirement || null,
      location: internship.location || '',
      state: internship.state || '',
      district: internship.district || '',
      city: internship.city || '',
      internship_type: internship.type || 'on-site',
      duration_weeks: internship.durationWeeks || 12,
      stipend_amount: internship.stipendAmount || null,
      stipend_currency: internship.stipendCurrency || 'USD',
      application_deadline: internship.deadline || '',
      start_date: internship.startDate || '',
      end_date: internship.endDate || '',
      available_positions: internship.availablePositions || 1,
      filled_positions: internship.filledPositions || 0,
      benefits: internship.benefits || [],
      application_process: internship.applicationProcess || '',
      is_active: internship.isActive !== false,
      tags: internship.tags || [],
      department: internship.department || '',
      category: internship.category || 'other',
      company_size: internship.companySize || 'mid-size'
    };
  }

  /**
   * Get formatted match reasons for display
   */
  formatMatchReasons(explanation: MatchExplanation): string[] {
    const reasons: string[] = [];
    
    // Add skill matches
    if (explanation.skill_matches.length > 0) {
      reasons.push(`Skills: ${explanation.skill_matches.join(', ')}`);
    } else {
      reasons.push('Skills: No direct matches');
    }
    
    // Add location match
    reasons.push(`Location: ${explanation.location_match}`);
    
    // Add equity boost
    if (explanation.equity_boost !== 'Equity boost for General') {
      reasons.push(`Equity: ${explanation.equity_boost}`);
    }
    
    // Add CGPA eligibility
    reasons.push(`CGPA: ${explanation.cgpa_eligibility ? 'Eligible' : 'Not eligible'}`);
    
    // Add participation boost
    if (explanation.participation_boost !== 'Unknown participation type') {
      reasons.push(`Participation: ${explanation.participation_boost}`);
    }
    
    // Add confidence
    reasons.push(`Confidence: ${(explanation.confidence * 100).toFixed(1)}%`);
    
    return reasons;
  }
}

// Export singleton instance
export const matchmakingService = new MatchmakingService();
export default matchmakingService;
