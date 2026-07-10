import { connectFunctionsEmulator, httpsCallable } from 'firebase/functions';
import { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '../contexts/AuthContext';
import { db, functionsEu } from '../lib/auth/firebaseProvider';
import type { UserRole } from '../lib/auth/userRole';
import { collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import styles from './Chat.module.css';

interface ChatMessage {
  from: 'ai' | 'user';
  text: string;
  references?: Array<{ title: string; uri: string }>;
}

interface ChatSession {
  id: string;
  title: string;
  agentBuilderSessionId: string | null;
  messages: ChatMessage[];
  relatedQuestions: string[];
  createdAt: any;
  updatedAt: any;
}

interface ChatTabProps {
  role?: UserRole;
}

type ChatConfig = {
  readonly chatId: string;
  readonly subtitle: string;
  readonly greeting: (name: string) => string;
  readonly avatarInitial: string;
  readonly suggestions: string[];
}

const CHAT_CONFIG: { [role in UserRole]: ChatConfig } = {
  resident: {
    chatId: 'chat-resident',
    subtitle: 'Ask anything about your service charges, lease, AGM decisions, or building documents.',
    greeting: (name: string) => `Hello ${name}! I'm the Bofast AI assistant for Maple House. I have access to your AGM minutes, building insurance certificate, and the major works consultation. What would you like to know?`,
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
    greeting: (name: string) => `Hello ${name}! I'm the Bofast AI assistant for Maple House. I have access to all building documents including committee-only files, AGM minutes, and maintenance records. How can I help?`,
    avatarInitial: 'E',
    suggestions: [
      'Summarise the service charge breakdown',
      'Any compliance issues to flag?',
      'Draft AGM notice for November',
      'Status of major works?',
    ],
  },
  director: {
    chatId: 'chat-committee',
    subtitle: 'Ask anything about building compliance, resident issues, service charges, or governance documents.',
    greeting: (name: string) => `Hello ${name}! I'm the Bofast AI assistant for Maple House. I have access to all building documents including committee-only files, AGM minutes, and maintenance records. How can I help?`,
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
    greeting: (name: string) => `Hello ${name}! I'm the Bofast AI assistant. I have access to all managed buildings and their documents. What would you like to know?`,
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
  const cfg = CHAT_CONFIG[role];
  const { user } = useAuth();
  const displayName = user?.firstName.trim() || 'Resident';

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([...cfg.suggestions]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiStatus, setAiStatus] = useState<{ status: string; documentCount: number } | null>(null);
  const msgsRef = useRef<HTMLDivElement>(null);

  const defaultGreeting: ChatMessage = { from: 'ai', text: cfg.greeting(displayName) };

  // Fetch AI engine status
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

  // Sync and fetch user chat sessions from Firestore
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'users', user.uid, 'chat_sessions'),
      orderBy('updatedAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: ChatSession[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as ChatSession);
      });
      setSessions(list);
    });
    return () => unsubscribe();
  }, [user]);

  // Derive active session
  const activeSession = useMemo(() => sessions.find((s) => s.id === activeSessionId), [activeSessionId, sessions]);
  const currentMessages = useMemo(() => activeSession ? activeSession.messages : [defaultGreeting], [activeSession, defaultGreeting]);

  // Sync suggestion chips based on active session
  useEffect(() => {
    if (activeSession) {
      setDynamicSuggestions(activeSession.relatedQuestions || []);
    } else {
      setDynamicSuggestions([...cfg.suggestions]);
    }
  }, [activeSessionId, activeSession, cfg]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }
  }, [currentMessages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !user) return;
    const trimmed = text.trim();
    setInputValue('');
    setIsTyping(true);

    const userMessage: ChatMessage = { from: 'user', text: trimmed };

    try {
      if (import.meta.env.DEV) {
        connectFunctionsEmulator(functionsEu, 'localhost', 5001);
      }

      const askAi = httpsCallable<
        { query: string; sessionId: string | null },
        { reply: string; sessionId: string; references: Array<{ title: string; uri: string }>; relatedQuestions: string[] }
      >(functionsEu, 'askAi');

      // 1. If we have an active session, optimistically append user message to Firestore
      let currentSessionId = activeSessionId;
      let updatedMsgs = [...currentMessages, userMessage];

      if (currentSessionId) {
        await updateDoc(doc(db, 'users', user.uid, 'chat_sessions', currentSessionId), {
          messages: updatedMsgs,
          updatedAt: serverTimestamp(),
        });
      }

      // 2. Fetch AI response
      const result = await askAi({
        query: trimmed,
        sessionId: activeSession ? activeSession.agentBuilderSessionId : null,
      });

      const aiMessage: ChatMessage = {
        from: 'ai',
        text: result.data.reply,
        references: result.data.references || [],
      };

      // 3. Save response to Firestore
      if (currentSessionId) {
        await updateDoc(doc(db, 'users', user.uid, 'chat_sessions', currentSessionId), {
          messages: [...updatedMsgs, aiMessage],
          relatedQuestions: result.data.relatedQuestions || [],
          updatedAt: serverTimestamp(),
        });
      } else {
        // First message: create new thread
        const newSessionData = {
          title: trimmed.slice(0, 35) + (trimmed.length > 35 ? '...' : ''),
          agentBuilderSessionId: result.data.sessionId,
          messages: [defaultGreeting, userMessage, aiMessage],
          relatedQuestions: result.data.relatedQuestions || [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        const docRef = await addDoc(
          collection(db, 'users', user.uid, 'chat_sessions'),
          newSessionData
        );
        setActiveSessionId(docRef.id);
      }
    } catch (error: unknown) {
      console.error("AI Error:", error);
      const errorMessage: ChatMessage = {
        from: 'ai',
        text: "Sorry, I'm having trouble connecting to my building knowledge base right now. Please try again in a moment.",
      };

      if (activeSessionId) {
        await updateDoc(doc(db, 'users', user.uid, 'chat_sessions', activeSessionId), {
          messages: [...currentMessages, userMessage, errorMessage],
          updatedAt: serverTimestamp(),
        });
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleDeleteSession = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!user) return;
    if (confirm("Are you sure you want to delete this chat thread?")) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'chat_sessions', id));
        if (activeSessionId === id) {
          setActiveSessionId(null);
        }
      } catch (err) {
        console.error("Failed to delete session", err);
      }
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

      <div className={styles.chatWrap} id={cfg.chatId}>
        {/* Left Sidebar: Thread History */}
        <div className={`${styles.sidebar} ${isMobileSidebarOpen ? styles.sidebarOpen : ''}`}>
          <div className={styles.sidebarHeader}>
            <button className={styles.newChatBtn} onClick={() => { setActiveSessionId(null); setIsMobileSidebarOpen(false); }}>
              ➕ New Chat
            </button>
          </div>
          <div className={styles.threadList}>
            {sessions.map((s) => (
              <div
                key={s.id}
                className={`${styles.threadItem} ${s.id === activeSessionId ? styles.threadItemActive : ''}`}
                onClick={() => { setActiveSessionId(s.id); setIsMobileSidebarOpen(false); }}
              >
                <div className={styles.threadTitle} title={s.title}>
                  💬 {s.title}
                </div>
                <button
                  className={styles.threadDelete}
                  onClick={(e) => handleDeleteSession(e, s.id)}
                  title="Delete Thread"
                >
                  &times;
                </button>
              </div>
            ))}
            {sessions.length === 0 && (
              <div style={{ padding: '20px', textAlign: 'center', fontSize: '12px', color: 'var(--text3)' }}>
                No past chats.
              </div>
            )}
          </div>
        </div>

        {/* Right Main Area: Active Chat */}
        <div className={styles.chatMain}>
          <div className={styles.chatHd}>
            <button
              className={styles.sidebarToggleBtn}
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              title="Toggle Chat History"
            >
              ☰
            </button>
            <div className={styles.chatAv}>💬✨</div>
            <div>
              <div className={styles.chatAiName}>Bofast AI Assistant</div>
              <div className={styles.chatAiStatus}>
                <div className={`${styles.chatAiDot} ${aiStatus?.status === 'Offline' ? 'offline' : ''}`}></div>
                {aiStatus ? `${aiStatus.status} · ${aiStatus.documentCount} document${aiStatus.documentCount === 1 ? '' : 's'} indexed` : 'Connecting...'}
              </div>
            </div>
          </div>

          <div className={styles.chatMsgs} id={`${cfg.chatId}-msgs`} ref={msgsRef}>
            {currentMessages.map((msg, i) =>
              msg.from === 'ai' ? (
                <div key={i} className={styles.chatMsg}>
                  <div className={`${styles.cmAv} ${styles.aiAv}`}>{cfg.avatarInitial}</div>
                  <div className={`${styles.bubble} ${styles.aiB}`}>
                    <div className="markdown-body">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                    {msg.references && msg.references.length > 0 && (
                      <div className={styles.chatRefs}>
                        <div className={styles.refsTitle}>References:</div>
                        {Array.from(new Map(msg.references.map(r => [r.uri, r])).values()).map((ref, idx) => (
                          <a key={idx} href={ref.uri} target="_blank" rel="noopener noreferrer" className={styles.refLink}>
                            📄 {ref.title || 'Document'}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div key={i} className={`${styles.chatMsg} ${styles.userMsg}`}>
                  <div className={`${styles.cmAv} ${styles.usrAv}`}>Me</div>
                  <div className={`${styles.bubble} ${styles.usrB}`}>{msg.text}</div>
                </div>
              )
            )}
            {isTyping && (
              <div className={styles.chatMsg}>
                <div className={`${styles.cmAv} ${styles.aiAv}`}>{cfg.avatarInitial}</div>
                <div className={`${styles.bubble} ${styles.aiB}`} style={{ opacity: 0.6 }}>
                  <span className="typing-dots">Thinking…</span>
                </div>
              </div>
            )}
          </div>

          <div className={styles.chatSugg} id={`${cfg.chatId}-sugg`}>
            {dynamicSuggestions.map((s) => (
              <div key={s} className={styles.suggChip} onClick={() => sendMessage(s)}>
                {s}
              </div>
            ))}
          </div>

          <div className={styles.chatInputRow}>
            <input
              className={styles.chatIn}
              type="text"
              placeholder="Ask about your building…"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className={styles.chatSend} onClick={() => sendMessage(inputValue)}>➤</button>
          </div>
        </div>
      </div>
    </div>
  );
}
