import React, { useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext'; // AuthContext 경로 확인 필요

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false); // '로그인 상태 유지' state
    const { login } = useContext(AuthContext); // AuthContext에서 login 함수 가져오기

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // login 함수 호출 시 rememberMe 값을 함께 전달
            await login(username, password, rememberMe);
            // 성공 시 홈으로 리디렉션 (AuthContext 내부에서 처리될 수 있음)
        } catch (error) {
            console.error("Login failed:", error);
            // 실패 시 에러 메시지 표시
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="bg-white rounded-2xl ring-1 ring-gray-200 shadow-lg p-8">
                <h1 className="text-2xl font-bold mb-6 text-center">로그인</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            아이디
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            비밀번호
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between mb-6">
                        <label className="flex items-center text-sm text-gray-600">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="form-checkbox h-4 w-4 text-blue-600"
                            />
                            <span className="ml-2">로그인 상태 유지</span>
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        로그인
                    </button>
                </form>
            </div>
        </div>
    );
}
