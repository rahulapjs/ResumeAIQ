import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAtsScore } from '../store/resumeSlice';
import type { RootState } from '../store/store';
import type { AppDispatch } from '../store/store';
import { GlassCard } from '../components/GlassCard';
import { BarChart, Activity, Layers, Type } from 'lucide-react';
import { motion } from 'framer-motion';

const Analysis = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { atsScore, atsBreakdown, isUploaded } = useSelector((state: RootState) => state.resume);

    useEffect(() => {
        if (isUploaded && !atsScore) {
            dispatch(getAtsScore());
        }
    }, [isUploaded, atsScore, dispatch]);

    if (!isUploaded) {
        return <div className="text-center text-secondary" style={{ marginTop: '5rem' }}>Please upload a resume first.</div>;
    }

    if (!atsBreakdown) {
        return <div className="text-center text-secondary" style={{ marginTop: '5rem' }}>Loading analysis...</div>;
    }

    const metrics = [
        { label: 'Structure', value: atsBreakdown.structure, max: 30, icon: Layers, color: '#3b82f6' },
        { label: 'Keywords', value: atsBreakdown.keywords, max: 30, icon: Activity, color: '#a855f7' },
        { label: 'Experience Impact', value: atsBreakdown.experience, max: 20, icon: BarChart, color: '#22c55e' },
        { label: 'Readability', value: atsBreakdown.readability, max: 20, icon: Type, color: '#eab308' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Deep Analysis</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {metrics.map((m) => (
                    <GlassCard key={m.label} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)' }}>
                                    <m.icon size={24} style={{ color: '#d1d5db' }} />
                                </div>
                                <h3 style={{ fontWeight: 500, fontSize: '1.125rem' }}>{m.label}</h3>
                            </div>
                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                {m.value} <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>/ {m.max}</span>
                            </span>
                        </div>

                        <div style={{ height: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '9999px', overflow: 'hidden' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(m.value / m.max) * 100}%` }}
                                transition={{ duration: 1 }}
                                style={{ height: '100%', backgroundColor: m.color }}
                            />
                        </div>
                        <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                            {m.value === m.max ? 'Perfect score!' : 'Room for improvement based on ATS standards.'}
                        </p>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
};

export default Analysis;
