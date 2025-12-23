import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, getAtsScore, getSummary } from '../store/resumeSlice';
import type { AppDispatch } from '../store/store';
import { GlassCard } from '../components/GlassCard';
import UploadSection from '../components/UploadSection'; // Added import
import { TrendingUp, FileText, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isUploaded, atsScore, summary, loading } = useSelector((state: RootState) => state.resume);

    useEffect(() => {
        if (isUploaded && !atsScore && !loading) {
            dispatch(getAtsScore());
        }
        if (isUploaded && !summary && !loading) {
            dispatch(getSummary());
        }
    }, [isUploaded, atsScore, summary, dispatch]); // Removed loading from deps to avoid loop if error, but added logic check inside

    if (!isUploaded) {
        return (
            <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="text-center" style={{ marginBottom: '1rem' }}>
                    <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                        Optimize your Resume with AI
                    </h1>
                    <p className="text-secondary" style={{ fontSize: '1.25rem' }}>
                        Get instant ATS feedback, AI summaries, and job matching analysis.
                    </p>
                </div>
                <UploadSection />
            </div>
        );
    }

    return (
        <div className="flex-col gap-lg">
            <header>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Dashboard</h2>
                <p className="text-secondary">Overview of your resume analysis.</p>
            </header>

            <div className="grid-dashboard">
                {/* ATS Score Card */}
                <GlassCard className="flex-col" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', opacity: 0.1 }}>
                        <TrendingUp size={80} />
                    </div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 500, color: '#d1d5db', marginBottom: '0.5rem' }}>ATS Score</h3>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                        <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white' }}>
                            {atsScore !== null ? atsScore : '--'}
                        </span>
                        <span className="text-secondary">/ 100</span>
                    </div>
                    <div style={{ marginTop: '1rem', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${atsScore || 0}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            style={{
                                height: '100%',
                                background: (atsScore || 0) >= 80 ? 'var(--success)' : (atsScore || 0) >= 60 ? 'var(--warning)' : 'var(--error)'
                            }}
                        />
                    </div>
                </GlassCard>

                {/* Quick Status */}
                <GlassCard>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 500, color: '#d1d5db', marginBottom: '1rem' }}>Status</h3>
                    <div className="flex-col gap-sm">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--success)' }}>
                            <CheckCircle size={20} />
                            <span>Resume Parsed</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--success)' }}>
                            <CheckCircle size={20} />
                            <span>Embeddings Generated</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--success)' }}>
                            <CheckCircle size={20} />
                            <span>Ready for Q&A</span>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Summary Section */}
            <GlassCard>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <FileText style={{ color: '#c084fc' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>AI Summary</h3>
                </div>
                {summary ? (
                    <div className="prose">
                        <p style={{ whiteSpace: 'pre-line' }}>
                            {summary}
                        </p>
                    </div>
                ) : (
                    <div style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ height: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', width: '75%' }}></div>
                        <div style={{ height: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', width: '100%' }}></div>
                        <div style={{ height: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', width: '80%' }}></div>
                    </div>
                )}
            </GlassCard>
        </div>
    );
};

export default Dashboard;
