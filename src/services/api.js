// API service for backend communication
const API_BASE = '/api';

// Token management
const TOKEN_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

export const tokenManager = {
    getAccessToken: () => localStorage.getItem(TOKEN_KEY),
    getRefreshToken: () => localStorage.getItem(REFRESH_KEY),
    setTokens: (access, refresh) => {
        localStorage.setItem(TOKEN_KEY, access);
        if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
    },
    clearTokens: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_KEY);
    },
};

// Helper function to get headers with auth token
const getHeaders = (includeAuth = true) => {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    if (includeAuth) {
        const token = tokenManager.getAccessToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    return headers;
};

// Helper function to handle API responses
const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Request failed' }));
        throw new Error(error.detail || `HTTP ${response.status}`);
    }
    return response.json();
};

// Auth API
export const authAPI = {
    // Get current user profile
    getMe: async () => {
        const response = await fetch(`${API_BASE}/users/me/`, {
            credentials: 'include',
            headers: getHeaders(true),
        });
        return handleResponse(response);
    },

    // Create new user
    signup: async (username, password, email) => {
        const response = await fetch(`${API_BASE}/users/create/`, {
            method: 'POST',
            credentials: 'include',
            headers: getHeaders(false),
            body: JSON.stringify({ username, password, email }),
        });
        const data = await handleResponse(response);

        // After signup, automatically login to get tokens
        const loginResponse = await authAPI.login(username, password);
        return loginResponse;
    },

    // Login (get JWT token)
    login: async (username, password) => {
        const response = await fetch(`${API_BASE}/token/`, {
            method: 'POST',
            credentials: 'include',
            headers: getHeaders(false),
            body: JSON.stringify({ username, password }),
        });
        const data = await handleResponse(response);

        // Store tokens
        tokenManager.setTokens(data.access, data.refresh);

        return data;
    },

    // Logout
    logout: () => {
        tokenManager.clearTokens();
    },
};

// Onboarding API
export const onboardingAPI = {
    // Get current question or start onboarding
    getCurrentQuestion: async () => {
        const response = await fetch(`${API_BASE}/onboarding/`, {
            credentials: 'include',
            headers: getHeaders(true),
        });
        return handleResponse(response);
    },

    // Submit answer and get next question
    submitAnswer: async (answer) => {
        const response = await fetch(`${API_BASE}/onboarding/`, {
            method: 'POST',
            credentials: 'include',
            headers: getHeaders(true),
            body: JSON.stringify({ answer }),
        });
        return handleResponse(response);
    },

    // Reset onboarding
    reset: async () => {
        const response = await fetch(`${API_BASE}/onboarding/reset/`, {
            method: 'POST',
            credentials: 'include',
            headers: getHeaders(true),
            body: JSON.stringify({ answer: '' }),
        });
        return handleResponse(response);
    },
};

// Chatbot API
export const chatAPI = {
    // Send message to chatbot
    sendMessage: async (message) => {
        const response = await fetch(`${API_BASE}/chat/`, {
            method: 'POST',
            credentials: 'include',
            headers: getHeaders(true),
            body: JSON.stringify({ msg: message }),
        });
        return handleResponse(response);
    },

    // Get chat history
    getHistory: async () => {
        const response = await fetch(`${API_BASE}/chat/history/`, {
            credentials: 'include',
            headers: getHeaders(true),
        });
        return handleResponse(response);
    },

    // Reset chat
    reset: async () => {
        const response = await fetch(`${API_BASE}/chat/reset/`, {
            method: 'POST',
            credentials: 'include',
            headers: getHeaders(true),
            body: JSON.stringify({}),
        });
        return handleResponse(response);
    },
};

// Budget API
export const budgetAPI = {
    // List all budgets
    list: async () => {
        const response = await fetch(`${API_BASE}/budget/`, {
            credentials: 'include',
            headers: getHeaders(true),
        });
        return handleResponse(response);
    },

    // Generate budgets with AI
    generate: async () => {
        const response = await fetch(`${API_BASE}/budget/generate/`, {
            method: 'POST',
            credentials: 'include',
            headers: getHeaders(true),
            body: JSON.stringify({}),
        });
        return handleResponse(response);
    },
};

// Expense API
export const expenseAPI = {
    // List expenses
    list: async () => {
        const response = await fetch(`${API_BASE}/expenses/`, {
            credentials: 'include',
            headers: getHeaders(true),
        });
        return handleResponse(response);
    },

    // Create expense (AI-powered: text or file)
    create: async (data) => {
        const isFormData = data instanceof FormData;
        const headers = getHeaders(true);

        if (isFormData) {
            delete headers['Content-Type']; // Let browser set multipart/form-data with boundary
        }

        const response = await fetch(`${API_BASE}/expenses/`, {
            method: 'POST',
            credentials: 'include',
            headers: headers,
            body: isFormData ? data : JSON.stringify(data),
        });
        return handleResponse(response);
    },

    // Generate/Get Report
    getReport: async () => {
        const response = await fetch(`${API_BASE}/expenses/report/`, {
            method: 'POST',
            credentials: 'include',
            headers: getHeaders(true),
            body: JSON.stringify({ message: "Generate a monthly report" }),
        });
        return handleResponse(response);
    },
};

// Notifications API
export const notifyAPI = {
    // List notifications
    list: async (readFilter = null) => {
        let url = `${API_BASE}/notify/`;
        if (readFilter !== null) {
            url += `?read=${readFilter}`;
        }
        const response = await fetch(url, {
            credentials: 'include',
            headers: getHeaders(true),
        });
        return handleResponse(response);
    },

    // Get unread count
    getUnreadCount: async () => {
        const response = await fetch(`${API_BASE}/notify/unread-count/`, {
            credentials: 'include',
            headers: getHeaders(true),
        });
        return handleResponse(response);
    },

    // Mark all as read
    markAllRead: async () => {
        const response = await fetch(`${API_BASE}/notify/mark-all-read/`, {
            method: 'POST',
            credentials: 'include',
            headers: getHeaders(true),
        });
        return handleResponse(response);
    },
};
