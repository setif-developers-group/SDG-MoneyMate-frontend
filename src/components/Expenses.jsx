import React, { useState, useEffect } from 'react';
import { expenseAPI } from '../services/api';
import './Expenses.css';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [message, setMessage] = useState('');
    const [file, setFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadExpenses();
    }, []);

    const loadExpenses = async () => {
        try {
            const data = await expenseAPI.list();
            setExpenses(data);
        } catch (error) {
            console.error("Failed to load expenses", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message && !file) return;

        setSubmitting(true);
        try {
            let data;
            if (file) {
                const formData = new FormData();
                formData.append('file', file);
                if (message) formData.append('message', message);
                data = formData;
            } else {
                data = { message };
            }

            await expenseAPI.create(data);

            // Reset form
            setMessage('');
            setFile(null);
            setShowAddForm(false);

            // Reload list
            await loadExpenses();
        } catch (error) {
            console.error("Failed to add expense", error);
            alert("Failed to process expense. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loading">Loading expenses...</div>;

    return (
        <div className="expenses-container">
            <div className="expenses-header">
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="add-btn"
                >
                    {showAddForm ? 'Cancel' : 'Add Expense'}
                </button>
            </div>

            {showAddForm && (
                <form onSubmit={handleSubmit} className="expense-form">
                    <div className="form-group">
                        <label>Describe your expense or upload a receipt</label>
                        <textarea
                            placeholder="E.g., 'Spent $50 on groceries at Walmart' or 'Lunch with team'"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="expense-textarea"
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label className="file-upload-label">
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                accept="image/*,application/pdf"
                                className="file-input"
                            />
                            <span className="file-custom">
                                {file ? `📎 ${file.name}` : '📷 Upload Receipt (Image/PDF)'}
                            </span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={submitting || (!message && !file)}
                    >
                        {submitting ? 'Processing...' : 'Process Expense'}
                    </button>
                </form>
            )}

            <div className="expenses-list">
                {expenses.length === 0 ? (
                    <div className="empty-expenses">
                        <p>No expenses recorded yet.</p>
                    </div>
                ) : (
                    <table className="expenses-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense) => (
                                <tr key={expense.id}>
                                    <td>{new Date(expense.date || expense.created_at).toLocaleDateString()}</td>
                                    <td>{expense.description || expense.product_name || 'Expense'}</td>
                                    <td>{expense.category || '-'}</td>
                                    <td className="amount-cell">${Number(expense.amount).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Expenses;
