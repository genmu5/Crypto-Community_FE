import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, fetchCurrentUser } from '../api';
import useAuth from '../auth/useAuth';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. API 로그인 요청, accessToken과 refreshToken을 모두 받음
            const { accessToken } = await apiLogin({ username, password });

            // 2. AuthContext의 login 함수를 호출하여 토큰들을 저장하고, 사용자 정보를 가져와 상태를 업데이트
            const loginSuccess = await login(accessToken);
            
            if (loginSuccess) {
                navigate('/');
            } else {
                alert('로그인 실패: 사용자 정보 로드에 실패했습니다.');
            }
        } catch (err) {
            alert('로그인 실패: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow rounded p-6">
            <h1 className="text-2xl font-bold mb-4">로그인</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="아이디"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full border p-2 rounded"
                />
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full border p-2 rounded"
                />
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
                    로그인
                </button>
                <button type="button" onClick={() => navigate('/register')} className="w-full bg-green-500 text-white py-2 rounded">
                    회원가입
                </button>
            </form>
        </div>
    );
}