import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../auth/useAuth';
import { createPost } from '../api';

export default function CreatePost() {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    // 비로그인 시 로그인 페이지로
    if (!isLoggedIn) {
        navigate('/login');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createPost({ title, content });
            navigate('/'); // 생성 후 목록으로
        } catch (err) {
            alert('게시글 작성 실패: ' + err.message);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white shadow rounded p-6">
            <h1 className="text-2xl font-bold mb-4">새 글 쓰기</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
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