import React, { useEffect, useState } from 'react';
import { authAPI } from './services/api';
import LoginSignup from './pages/LoginSignup';
import Onboarding from './pages/Onboarding';
import MainPage from './pages/MainPage';
import './App.css';

function App() {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [onboardingCompleted, setOnboardingCompleted] = useState(false);

    const checkAuthStatus = async () => {
        setLoading(true);
        try {
            const userData = await authAPI.getMe();
            setIsAuthenticated(true);
            setOnboardingCompleted(userData?.profile?.onboarding_status === 'completed');
        } catch (error) {
            console.error('Auth check failed:', error);
            setIsAuthenticated(false);
            setOnboardingCompleted(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const handleAuthSuccess = () => {
        checkAuthStatus();
    };

    const handleOnboardingComplete = () => {
        setOnboardingCompleted(true);
    };

    if (loading) {
        return (
            <div className="app-loading">
                <div className="loading-spinner"></div>
                <p>Loading AI-On...</p>
            </div>
        );
    }

    // Flow: Not authenticated → Login/Signup
    if (!isAuthenticated) {
        return <LoginSignup onSuccess={handleAuthSuccess} />;
    }

    // Flow: Authenticated but onboarding not completed → Onboarding
    if (!onboardingCompleted) {
        return <Onboarding onComplete={handleOnboardingComplete} />;
    }

    // Flow: Authenticated and onboarding completed → Main Page
    return <MainPage />;
}

export default App;
