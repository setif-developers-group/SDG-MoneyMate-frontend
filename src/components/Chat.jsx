import React, { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../services/api';
import './Chat.css';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        loadHistory();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadHistory = async () => {
        try {
            const history = await chatAPI.getHistory();
            // Ensure history is an array
            if (Array.isArray(history)) {
                setMessages(history);
            }
        } catch (error) {
            console.error("Failed to load chat history", error);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', msg: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const response = await chatAPI.sendMessage(input);
            // The backend returns { msg: "..." }
            const botMsg = { role: 'model', msg: response.msg };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("Failed to send message", error);
            const errorMsg = { role: 'model', msg: "Sorry, I encountered an error. Please try again." };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    const handleClearHistory = async () => {
        if (!window.confirm('Are you sure you want to clear all chat history?')) {
            return;
        }

        try {
            await chatAPI.reset();
            setMessages([]);
        } catch (error) {
            console.error("Failed to clear chat history", error);
            alert("Failed to clear chat history. Please try again.");
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h3>AI Assistant</h3>
                <button onClick={handleClearHistory} className="clear-btn" title="Clear chat history">
                    🗑️ Clear
                </button>
            </div>
            <div className="chat-messages">
                {messages.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">👋</div>
                        <h3>Hello! I'm AI-On</h3>
                        <p>I can help you manage your budget, track expenses, and give financial advice.</p>
                    </div>
                )}

                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role === 'user' ? 'user-message' : 'bot-message'}`}>
                        <div className="message-content">
                            {msg.msg}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="message bot-message">
                        <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="chat-input-form">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything about your finances..."
                    disabled={loading}
                    className="chat-input"
                />
                <button type="submit" disabled={loading || !input.trim()} className="send-btn">
                    Send
                </button>
            </form>
        </div>
    );
};

export default Chat;
