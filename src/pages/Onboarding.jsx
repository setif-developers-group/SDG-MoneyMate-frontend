import React, { useState, useEffect } from 'react';
import { onboardingAPI } from '../services/api';
import './Onboarding.css';

const Onboarding = ({ onComplete }) => {
    const [question, setQuestion] = useState(null);
    const [answer, setAnswer] = useState('');
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadQuestion();
    }, []);

    const loadQuestion = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await onboardingAPI.getCurrentQuestion();

            // Check if onboarding is finished
            if (data.type === 'finsh') {
                onComplete();
                return;
            }

            setQuestion(data);
            setAnswer('');
            setSelectedOptions([]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            let answerToSubmit;

            if (question.question_type === 'checkboxes') {
                answerToSubmit = selectedOptions;
            } else if (question.question_type === 'radio') {
                answerToSubmit = answer;
            } else {
                answerToSubmit = answer;
            }

            const response = await onboardingAPI.submitAnswer(answerToSubmit);

            // Check if finished
            if (response.type === 'finsh') {
                onComplete();
                return;
            }

            // Load next question
            setQuestion(response);
            setAnswer('');
            setSelectedOptions([]);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCheckboxChange = (option) => {
        setSelectedOptions(prev =>
            prev.includes(option)
                ? prev.filter(o => o !== option)
                : [...prev, option]
        );
    };

    if (loading) {
        return (
            <div className="onboarding-container">
                <div className="onboarding-card">
                    <div className="loading-spinner"></div>
                    <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="onboarding-container">
            <div className="onboarding-card">
                <div className="onboarding-header">
                    <h1>Welcome to SDG MoneyMate</h1>
                    <p>Let's set up your financial profile</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                {question && (
                    <form onSubmit={handleSubmit} className="onboarding-form">
                        <div className="question-section">
                            <label className="question-label">{question.question}</label>

                            {question.question_type === 'direct' && (
                                <input
                                    type="text"
                                    className="input"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    required
                                    placeholder="Type your answer..."
                                />
                            )}

                            {question.question_type === 'radio' && question.options && (
                                <div className="options-container">
                                    {question.options.map((option, index) => (
                                        <label key={index} className="radio-option">
                                            <input
                                                type="radio"
                                                name="answer"
                                                value={option}
                                                checked={answer === option}
                                                onChange={(e) => setAnswer(e.target.value)}
                                                required
                                            />
                                            <span>{option}</span>
                                        </label>
                                    ))}
                                </div>
                            )}

                            {question.question_type === 'checkboxes' && question.options && (
                                <div className="options-container">
                                    {question.options.map((option, index) => (
                                        <label key={index} className="checkbox-option">
                                            <input
                                                type="checkbox"
                                                checked={selectedOptions.includes(option)}
                                                onChange={() => handleCheckboxChange(option)}
                                            />
                                            <span>{option}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting || (question.question_type === 'checkboxes' && selectedOptions.length === 0)}
                        >
                            {submitting ? (
                                <>
                                    <span className="loading-spinner"></span>
                                    <span style={{ marginLeft: '8px' }}>Submitting...</span>
                                </>
                            ) : (
                                'Continue'
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Onboarding;
