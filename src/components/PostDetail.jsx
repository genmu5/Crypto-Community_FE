import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPost, fetchComments, createComment } from '../api';
import NewCommentForm from './NewCommentForm';

export default function PostDetail() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);

    const loadComments = async () => {
        const data = await fetchComments(postId);
        setComments(data);
    };

    useEffect(() => {
        fetchPost(postId).then(setPost);
        fetchComments(postId).then(setComments);
    }, [postId]);

    const handleNewComment = async (content) => {
        await createComment(postId, { content });
        await loadComments();
    };

    if (!post) return <div>로딩 중...</div>;

    return (
        <div className="bg-white rounded-2xl ring-1 ring-gray-200 shadow-lg p-6">
            <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
            <div className="text-gray-500 text-sm mb-4">
                {new Date(post.createdAt).toLocaleString()}
            </div>
            <p className="text-gray-700 mb-6">{post.content}</p>

            <h2 className="text-lg font-semibold mt-6">댓글</h2>
            <ul className="mt-2 space-y-2">
                {comments.map(c => (
                    <li key={c.id} className="p-2 border rounded">
                        <strong>{c.authorUsername}:</strong> {c.content}
                    </li>
                ))}
            </ul>

            <NewCommentForm onSubmit={handleNewComment} />
        </div>
    );
}