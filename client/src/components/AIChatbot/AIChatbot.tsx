import { useState, useRef, useEffect } from 'react';
import { chatbotService } from '../../services/api';
import { MessageSquare, Send, X, Sparkles, Bot, User, Minimize2, Loader2 } from 'lucide-react';

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

let msgId = 0;

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: ++msgId,
      role: 'assistant',
      content: '👋 Hello! I\'m your AI Payroll Assistant. Ask me anything about employees, salaries, leaves, loans, or payroll!\n\nTry: "What is Meera\'s net pay?" or "How many leaves are pending?"',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = {
      id: ++msgId,
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatbotService.sendMessage(trimmed);
      const botMsg: Message = {
        id: ++msgId,
        role: 'assistant',
        content: res.data.data.reply,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      const errMsg: Message = {
        id: ++msgId,
        role: 'assistant',
        content: '❌ Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickSuggestions = [
    "How many employees?",
    "Pending leaves",
    "Active loans",
    "Payroll summary",
  ];

  const formatContent = (content: string) => {
    // Convert markdown-like bold to HTML
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          id="ai-chatbot-fab"
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #3b25e7 0%, #7c3aed 50%, #a855f7 100%)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(59, 37, 231, 0.4), 0 0 0 0 rgba(59, 37, 231, 0.3)',
            zIndex: 9998,
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            animation: 'chatbot-pulse 2s ease-in-out infinite',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.08) translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(59, 37, 231, 0.5)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(59, 37, 231, 0.4)';
          }}
        >
          <Sparkles size={28} color="#fff" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            width: '420px',
            height: '600px',
            borderRadius: '24px',
            background: '#fff',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0,0,0,0.04)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'chatbot-slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #3b25e7, #7c3aed)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(59, 37, 231, 0.3)',
                }}
              >
                <Bot size={24} color="#fff" />
              </div>
              <div>
                <div style={{ color: '#fff', fontSize: '16px', fontWeight: '800', letterSpacing: '-0.01em' }}>
                  AI Payroll Assistant
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#10b981',
                      boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)',
                    }}
                  />
                  <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>
                    Online • Powered by AI
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  borderRadius: '10px',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.color = '#94a3b8';
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              backgroundColor: '#f8fafc',
            }}
          >
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: '10px',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg, #3b25e7, #6366f1)'
                      : '#e2e8f0',
                  }}
                >
                  {msg.role === 'user' ? (
                    <User size={16} color="#fff" />
                  ) : (
                    <Bot size={16} color="#475569" />
                  )}
                </div>
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '14px 18px',
                    borderRadius: msg.role === 'user'
                      ? '18px 18px 4px 18px'
                      : '18px 18px 18px 4px',
                    backgroundColor: msg.role === 'user' ? '#3b25e7' : '#fff',
                    color: msg.role === 'user' ? '#fff' : '#0f172a',
                    fontSize: '13.5px',
                    lineHeight: '1.6',
                    boxShadow: msg.role === 'user'
                      ? '0 2px 8px rgba(59, 37, 231, 0.2)'
                      : '0 1px 4px rgba(0,0,0,0.04)',
                    fontWeight: '500',
                  }}
                  dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
                />
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    background: '#e2e8f0',
                  }}
                >
                  <Bot size={16} color="#475569" />
                </div>
                <div
                  style={{
                    padding: '14px 18px',
                    borderRadius: '18px 18px 18px 4px',
                    backgroundColor: '#fff',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#64748b',
                    fontSize: '13px',
                    fontWeight: '500',
                  }}
                >
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  Thinking...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length <= 2 && !loading && (
            <div
              style={{
                padding: '0 20px 12px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                backgroundColor: '#f8fafc',
              }}
            >
              {quickSuggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(s);
                    setTimeout(() => {
                      const fakeMsg: Message = {
                        id: ++msgId,
                        role: 'user',
                        content: s,
                        timestamp: new Date(),
                      };
                      setMessages(prev => [...prev, fakeMsg]);
                      setInput('');
                      setLoading(true);
                      chatbotService.sendMessage(s)
                        .then(res => {
                          setMessages(prev => [...prev, {
                            id: ++msgId,
                            role: 'assistant',
                            content: res.data.data.reply,
                            timestamp: new Date(),
                          }]);
                        })
                        .catch(() => {
                          setMessages(prev => [...prev, {
                            id: ++msgId,
                            role: 'assistant',
                            content: '❌ Error occurred. Please try again.',
                            timestamp: new Date(),
                          }]);
                        })
                        .finally(() => setLoading(false));
                    }, 50);
                  }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '20px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#fff',
                    color: '#475569',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#3b25e7';
                    e.currentTarget.style.color = '#3b25e7';
                    e.currentTarget.style.backgroundColor = '#f5f3ff';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.color = '#475569';
                    e.currentTarget.style.backgroundColor = '#fff';
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div
            style={{
              padding: '16px 20px',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: '#fff',
            }}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask about payroll, leaves, employees..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                flex: 1,
                padding: '14px 18px',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                fontSize: '14px',
                color: '#0f172a',
                outline: 'none',
                fontWeight: '500',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = '#3b25e7';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 37, 231, 0.08)';
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '16px',
                border: 'none',
                background: input.trim() && !loading
                  ? 'linear-gradient(135deg, #3b25e7, #7c3aed)'
                  : '#e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: input.trim() && !loading ? 'pointer' : 'default',
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
            >
              <Send size={20} color={input.trim() && !loading ? '#fff' : '#94a3b8'} />
            </button>
          </div>
        </div>
      )}

      {/* Animations CSS */}
      <style>{`
        @keyframes chatbot-pulse {
          0%, 100% { box-shadow: 0 8px 32px rgba(59, 37, 231, 0.4), 0 0 0 0 rgba(59, 37, 231, 0.3); }
          50% { box-shadow: 0 8px 32px rgba(59, 37, 231, 0.4), 0 0 0 8px rgba(59, 37, 231, 0); }
        }
        @keyframes chatbot-slide-up {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
