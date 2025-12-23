import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, askQuestion } from '../store/resumeSlice';
import { AppDispatch } from '../store/store';
import { GlassCard } from '../components/GlassCard';
import { Send, User, Bot, Loader2 } from 'lucide-react';

const Chat = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { chatHistory, loading, isUploaded } = useSelector((state: RootState) => state.resume);
    const [input, setInput] = useState('');
    const endRef = useRef<HTMLDivElement>(null);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;
        dispatch(askQuestion(input));
        setInput('');
    };

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, loading]);

    if (!isUploaded) {
        return <div className="text-center text-secondary" style={{ marginTop: '5rem' }}>Please upload a resume first to start chatting.</div>;
    }

    return (
        <div style={{ height: 'calc(100vh - 8rem)', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Resume Q&A</h2>

            <GlassCard style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {chatHistory.length === 0 && (
                        <div className="text-center text-secondary" style={{ marginTop: '20%' }}>
                            <p style={{ marginBottom: '0.5rem' }}>Ask anything about the resume!</p>
                            <p style={{ fontSize: '0.875rem' }}>"What is the candidate's strongest skill?", "Did they work at Google?"</p>
                        </div>
                    )}

                    {chatHistory.map((msg, idx) => (
                        <div
                            key={idx}
                            style={{
                                display: 'flex',
                                gap: '1rem',
                                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
                            }}
                        >
                            <div
                                style={{
                                    width: '2.5rem', height: '2.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    backgroundColor: msg.role === 'user' ? '#7c3aed' : '#374151'
                                }}
                            >
                                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                            </div>
                            <div
                                style={{
                                    maxWidth: '80%', padding: '1rem', borderRadius: '1rem',
                                    ...(msg.role === 'user'
                                        ? { background: 'rgba(124, 58, 237, 0.2)', color: 'white', borderTopRightRadius: 0, border: '1px solid rgba(139, 92, 246, 0.3)' }
                                        : { background: 'rgba(255, 255, 255, 0.05)', color: '#e5e7eb', borderTopLeftRadius: 0, border: '1px solid rgba(255, 255, 255, 0.1)' }
                                    )
                                }}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Bot size={20} />
                            </div>
                            <div style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#e5e7eb', borderRadius: '1rem', borderTopLeftRadius: 0, padding: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Loader2 size={16} className="spin" /> Thinking...
                            </div>
                        </div>
                    )}
                    <div ref={endRef} />
                </div>

                <div style={{ padding: '1rem', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
                    <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question about the resume..."
                            className="glass-input"
                            disabled={loading}
                            style={{ flex: 1 }}
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="glass-button"
                            style={{ background: 'rgba(124, 58, 237, 0.2)', borderColor: 'rgba(139, 92, 246, 0.3)' }}
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </GlassCard>
        </div>
    );
};

export default Chat;
