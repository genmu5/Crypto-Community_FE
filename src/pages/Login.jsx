import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginAPI } from '../api';
import useAuth from '../auth/useAuth';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();        // ← Context 의 login

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await loginAPI({ username, password });
            console.log('로그인 응답:', data);
            const token = data.token || data.accessToken || data.ACCESS_TOKEN;
            login(token);                    // ← 여기서 Context state & localStorage 저장!
            navigate('/');
        } catch (err) {
            alert('로그인 실패: ' + err.message);
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
            </form>
        </div>
    );
}