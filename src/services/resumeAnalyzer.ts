// Skills-based Job Matching API Service
const API_BASE_URL = 'http://localhost:8000';

export interface JobRecommendation {
  job_title: string;
  company: string;
  similarity_score: number;
  skills: string;
  job_description: string;
  location?: string;
  experience?: string;
  salary?: string;
}

export interface MatchResponse {
  matches: JobRecommendation[];
  total_jobs_analyzed: number;
  processing_time_ms: number;
}

export class SkillsMatcherService {
  static async getJobMatches(skills: string[], topK: number = 5): Promise<MatchResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/match-jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skills: skills,
          top_k: topK
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting job matches:', error);
      throw error;
    }
  }

  static async checkHealth(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch (error) {
      console.error('Error checking API health:', error);
      throw error;
    }
  }
}