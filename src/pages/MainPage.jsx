import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { authAPI, expenseAPI } from '../services/api';
import Chat from '../components/Chat';
import Budget from '../components/Budget';
import Expenses from '../components/Expenses';
import Notifications from '../components/Notifications';
import './MainPage.css';

const MainPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [report, setReport] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const handleLogout = () => {
    authAPI.logout();
    window.location.reload();
  };

  const fetchReport = async () => {
    if (report && showReport) {
      setShowReport(false);
      return;
    }
    if (report && !showReport) {
      setShowReport(true);
      return;
    }

    setLoadingReport(true);
    setShowReport(true);
    try {
      const data = await expenseAPI.getReport();
      setReport(data.report);
    } catch (error) {
      console.error("Failed to fetch report", error);
    } finally {
      setLoadingReport(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="hero-section">
            <h1 className="hero-title">Welcome to SDG MoneyMate</h1>
            <p className="hero-subtitle">
              Your AI-powered financial assistant is ready to help you manage your finances smarter.
            </p>

            <div className="feature-grid">
              <div className="feature-card" onClick={() => setActiveTab('chat')} style={{ cursor: 'pointer' }}>
                <div className="feature-icon">💬</div>
                <h3>AI Chatbot</h3>
                <p>Chat with your personal financial assistant for advice and insights</p>
              </div>

              <div className="feature-card" onClick={() => setActiveTab('budget')} style={{ cursor: 'pointer' }}>
                <div className="feature-icon">💰</div>
                <h3>Smart Budgeting</h3>
                <p>AI-generated budgets that adapt to your spending patterns</p>
              </div>

              <div className="feature-card" onClick={() => setActiveTab('expenses')} style={{ cursor: 'pointer' }}>
                <div className="feature-icon">📊</div>
                <h3>Expense Tracking</h3>
                <p>Automatically extract expenses from receipts and messages</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🎯</div>
                <h3>Product Advisor</h3>
                <p>Get smart recommendations based on your budget</p>
              </div>
            </div>

            <div className="report-section">
              <button
                className="btn btn-secondary report-btn"
                onClick={fetchReport}
                disabled={loadingReport}
              >
                {loadingReport ? 'Generating Report...' : (showReport ? 'Hide Expenses Report' : 'View Expenses Report')}
              </button>

              {showReport && (
                <div className="report-container">
                  {loadingReport ? (
                    <div className="loading-report">
                      <div className="typing-indicator"><span></span><span></span><span></span></div>
                      <p>Analyzing your expenses...</p>
                    </div>
                  ) : (
                    <div className="markdown-content">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {report || ''}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="cta-section">
              <button
                className="btn btn-primary btn-large"
                onClick={() => setActiveTab('chat')}
              >
                Start Chatting
              </button>
              <button
                className="btn btn-secondary btn-large"
                onClick={() => setActiveTab('dashboard')}
              >
                View Dashboard
              </button>
            </div>
          </div>
        );
      case 'budget':
        return (
          <div className="view-container">
            <h2>Budget Management</h2>
            <Budget />
          </div>
        );
      case 'expenses':
        return (
          <div className="view-container">
            <h2>Expense Tracking</h2>
            <Expenses />
          </div>
        );
      case 'chat':
        return (
          <div className="view-container">
            <h2>AI Chat</h2>
            <Chat />
          </div>
        );
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="main-container">
      <nav className="navbar">
        <div className="nav-content">
          <h1 className="logo" onClick={() => setActiveTab('dashboard')} style={{ cursor: 'pointer' }}>SDG MoneyMate</h1>
          <div className="nav-links">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('budget')}
              className={`nav-btn ${activeTab === 'budget' ? 'active' : ''}`}
            >
              Budget
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`nav-btn ${activeTab === 'expenses' ? 'active' : ''}`}
            >
              Expenses
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`nav-btn ${activeTab === 'chat' ? 'active' : ''}`}
            >
              Chat
            </button>
            <Notifications />
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default MainPage;
