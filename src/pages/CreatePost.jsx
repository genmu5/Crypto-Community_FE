import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../auth/useAuth';
import { createPost } from '../api';

const MARKETS = [
    { label: 'BTC', code: 'KRW-BTC' },
    { label: 'ETH', code: 'KRW-ETH' },
    { label: 'XRP', code: 'KRW-XRP' },
    { label: 'SAND', code: 'KRW-SAND' },
    { label: 'SOL', code: 'KRW-SOL' },
];

export default function CreatePost() {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [market, setMarket] = useState(MARKETS[0].code); // 기본값 설정

    if (!isLoggedIn) {
        navigate('/login');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // API 호출 시 market 정보 추가
            await createPost({ title, content, market });
            // 작성 완료 후 해당 코인 게시판으로 이동
            navigate(`/board/${market}`);
        } catch (err) {
            alert('게시글 작성 실패: ' + err.message);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white shadow rounded p-6">
            <h1 className="text-2xl font-bold mb-4">새 글 쓰기</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="market-select" className="block text-sm font-medium text-gray-700 mb-1">코인 종류</label>
                    <select
                        id="market-select"
                        value={market}
                        onChange={e => setMarket(e.target.value)}
                        className="w-full border p-2 rounded"
                    >
                        {MARKETS.map(m => (
                            <option key={m.code} value={m.code}>
                                {m.label}
                            </option>
                        ))}
                    </select>
                </div>
                <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="제목"
                    className="w-full border p-2 rounded"
                />
                <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="내용"
                    rows={6}
                    className="w-full border p-2 rounded"
                />
                <button
                    type="submit"
                    className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600 transition"
                >
                    작성
                </button>
            </form>
        </div>
    );
}