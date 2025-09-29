/**
 * RAG Chatbot Service
 * ==================
 * 
 * This service handles all API calls to the integrated RAG chatbot system.
 * It provides a clean interface for the frontend to interact with the
 * AI-powered mentoring chatbot.
 */

export interface ChatRequest {
  message: string;
  user_id?: string;
  session_id?: string;
  context?: string;
}

export interface ChatResponse {
  response: string;
  status: string;
  context_used: boolean;
  timestamp: string;
  error?: string;
}

export interface RAGHealthResponse {
  status: string;
  message: string;
  rag_initialized: boolean;
  llm_connected: boolean;
}

class ChatbotService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8000') {
    this.baseUrl = baseUrl;
  }

  /**
   * Send a message to the AI mentor
   */
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      return {
        response: "Sorry, I'm having trouble connecting to the AI mentor. Please try again later.",
        status: "error",
        context_used: false,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Check RAG chatbot health
   */
  async checkHealth(): Promise<RAGHealthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/rag-health`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking RAG health:', error);
      return {
        status: "offline",
        message: "RAG system not available",
        rag_initialized: false,
        llm_connected: false
      };
    }
  }

  /**
   * Get a quick response for common questions
   */
  async getQuickResponse(question: string): Promise<string> {
    const response = await this.sendMessage({
      message: question,
      user_id: "anonymous",
      context: "internship_mentoring"
    });

    return response.response;
  }

  /**
   * Start a new chat session
   */
  async startSession(userId: string): Promise<boolean> {
    try {
      const response = await this.sendMessage({
        message: "Hello! I'm your AI mentor. How can I help you with your internship journey?",
        user_id: userId,
        session_id: `session_${Date.now()}`,
        context: "internship_mentoring"
      });

      return response.status === "success";
    } catch (error) {
      console.error('Error starting chat session:', error);
      return false;
    }
  }
}

// Export singleton instance
export const chatbotService = new ChatbotService();
export default chatbotService;
