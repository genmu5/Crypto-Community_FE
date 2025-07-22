import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ForgotPasswordPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [maskedEmail, setMaskedEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleUsernameSubmit = async (e) =>{
        e.preventDefault();
        setMessage('');
        setError('');
        setIsLoading(true);
        try{
            const response = await axios.post('http://localhost:8080/api/auth/verify-username-for-password-reset', {username});
            setMaskedEmail(response.data.email);
            setStep(2);
        }
        catch(err){
            setError(err.response?.data || '아이디 확인에 실패했습니다');
        }finally{
            setIsLoading(false);
        }
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsLoading(true);
        try {
            // 기존 forgot-password 엔드포인트 호출 (username과 email 모두 전송)
            const response = await axios.post('http://localhost:8080/api/auth/forgot-password', { username, email });
            setMessage(response.data);
        } catch (err) {
            setError(err.response?.data || '비밀번호 재설정 요청에 실패했습니다.');
        }
        finally{
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>비밀번호 찾기</h2>

            {step === 1 && ( // 1단계 UI: 아이디 입력
                <form onSubmit={handleUsernameSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>아이디:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            disabled={isLoading}
                        />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        {isLoading ? '확인중...' : '다음'}
                    </button>
                </form>
            )}

            {step === 2 && ( // 2단계 UI: 이메일 확인 및 링크 전송
                <form onSubmit={handleEmailSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>
                            등록된 이메일: {maskedEmail} {/* 마스킹된 이메일 표시 */}
                        </label>
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>이메일 주소:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            disabled={isLoading}
                        />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        {isLoading ? '메일 전송 중...' : '비밀번호 재설정 링크 받기'}
                    </button>
                </form>
            )}

            {message && <p style={{ color: 'green', marginTop: '15px' }}>{message}</p>}
            {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}
            <p style={{ marginTop: '20px', textAlign: 'center' }}>
                <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>로그인 페이지로 돌아가기</a>
            </p>
        </div>
    );
}

export default ForgotPasswordPage;
