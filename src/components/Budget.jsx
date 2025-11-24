import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { budgetAPI } from '../services/api';
import './Budget.css';

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      const data = await budgetAPI.list();
      console.log("Budget Data Received:", data); // Debugging
      setBudgets(data);
    } catch (error) {
      console.error("Failed to load budgets", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await budgetAPI.generate();
      await loadBudgets();
    } catch (error) {
      console.error("Failed to generate budget", error);
    } finally {
      setGenerating(false);
    }
  };

  const handleCardClick = async (budget) => {
    try {
      // Optimistically set selected budget with available data
      setSelectedBudget(budget);

      // Fetch full details to get the description
      const response = await fetch(`/api/budget/${budget.id}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const details = await response.json();
        setSelectedBudget(details);
      }
    } catch (error) {
      console.error("Failed to fetch budget details", error);
    }
  };

  if (loading) return <div className="loading">Loading budgets...</div>;

  return (
    <div className="budget-container">
      <div className="budget-header">
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="generate-btn"
        >
          {generating ? 'Generating...' : 'Generate AI Budget'}
        </button>
      </div>

      <div className="budget-grid">
        {budgets.length === 0 ? (
          <div className="empty-budget">
            <p>No budgets found. Let AI generate one for you based on your spending!</p>
          </div>
        ) : (
          budgets.map((budget) => {
            // Correctly map fields based on API response
            // API returns: { title: "...", budget: "5000.00", spent: "0.00" }
            const amount = Number(budget.budget || budget.amount || 0);
            const spent = Number(budget.spent || 0);
            const remaining = amount - spent;
            const progress = amount > 0 ? Math.min((spent / amount) * 100, 100) : 0;

            return (
              <div
                key={budget.id}
                className="budget-card clickable"
                onClick={() => handleCardClick(budget)}
              >
                <div className="budget-info">
                  <h3>{budget.title || budget.name || budget.category}</h3>
                  <div className="budget-amount">
                    <span className="currency">$</span>
                    <span className="amount">{amount.toFixed(2)}</span>
                  </div>
                </div>
                <div className="budget-progress">
                  <div
                    className="progress-bar"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="budget-stats">
                  <span>Spent: ${spent.toFixed(2)}</span>
                  <span>Remaining: ${remaining.toFixed(2)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {selectedBudget && (
        <div className="modal-overlay" onClick={() => setSelectedBudget(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedBudget.title || selectedBudget.name || selectedBudget.category}</h2>
              <button className="close-btn" onClick={() => setSelectedBudget(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="budget-summary">
                <div className="stat-item">
                  <label>Budget</label>
                  <span>${Number(selectedBudget.budget || selectedBudget.amount || 0).toFixed(2)}</span>
                </div>
                <div className="stat-item">
                  <label>Spent</label>
                  <span>${Number(selectedBudget.spent || 0).toFixed(2)}</span>
                </div>
                <div className="stat-item">
                  <label>Remaining</label>
                  <span>${(Number(selectedBudget.budget || selectedBudget.amount || 0) - Number(selectedBudget.spent || 0)).toFixed(2)}</span>
                </div>
              </div>

              <div className="budget-description">
                <h3>Description & Advice</h3>
                <div className="markdown-content">
                  {selectedBudget.description ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {selectedBudget.description}
                    </ReactMarkdown>
                  ) : (
                    <p className="loading-text">Loading description...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;
