import React, { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AIMentorChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI mentor powered by advanced RAG technology with LM Studio integration. I can provide detailed guidance on internships across 20+ domains including Software Engineering, Data Science, Product Management, and more. How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'limited' | 'offline'>('checking');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Configuration for your RAG chatbot API
  const RAG_API_CONFIG = {
    endpoint: import.meta.env.VITE_RAG_API_URL || 'http://localhost:8000',
    headers: {
      'Content-Type': 'application/json',
    }
  };

  useEffect(() => {
    // Check RAG server status on component mount
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    console.log('Checking server status at:', RAG_API_CONFIG.endpoint);
    try {
      const response = await fetch(`${RAG_API_CONFIG.endpoint}/health`);
      console.log('Health check response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Health check data:', data);
        if (data.rag_initialized && data.llm_connected) {
          setConnectionStatus('connected');
        } else {
          setConnectionStatus('limited');
        }
      } else {
        setConnectionStatus('offline');
      }
    } catch (error) {
      console.error('Error checking server status:', error);
      setConnectionStatus('offline');
    }
  };

  const callRAGChatbot = async (userInput: string): Promise<string> => {
    console.log('Calling RAG chatbot with message:', userInput);
    try {
      const response = await fetch(`${RAG_API_CONFIG.endpoint}/chat`, {
        method: 'POST',
        headers: RAG_API_CONFIG.headers,
        body: JSON.stringify({
          message: userInput,
          context: 'internship_mentoring',
          user_id: 'student_user', // You can use actual user ID from auth context
          session_id: `session_${Date.now()}`, // Or maintain persistent sessions
        }),
      });

      console.log('RAG API response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('RAG API response data:', data);

      // Handle the response based on your API format
      if (data.status === 'success') {
        setConnectionStatus('connected');
        return data.response || 'Sorry, I encountered an error processing your request.';
      } else if (data.status === 'fallback') {
        setConnectionStatus('limited');
        return data.response || 'Sorry, I encountered an error processing your request.';
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }

    } catch (error) {
      console.error('Error calling RAG chatbot:', error);
      setConnectionStatus('offline');

      // Fallback to basic responses if RAG API is unavailable
      return getFallbackResponse(userInput);
    }
  };

  const getFallbackResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes('resume') || input.includes('cv')) {
      return "For a strong internship resume, focus on: 1) Quantify your impact with numbers, 2) Highlight leadership experiences, 3) Include relevant projects and skills, 4) Use action verbs. Would you like specific advice for any section? (Note: I'm currently in offline mode - please ensure the RAG server is running)";
    }

    if (input.includes('interview') || input.includes('prepare')) {
      return "For internship interviews, prepare for: 1) Behavioral questions (use STAR method), 2) Technical questions related to your field, 3) Questions about your projects, 4) Company-specific questions. Practice explaining your experiences clearly. (Note: I'm currently in offline mode)";
    }

    if (input.includes('skill') || input.includes('learn')) {
      return "Essential skills for internships vary by field, but generally include: 1) Technical skills relevant to your domain, 2) Communication and teamwork, 3) Problem-solving abilities, 4) Adaptability and learning mindset. What field are you interested in? (Note: I'm currently in offline mode)";
    }

    if (input.includes('apply') || input.includes('application')) {
      return "For successful internship applications: 1) Research companies thoroughly, 2) Tailor your resume for each role, 3) Write compelling cover letters, 4) Apply early and follow up professionally, 5) Network with professionals in your field. (Note: I'm currently in offline mode)";
    }

    return "I'm here to help with internship advice! Ask me about resume building, interview preparation, skill development, or application strategies. (Note: I'm currently in offline mode - please ensure the RAG server is running at http://localhost:8000)";
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      // Call your RAG chatbot API
      const aiResponse = await callRAGChatbot(currentInput);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110"
        >
          <span className="material-symbols-outlined text-white text-2xl">
            {isOpen ? 'close' : 'psychology'}
          </span>
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-80 h-96"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Card className="w-full h-full flex flex-col bg-white/95 backdrop-blur-xl border border-border/50 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-primary/10 to-secondary/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-sm">
                      psychology
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">AI Mentor</h3>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' :
                          connectionStatus === 'limited' ? 'bg-yellow-500' :
                            connectionStatus === 'checking' ? 'bg-blue-500 animate-pulse' :
                              'bg-red-500'
                        }`}></div>
                      <p className="text-xs text-muted-foreground">
                        {connectionStatus === 'connected' ? 'Full RAG Active' :
                          connectionStatus === 'limited' ? 'Limited Mode' :
                            connectionStatus === 'checking' ? 'Connecting...' :
                              'Offline Mode'}
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${message.isUser
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                        }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-muted text-foreground p-3 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border/50">
                <div className="flex gap-2">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask me anything about internships..."
                    className="flex-1 text-sm"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isTyping}
                    size="sm"
                    className="px-3"
                  >
                    <span className="material-symbols-outlined text-sm">send</span>
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIMentorChatbot;
