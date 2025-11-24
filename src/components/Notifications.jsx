import React, { useState, useEffect, useRef } from 'react';
import { notifyAPI } from '../services/api';
import './Notifications.css';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        fetchUnreadCount();
        // Poll for new notifications every minute
        const interval = setInterval(fetchUnreadCount, 60000);
        return () => clearInterval(interval);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const data = await notifyAPI.getUnreadCount();
            setUnreadCount(data.unread_count);
        } catch (error) {
            console.error("Failed to fetch unread count", error);
        }
    };

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            // Fetch all notifications (both read and unread)
            const data = await notifyAPI.list();
            setNotifications(data);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleDropdown = () => {
        if (!isOpen) {
            fetchNotifications();
        }
        setIsOpen(!isOpen);
    };

    const handleMarkAllRead = async () => {
        try {
            await notifyAPI.markAllRead();
            setUnreadCount(0);
            // Update local state to mark all as read
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    return (
        <div className="notifications-wrapper" ref={dropdownRef}>
            <button
                className="nav-btn notification-btn"
                onClick={toggleDropdown}
                title="Notifications"
            >
                🔔
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="notifications-dropdown">
                    <div className="notifications-header">
                        <h3>Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={handleMarkAllRead} className="mark-read-btn">
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="notifications-list">
                        {loading ? (
                            <div className="notification-loading">Loading...</div>
                        ) : notifications.length === 0 ? (
                            <div className="notification-empty">No notifications</div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                                >
                                    <div className="notification-icon">
                                        {getIconForType(notification.notification_type)}
                                    </div>
                                    <div className="notification-content">
                                        <p className="notification-message">{notification.message}</p>
                                        <span className="notification-time">
                                            {new Date(notification.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {!notification.read && <div className="unread-dot"></div>}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const getIconForType = (type) => {
    switch (type) {
        case 'budget_alert': return '⚠️';
        case 'expense_alert': return '💸';
        case 'achievement': return '🏆';
        case 'system': return '⚙️';
        default: return '📢';
    }
};

export default Notifications;
