import { fetchApi } from './index';

/**
 * Logs in a user.
 * @param {string} username - The user's username.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} The server response.
 */
export const login = (username, password) => {
    return fetchApi('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

/**
 * Registers a new user.
 * @param {string} username - The new user's username.
 * @param {string} password - The new user's password.
 * @param {string} nickname - The new user's nickname.
 * @returns {Promise<Object>} The server response.
 */
export const register = (username, password, nickname) => {
    return fetchApi('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, password, nickname }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

/**
 * Fetches the currently authenticated user's information.
 * @returns {Promise<Object>} The user data.
 */
export const getCurrentUser = () => {
    return fetchApi('/api/auth/me');
};

/**
 * Logs out the current user.
 * @returns {Promise<Response>} The fetch response.
 */
export const logout = () => {
    return fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
    });
};