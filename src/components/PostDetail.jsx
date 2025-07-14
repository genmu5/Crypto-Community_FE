import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPost, deletePost, updatePost, fetchComments, createComment, deleteComment, updateComment } from '../api';
import NewCommentForm from './NewCommentForm';
import useAuth from '../auth/useAuth';

export default function PostDetail() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [isEditingPost, setIsEditingPost] = useState(false);
    const [editedPostContent, setEditedPostContent] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedCommentContent, setEditedCommentContent] = useState('');

    const loadPostAndComments = useCallback(async () => {
        fetchPost(postId).then(setPost);
        fetchComments(postId).then(setComments);
    }, [postId]);

    useEffect(() => {
        loadPostAndComments();
    }, [loadPostAndComments]);

    const handleNewComment = async (content) => {
        await createComment(postId, { content });
        await loadPostAndComments();
    };

    const handlePostDelete = async () => {
        if (window.confirm('정말로 게시글을 삭제하시겠습니까?')) {
            try {
                await deletePost(postId);
                alert('게시글이 삭제되었습니다.');
                navigate('/');
            } catch (error) {
                console.error('Failed to delete post:', error);
                alert('게시글 삭제에 실패했습니다.');
            }
        }
    };

    const handlePostUpdate = async () => {
        try {
            const updatedPost = await updatePost(postId, { title: post.title, content: editedPostContent });
            setPost(updatedPost);
            setIsEditingPost(false);
            alert('게시글이 수정되었습니다.');
        } catch (error) {
            console.error('Failed to update post:', error);
            alert('게시글 수정에 실패했습니다.');
        }
    };

    const handleCommentDelete = async (commentId) => {
        if (window.confirm('정말로 댓글을 삭제하시겠습니까?')) {
            try {
                await deleteComment(postId, commentId);
                setComments(comments.filter(comment => comment.id !== commentId));
                alert('댓글이 삭제되었습니다.');
            } catch (error) {
                console.error('Failed to delete comment:', error);
                alert('댓글 삭제에 실패했습니다.');
            }
        }
    };

    const handleCommentUpdate = async (commentId) => {
        try {
            await updateComment(postId, commentId, { content: editedCommentContent });
            setEditingCommentId(null);
            await loadPostAndComments();
            alert('댓글이 수정되었습니다.');
        } catch (error) {
            console.error('Failed to update comment:', error);
            alert('댓글 수정에 실패했습니다.');
        }
    };

    if (!post) return <div>로딩 중...</div>;

    return (
        <div className="bg-white rounded-2xl ring-1 ring-gray-200 shadow-lg p-6">
            <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
            <div className="text-gray-500 text-sm mb-4">
                작성자: {post.authorUsername || '익명'} | {new Date(post.createdAt).toLocaleString()}
            </div>

            {isEditingPost ? (
                <div>
                    <textarea
                        className="w-full p-2 border rounded"
                        value={editedPostContent}
                        onChange={(e) => setEditedPostContent(e.target.value)}
                    />
                    <button onClick={handlePostUpdate} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">저장</button>
                    <button onClick={() => setIsEditingPost(false)} className="bg-gray-500 text-white px-4 py-2 rounded">취소</button>
                </div>
            ) : (
                <p className="text-gray-700 mb-6">{post.content}</p>
            )}

            {user && user.username === post.authorUsername && !isEditingPost && (
                <div className="flex justify-end space-x-2 mb-6">
                    <button onClick={() => { setIsEditingPost(true); setEditedPostContent(post.content); }} className="bg-yellow-500 text-white px-4 py-2 rounded">수정</button>
                    <button onClick={handlePostDelete} className="bg-red-500 text-white px-4 py-2 rounded">삭제</button>
                </div>
            )}

            <h2 className="text-lg font-semibold mt-6">댓글</h2>
            <ul className="mt-2 space-y-2">
                {comments.map(c => (
                    <li key={c.id} className="p-2 border rounded">
                        {editingCommentId === c.id ? (
                            <div>
                                <textarea
                                    className="w-full p-2 border rounded"
                                    value={editedCommentContent}
                                    onChange={(e) => setEditedCommentContent(e.target.value)}
                                />
                                <button onClick={() => handleCommentUpdate(c.id)} className="bg-blue-500 text-white px-2 py-1 rounded mr-1">저장</button>
                                <button onClick={() => setEditingCommentId(null)} className="bg-gray-500 text-white px-2 py-1 rounded">취소</button>
                            </div>
                        ) : (
                            <div>
                                <div className="flex justify-between items-start">
                                    <span><strong>{c.authorUsername}:</strong> {c.content}</span>
                                    {user && user.username === c.authorUsername && (
                                        <div className="flex space-x-1">
                                            <button onClick={() => { setEditingCommentId(c.id); setEditedCommentContent(c.content); }} className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">수정</button>
                                            <button onClick={() => handleCommentDelete(c.id)} className="bg-red-500 text-white px-2 py-1 rounded text-xs">삭제</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            <NewCommentForm onSubmit={handleNewComment} />
        </div>
    );
}