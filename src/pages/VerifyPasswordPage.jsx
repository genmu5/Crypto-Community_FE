import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../auth/useAuth';

export default function VerifyPasswordPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user, signIn } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!user || !user.username) {
            setError("사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.");
            return;
        }

        try {
            const isSuccess = await signIn(user.username, password);
            if (isSuccess) {
                navigate('/mypage', { state: { fromVerification: true } });
            } else {
                setError('인증에 실패했습니다.');
            }
        } catch (err) {
            setError('비밀번호가 올바르지 않습니다. 다시 시도해주세요.');
            console.error("Password verification failed:", err);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="bg-white rounded-2xl ring-1 ring-gray-200 shadow-lg p-8">
                <h1 className="text-2xl font-bold mb-4 text-center">비밀번호 확인</h1>
                <p className="text-center text-gray-600 mb-6">
                    회원님의 정보를 안전하게 보호하기 위해 비밀번호를 다시 한번 입력해주세요.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            비밀번호
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                            autoFocus
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        확인
                    </button>
                </form>
            </div>
        </div>
    );
}
