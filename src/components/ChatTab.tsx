import { useState, useRef, useEffect } from 'react';
import { httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import { functionsEu } from '../lib/auth/firebaseProvider';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessage {
  from: 'ai' | 'user';
  text: string;
  references?: Array<{ title: string; uri: string }>;
}

interface ChatTabProps {
  role?: 'resident' | 'committee' | 'agent';
}

const CONFIG = {
  resident: {
    chatId: 'chat-resident',
    subtitle: 'Ask anything about your service charges, lease, AGM decisions, or building documents.',
    greeting: "Hello Terry! I'm the Bofast AI assistant for Maple House. I have access to your AGM minutes, building insurance certificate, and the major works consultation. What would you like to know?",
    avatarInitial: 'T',
    suggestions: [
      'What are my service charges?',
      'When is the next AGM?',
      'Pets policy?',
      'Can I sublet?',
    ],
  },
  committee: {
    chatId: 'chat-committee',
    subtitle: 'Ask anything about building compliance, resident issues, service charges, or governance documents.',
    greeting: "Hello Emma! I'm the Bofast AI assistant for Maple House. I have access to all building documents including committee-only files, AGM minutes, and maintenance records. How can I help?",
    avatarInitial: 'E',
    suggestions: [
      'Summarise the service charge breakdown',
      'Any compliance issues to flag?',
      'Draft AGM notice for November',
      'Status of major works?',
    ],
  },
  agent: {
    chatId: 'chat-agent',
    subtitle: 'Query documents, compliance data, and resident information across all buildings you manage.',
    greeting: "Hello! I'm the Bofast AI assistant. I have access to all managed buildings and their documents. What would you like to know?",
    avatarInitial: 'A',
    suggestions: [
      'List buildings with open issues',
      'Any overdue compliance certificates?',
      'Summarise AGM minutes',
      'Show recent service charges',
    ],
  },
} as const;

export function ChatTab({ role = 'resident' }: ChatTabProps) {
  const cfg = CONFIG[role];
  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: 'ai', text: cfg.greeting },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([...cfg.suggestions]);
  const msgsRef = useRef<HTMLDivElement>(null);
  const [aiStatus, setAiStatus] = useState<{ status: string; documentCount: number } | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchStatus = async () => {
      try {
        const getAiStatusFn = httpsCallable<void, { status: string; documentCount: number }>(functionsEu, 'getAiStatus');
        const result = await getAiStatusFn();
        if (isMounted) setAiStatus(result.data);
      } catch (e) {
        console.error(e);
        if (isMounted) setAiStatus({ status: 'Offline', documentCount: 0 });
      }
    };
    fetchStatus();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const trimmed = text.trim();
    setMessages(prev => [...prev, { from: 'user' as const, text: trimmed }]);
    setInputValue('');
    setIsTyping(true);

    try {
      if (import.meta.env.DEV) {
        connectFunctionsEmulator(functionsEu, 'localhost', 5001);
      }
      const askAi = httpsCallable<
        { query: string; sessionId: string | null },
        { reply: string; sessionId: string; references: Array<{ title: string; uri: string }>; relatedQuestions: string[] }
      >(functionsEu, 'askAi');

      const result = await askAi({ query: trimmed, sessionId });

      setMessages(prev => [
        ...prev,
        {
          from: 'ai',
          text: result.data.reply,
          references: result.data.references
        }
      ]);
      setSessionId(result.data.sessionId);
      setDynamicSuggestions(result.data.relatedQuestions);
    } catch (error: unknown) {
      console.error("AI Error:", error);
      setMessages(prev => [
        ...prev,
        { from: 'ai', text: "Sorry, I'm having trouble connecting to my building knowledge base right now. Please try again in a moment." }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage(inputValue);
  };

  return (
    <div className="tc on">
      <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '16px' }}>
        {cfg.subtitle}
      </p>
      <div className="chat-wrap" id={cfg.chatId}>
        <div className="chat-hd">
          <div className="chat-av">💬✨</div>
          <div>
            <div className="chat-ai-name">Bofast AI Assistant</div>
            <div className="chat-ai-status">
              <div className={`chat-ai-dot ${aiStatus?.status === 'Offline' ? 'offline' : ''}`}></div>
              {aiStatus ? `${aiStatus.status} · ${aiStatus.documentCount} document${aiStatus.documentCount === 1 ? '' : 's'} indexed` : 'Connecting...'}
            </div>
          </div>
        </div>

        <div className="chat-msgs" id={`${cfg.chatId}-msgs`} ref={msgsRef}>
          {messages.map((msg, i) =>
            msg.from === 'ai' ? (
              <div key={i} className="chat-msg">
                <div className="cm-av ai-av">{cfg.avatarInitial}</div>
                <div className="bubble ai-b">
                  <div className="markdown-body">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                  {msg.references && msg.references.length > 0 && (
                    <div className="chat-refs">
                      <div className="refs-title">References:</div>
                      {Array.from(new Map(msg.references.map(r => [r.uri, r])).values()).map((ref, idx) => (
                        <a key={idx} href={ref.uri} target="_blank" rel="noopener noreferrer" className="ref-link">
                          📄 {ref.title || 'Document'}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div key={i} className="chat-msg user-msg">
                <div className="cm-av usr-av">Me</div>
                <div className="bubble usr-b">{msg.text}</div>
              </div>
            )
          )}
          {isTyping && (
            <div className="chat-msg">
              <div className="cm-av ai-av">{cfg.avatarInitial}</div>
              <div className="bubble ai-b" style={{ opacity: 0.6 }}>
                <span className="typing-dots">Thinking…</span>
              </div>
            </div>
          )}
        </div>

        <div className="chat-sugg" id={`${cfg.chatId}-sugg`}>
          {dynamicSuggestions.map((s) => (
            <div key={s} className="sugg-chip" onClick={() => sendMessage(s)}>
              {s}
            </div>
          ))}
        </div>

        <div className="chat-input-row">
          <input
            className="chat-in"
            type="text"
            placeholder="Ask about your building…"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="chat-send" onClick={() => sendMessage(inputValue)}>➤</button>
        </div>
      </div>
    </div>
  );
}
