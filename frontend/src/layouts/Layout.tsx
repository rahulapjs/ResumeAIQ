import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, setApiKey } from '../store/resumeSlice';
import Sidebar from '../components/Sidebar';
import { GlassCard } from '../components/GlassCard';
import { Key } from 'lucide-react';

const Layout = () => {
    const dispatch = useDispatch();
    const apiKey = useSelector((state: RootState) => state.resume.apiKey);
    const [inputKey, setInputKey] = useState('');

    const handleSaveKey = () => {
        if (inputKey.trim()) {
            dispatch(setApiKey(inputKey.trim()));
        }
    };

    if (!apiKey) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                <GlassCard className="text-center" style={{ maxWidth: '400px', width: '100%' }}>
                    <div className="flex-center" style={{ width: '64px', height: '64px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', margin: '0 auto 1.5rem' }}>
                        <Key size={32} style={{ color: '#c084fc' }} />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Authentication Required</h2>
                        <p className="text-secondary">Please enter your Gemini API Key to continue.</p>
                    </div>
                    <div className="flex-col gap-md">
                        <input
                            type="password"
                            placeholder="Paste API Key here..."
                            value={inputKey}
                            onChange={(e) => setInputKey(e.target.value)}
                            className="glass-input"
                        />
                        <button
                            onClick={handleSaveKey}
                            disabled={!inputKey}
                            className="glass-button w-full"
                        >
                            Access Dashboard
                        </button>
                    </div>
                    <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#6b7280' }}>
                        Your key is stored locally in your browser.
                    </p>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="app-container">
            <Sidebar />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
