import React, { createContext, useState, useEffect, useCallback } from 'react';
import api, { fetchCurrentUser, logout as apiLogout } from '../api';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null); // In-memory-only token
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = useCallback(async (newAccessToken) => {
        setToken(newAccessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        try {
            const userData = await fetchCurrentUser();
            setUser(userData);
            return true; // Indicate success
        } catch (error) {
            console.error("Failed to fetch user after login:", error);
            await apiLogout();
            setToken(null);
            setUser(null);
            delete api.defaults.headers.common['Authorization'];
            return false; // Indicate failure
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await apiLogout(); // 백엔드에 로그아웃 요청 보내기
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setToken(null);
            setUser(null);
            delete api.defaults.headers.common['Authorization'];
        }
    }, []);

    useEffect(() => {
        // 토큰 재발급 성공 시 이벤트 리스너
        const handleTokenRefreshed = (e) => {
            const newAccessToken = e.detail;
            login(newAccessToken); // Use the updated login function
        };
        // 로그아웃 이벤트 리스너
        const handleLogout = () => logout();

        window.addEventListener('tokenRefreshed', handleTokenRefreshed);
        window.addEventListener('logout', handleLogout);

        // 앱 시작 시 초기 사용자 정보 로드 시도
        const initializeAuth = async () => {
            try {
                const userData = await fetchCurrentUser();
                setUser(userData);
            } catch (error) {
                console.error("Initial auth check failed:", error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();

        return () => {
            window.removeEventListener('tokenRefreshed', handleTokenRefreshed);
            window.removeEventListener('logout', handleLogout);
        };
    }, [login, logout]);

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