 import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authApi from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await authApi.getCurrentUser();
                // CORRECTED: Check for 'authenticated' field
                if (response && response.data && response.data.authenticated) {
                    setUser(response.data);
                    setIsAuthenticated(true);
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } catch (error) {
                setUser(null);
                setIsAuthenticated(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (username, password) => {
        try {
            const response = await authApi.login(username, password);
            // CORRECTED: Check for 'authenticated' field
            if (response && response.data && response.data.authenticated) {
                setUser(response.data);
                setIsAuthenticated(true);
            } else {
                throw new Error(response.message || 'Login failed.');
            }
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } finally {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const register = (username, password, nickname) => {
        return authApi.register(username, password, nickname);
    };

    const authValue = {
        user,
        isAuthenticated,
        login,
        logout,
        register,
    };

    return (
        <AuthContext.Provider value={authValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
