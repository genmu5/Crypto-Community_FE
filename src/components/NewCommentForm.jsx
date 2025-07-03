import React, { useState } from 'react';

export default function NewCommentForm({ onSubmit }) {
    const [content, setContent] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        if (!content.trim()) return;
        await onSubmit(content);
        setContent('');
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <input
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="댓글 입력"
                className="flex-1 p-2 border rounded"
            />
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600 transition"
            >
                등록
            </button>
        </form>
    );
}