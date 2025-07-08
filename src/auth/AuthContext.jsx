import React, { createContext, useState, useEffect } from 'react';
import api, { fetchCurrentUser } from '../api';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('ACCESS_TOKEN'));
    const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('REFRESH_TOKEN'));
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            if (token) {
                try {
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const userData = await fetchCurrentUser();
                    setUser(userData);
                } catch (error) {
                    console.error("Initial token verification failed", error);
                    // The interceptor will handle refresh. If it fails, user will be logged out.
                    // For safety, we can perform logout here if refresh fails.
                    logout();
                }
            }
            setIsLoading(false);
        };
        verifyToken();
    }, [token]); // Run when token changes

    const login = (newAccessToken, newRefreshToken) => {
        localStorage.setItem('ACCESS_TOKEN', newAccessToken);
        localStorage.setItem('REFRESH_TOKEN', newRefreshToken);
        setToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
    };

    const logout = () => {
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.removeItem('REFRESH_TOKEN');
        setToken(null);
        setRefreshToken(null);
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
    };

    const isLoggedIn = !!token && !!user;

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ token, user, isLoggedIn, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}