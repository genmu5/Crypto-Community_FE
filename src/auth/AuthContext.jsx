import React, { createContext, useState, useEffect, useCallback } from 'react';
import api, { fetchCurrentUser, logout as apiLogout } from '../api';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null); // In-memory-only token
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // 내부적으로 인증 상태를 설정하는 함수
    const setAuthData = useCallback(async (newAccessToken) => {
        setToken(newAccessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        try {
            const userData = await fetchCurrentUser();
            setUser(userData);
        } catch (error) {
            console.error("Failed to fetch user after setting auth data:", error);
            // 실패 시 상태 초기화
            setToken(null);
            setUser(null);
            delete api.defaults.headers.common['Authorization'];
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

    // 로그인 API를 호출하는 새로운 함수
    const signIn = useCallback(async (username, password, rememberMe) => {
        try {
            const response = await api.post('/auth/login', {
                username,
                password,
                rememberMe
            });
            const { accessToken } = response.data;
            if (accessToken) {
                await setAuthData(accessToken);
                return true; // 로그인 성공
            }
            return false; // 토큰이 없는 경우
        } catch (error) {
            console.error("Sign in failed:", error);
            await logout(); // 실패 시 확실하게 로그아웃 처리
            throw error; // 에러를 다시 던져서 컴포넌트에서 처리할 수 있도록 함
        }
    }, [setAuthData, logout]);


    useEffect(() => {
        // 토큰 재발급 성공 시 이벤트 리스너
        const handleTokenRefreshed = (e) => {
            const newAccessToken = e.detail;
            setAuthData(newAccessToken);
        };
        // 로그아웃 이벤트 리스너
        const handleLogout = () => logout();

        window.addEventListener('tokenRefreshed', handleTokenRefreshed);
        window.addEventListener('logout', handleLogout);

        // 앱 시작 시 초기 사용자 정보 로드 시도 (Silent Refresh)
        const initializeAuth = async () => {
            try {
                // api/index.js의 응답 인터셉터가 자동으로 토큰 재발급을 시도하고,
                // 성공하면 'tokenRefreshed' 이벤트를 발생시켜 위 핸들러가 처리함.
                // 따라서 여기서는 현재 사용자 정보만 가져오면 됨.
                const userData = await fetchCurrentUser();
                setUser(userData);
            } catch (error) {
                // 초기 인증 실패는 일반적인 상황이므로 콘솔에 에러를 찍지 않을 수 있음
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();

        return () => {
            window.removeEventListener('tokenRefreshed', handleTokenRefreshed);
            window.removeEventListener('logout', handleLogout);
        };
    }, [setAuthData, logout]);

    const isLoggedIn = !!token && !!user;

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ token, user, isLoggedIn, signIn, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}