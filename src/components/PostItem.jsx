import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PostItem({ post }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/post/${post.id}`)}
            className="bg-white rounded-2xl ring-1 ring-gray-200 shadow-lg
                    hover:shadow-xl hover:-translate-y-1 transform transition-all
                    p-8 flex flex-col cursor-pointer"
        >
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{post.title}</h3>
            <p className="text-gray-600 line-clamp-3 flex-1">{post.content}</p>
            <div className="mt-4 text-sm text-gray-400">
                {new Date(post.createdAt).toLocaleString()}
            </div>
        </div>
    );
}
