import React, { createContext, useState } from 'react';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
    // 1) 초기값: localStorage에 ACCESS_TOKEN이 있으면 그대로 사용
    const [token, setToken] = useState(() =>
        localStorage.getItem('ACCESS_TOKEN') || null
    );

    const login = (newToken) => {
        // 2) 로그인 시 즉시 localStorage 저장 + state 업데이트
        localStorage.setItem('ACCESS_TOKEN', newToken);
        setToken(newToken);
    };

    const logout = () => {
        // 3) 로그아웃 시 즉시 제거 + state 클리어
        localStorage.removeItem('ACCESS_TOKEN');
        setToken(null);
    };

    const isLoggedIn = !!token;

    return (
        <AuthContext.Provider value={{ token, isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
