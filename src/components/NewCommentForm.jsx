import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../auth/useAuth';

export default function NewCommentForm({ onSubmit }) {
    const [content, setContent] = useState('');
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        if (!content.trim()) return;

        if (!isLoggedIn) {
            alert("로그인이 필요합니다.");
            navigate('/login');
            return;
        }

        try {
            await onSubmit(content);
            setContent('');
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                alert("댓글을 작성할 권한이 없습니다. 다시 로그인해주세요.");
                navigate('/login');
            } else {
                alert("댓글 등록 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <input
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder={isLoggedIn ? "댓글 입력" : "로그인 후 댓글을 작성할 수 있습니다."}
                className="flex-1 p-2 border rounded"
                disabled={!isLoggedIn}
            />
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600 transition disabled:bg-gray-400"
                disabled={!isLoggedIn}
            >
                등록
            </button>
        </form>
    );
}