import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function ResetPasswordPage() {
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // URL에서 토큰 파싱
        const queryParams = new URLSearchParams(location.search);
        const tokenFromUrl = queryParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            setError('유효한 토큰이 URL에 없습니다.');
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (newPassword !== confirmPassword) {
            setError('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/auth/reset-password', {
                token,
                newPassword
            });
            setMessage(response.data);
            // 비밀번호 재설정 성공 후 로그인 페이지로 리다이렉트
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data || '비밀번호 재설정에 실패했습니다.');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>비밀번호 재설정</h2>
            {error && !token && <p style={{ color: 'red' }}>{error}</p>} {/* 토큰이 없을 때만 에러 표시 */}
            {token && (
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="newPassword" style={{ display: 'block', marginBottom: '5px' }}>새 비밀번호:</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px' }}>비밀번호 확인:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        비밀번호 재설정
                    </button>
                </form>
            )}
            {message && <p style={{ color: 'green', marginTop: '15px' }}>{message}</p>}
            {error && token && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>} {/* 토큰이 있을 때만 에러 표시 */}
        </div>
    );
}

export default ResetPasswordPage;
