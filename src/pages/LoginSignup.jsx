import React, { useState } from 'react';
import { authAPI } from '../services/api';
import './LoginSignup.css';

const LoginSignup = ({ onSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted', { isLogin, formData });
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                console.log('Attempting login...');
                await authAPI.login(formData.username, formData.password);
            } else {
                console.log('Attempting signup...');
                await authAPI.signup(formData.username, formData.password, formData.email);
            }
            console.log('Auth successful, calling onSuccess');
            onSuccess();
        } catch (err) {
            console.error('Auth error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        console.log('Toggling mode from', isLogin ? 'login' : 'signup');
        setIsLogin(!isLogin);
        setError('');
        setFormData({ username: '', password: '', email: '' });
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>AI-On</h1>
                    <p>{isLogin ? 'Welcome Back' : 'Create Your Account'}</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            className="input"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            autoComplete="username"
                        />
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className="input"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                autoComplete="email"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className="input"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete={isLogin ? 'current-password' : 'new-password'}
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? (
                            <>
                                <span className="loading-spinner"></span>
                                <span style={{ marginLeft: '8px' }}>Processing...</span>
                            </>
                        ) : (
                            isLogin ? 'Login' : 'Sign Up'
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <span>{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
                    <button onClick={toggleMode} className="toggle-btn">
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginSignup;
