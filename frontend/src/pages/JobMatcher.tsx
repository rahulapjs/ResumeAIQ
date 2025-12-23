import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { matchJob } from '../store/resumeSlice';
import type { RootState } from '../store/store';
import type { AppDispatch } from '../store/store';
import { GlassCard } from '../components/GlassCard';
import { Briefcase, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const JobMatcher = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { jobMatchResult, loading, isUploaded } = useSelector((state: RootState) => state.resume);
    const [jd, setJd] = useState('');

    const handleMatch = () => {
        if (!jd.trim()) return;
        dispatch(matchJob(jd));
    };

    if (!isUploaded) {
        return <div className="text-center text-secondary" style={{ marginTop: '5rem' }}>Please upload a resume first.</div>;
    }

    return (
        <div style={{ maxWidth: '1024px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Job Match Analysis</h2>
                <p className="text-secondary">Paste a job description to see how well you match.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                {/* Input Section */}
                <GlassCard className="flex-col gap-md">
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Briefcase size={20} style={{ color: '#c084fc' }} />
                        Job Description
                    </h3>
                    <textarea
                        className="glass-input"
                        style={{ flex: 1, minHeight: '300px', resize: 'none', fontFamily: 'monospace', fontSize: '0.875rem', lineHeight: 1.6 }}
                        placeholder="Paste job description here..."
                        value={jd}
                        onChange={(e) => setJd(e.target.value)}
                    />
                    <button
                        onClick={handleMatch}
                        disabled={loading || !jd.trim()}
                        className="glass-button w-full"
                        style={{ background: 'rgba(124, 58, 237, 0.2)', borderColor: 'rgba(139, 92, 246, 0.3)', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                    >
                        {loading ? 'Analyzing...' : <>Analyze Match <ArrowRight size={18} /></>}
                    </button>
                </GlassCard>

                {/* Results Section */}
                <div className="flex-col gap-lg" style={{ minHeight: '300px' }}>
                    {jobMatchResult ? (
                        <>
                            <GlassCard className="text-center" style={{ padding: '2rem' }}>
                                <h3 style={{ color: '#9ca3af', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Match Score</h3>
                                <div style={{ fontSize: '3.75rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>
                                    {jobMatchResult.match_score}%
                                </div>
                                <div style={{ width: '100%', maxWidth: '320px', margin: '0 auto', height: '0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '9999px', overflow: 'hidden' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${jobMatchResult.match_score}%` }}
                                        transition={{ duration: 1 }}
                                        style={{
                                            height: '100%',
                                            background: jobMatchResult.match_score >= 80 ? 'var(--success)' :
                                                jobMatchResult.match_score >= 50 ? 'var(--warning)' : 'var(--error)'
                                        }}
                                    />
                                </div>
                            </GlassCard>

                            <GlassCard>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--success)' }}>Strengths</h3>
                                <ul className="flex-col gap-sm" style={{ padding: 0, margin: 0, listStyle: 'none' }}>
                                    {jobMatchResult.strengths?.map((item: string, i: number) => (
                                        <li key={i} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.875rem', color: '#d1d5db' }}>
                                            <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '0.125rem' }} />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </GlassCard>

                            <GlassCard>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--error)' }}>Missing Skills</h3>
                                <ul className="flex-col gap-sm" style={{ padding: 0, margin: 0, listStyle: 'none' }}>
                                    {jobMatchResult.missing_skills?.map((item: string, i: number) => (
                                        <li key={i} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.875rem', color: '#d1d5db' }}>
                                            <XCircle size={16} style={{ color: 'var(--error)', flexShrink: 0, marginTop: '0.125rem' }} />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </GlassCard>
                        </>
                    ) : (
                        <div className="glass-panel" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontStyle: 'italic' }}>
                            {loading ? 'Analyzing match...' : 'Results will appear here'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobMatcher;
