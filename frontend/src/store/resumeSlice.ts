import { createSlice, createAsyncThunk,type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Utils
const generateSessionId = () => `session-${Math.random().toString(36).substring(2, 9)}`;

const API_URL = 'http://127.0.0.1:8000';

interface ResumeState {
    apiKey: string;
    sessionId: string;
    isUploaded: boolean;
    summary: string | null;
    atsScore: number | null;
    atsBreakdown: {
        structure: number;
        keywords: number;
        experience: number;
        readability: number;
    } | null;
    chatHistory: { role: 'user' | 'assistant'; content: string }[];
    jobMatchResult: any | null;
    loading: boolean;
    error: string | null;
}

const initialState: ResumeState = {
    apiKey: localStorage.getItem('gemini_api_key') || '',
    sessionId: localStorage.getItem('session_id') || generateSessionId(),
    isUploaded: false,
    summary: null,
    atsScore: null,
    atsBreakdown: null,
    chatHistory: [],
    jobMatchResult: null,
    loading: false,
    error: null,
};

// Async Thunks
export const uploadResume = createAsyncThunk(
    'resume/upload',
    async (file: File, { getState, rejectWithValue }) => {
        const state = getState() as { resume: ResumeState };
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${API_URL}/resume/upload`, formData, {
                headers: {
                    'X-Session-ID': state.resume.sessionId,
                    'Authorization': `Bearer ${state.resume.apiKey}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.detail || 'Upload failed');
        }
    }
);

export const getSummary = createAsyncThunk(
    'resume/getSummary',
    async (_, { getState, rejectWithValue }) => {
        const state = getState() as { resume: ResumeState };
        try {
            const response = await axios.post(
                `${API_URL}/resume/summary`,
                {},
                {
                    headers: {
                        'X-Session-ID': state.resume.sessionId,
                        'Authorization': `Bearer ${state.resume.apiKey}`,
                    },
                }
            );
            return response.data.summary;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.detail || 'Summary generation failed');
        }
    }
);

export const getAtsScore = createAsyncThunk(
    'resume/getAtsScore',
    async (_, { getState, rejectWithValue }) => {
        const state = getState() as { resume: ResumeState };
        try {
            const response = await axios.post(
                `${API_URL}/resume/ats-score`,
                {},
                {
                    headers: {
                        'X-Session-ID': state.resume.sessionId,
                        'Authorization': `Bearer ${state.resume.apiKey}`,
                    },
                }
            );
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.detail || 'ATS scoring failed');
        }
    }
);

export const askQuestion = createAsyncThunk(
    'resume/askQuestion',
    async (question: string, { getState, rejectWithValue }) => {
        const state = getState() as { resume: ResumeState };
        try {
            const response = await axios.post(
                `${API_URL}/resume/qa`,
                { question },
                {
                    headers: {
                        'X-Session-ID': state.resume.sessionId,
                        'Authorization': `Bearer ${state.resume.apiKey}`,
                    },
                }
            );
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.detail || 'Q&A failed');
        }
    }
);

export const matchJob = createAsyncThunk(
    'resume/matchJob',
    async (jdText: string, { getState, rejectWithValue }) => {
        const state = getState() as { resume: ResumeState };
        try {
            const response = await axios.post(
                `${API_URL}/resume/job-match`,
                { job_description: jdText },
                {
                    headers: {
                        'X-Session-ID': state.resume.sessionId,
                        'Authorization': `Bearer ${state.resume.apiKey}`,
                    },
                }
            );
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.detail || 'Job matching failed');
        }
    }
);

const resumeSlice = createSlice({
    name: 'resume',
    initialState,
    reducers: {
        setApiKey: (state, action: PayloadAction<string>) => {
            state.apiKey = action.payload;
            localStorage.setItem('gemini_api_key', action.payload);
        },
        clearSession: (state) => {
            state.sessionId = generateSessionId();
            state.isUploaded = false;
            state.summary = null;
            state.atsScore = null;
            state.chatHistory = [];
            state.jobMatchResult = null;
            localStorage.setItem('session_id', state.sessionId);
        },
    },
    extraReducers: (builder) => {
        // Upload
        builder.addCase(uploadResume.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(uploadResume.fulfilled, (state) => {
            state.loading = false;
            state.isUploaded = true;
        });
        builder.addCase(uploadResume.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Summary
        builder.addCase(getSummary.fulfilled, (state, action) => {
            state.summary = action.payload;
        });

        // ATS
        builder.addCase(getAtsScore.fulfilled, (state, action) => {
            state.atsScore = action.payload.ats_score;
            state.atsBreakdown = action.payload.breakdown;
        });

        // QA
        builder.addCase(askQuestion.pending, (state, action) => {
            // Optimistic update could go here, but let's wait for response
            state.chatHistory.push({ role: 'user', content: action.meta.arg });
            state.loading = true; // Use separate loading for chat in real app, but shared here is ok for now
        });
        builder.addCase(askQuestion.fulfilled, (state, action) => {
            state.loading = false;
            state.chatHistory.push({ role: 'assistant', content: action.payload.answer });
        });
        builder.addCase(askQuestion.rejected, (state) => {
            state.loading = false;
        });

        // Job Match
        builder.addCase(matchJob.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(matchJob.fulfilled, (state, action) => {
            state.loading = false;
            // The backend returns { result: { ... } }
            state.jobMatchResult = action.payload.result;
        });
        builder.addCase(matchJob.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { setApiKey, clearSession } = resumeSlice.actions;
export default resumeSlice.reducer;
