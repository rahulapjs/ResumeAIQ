import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, AlertCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadResume } from '../store/resumeSlice';
import type { RootState } from '../store/store';
import type { AppDispatch } from '../store/store';
import { GlassCard } from '../components/GlassCard';

const UploadSection = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.resume);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            dispatch(uploadResume(acceptedFiles[0]));
        }
    }, [dispatch]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        multiple: false
    });

    return (
        <GlassCard className="text-center" style={{ padding: '4rem 2rem', borderStyle: 'dashed', borderColor: isDragActive ? 'var(--accent-color)' : 'rgba(255,255,255,0.2)' }}>
            <div {...getRootProps()} style={{ cursor: 'pointer' }}>
                <input {...getInputProps()} />
                <div className="flex-center" style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', margin: '0 auto 1.5rem' }}>
                    <UploadCloud size={40} style={{ color: '#c084fc' }} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Upload your Resume</h3>
                <p className="text-secondary" style={{ marginBottom: '1.5rem', maxWidth: '300px', margin: '0 auto 1.5rem' }}>
                    Drag & drop your PDF or DOCX file here, or click to browse.
                </p>
                <button className="glass-button">
                    Select Document
                </button>
            </div>

            {loading && (
                <div className="flex-center gap-sm" style={{ marginTop: '2rem', color: '#d8b4fe' }}>
                    <div className="spin" style={{ width: '20px', height: '20px', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%' }} />
                    Processing with Gemini AI...
                </div>
            )}

            {error && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', color: '#fca5a5' }}>
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}
        </GlassCard>
    );
};

export default UploadSection;
