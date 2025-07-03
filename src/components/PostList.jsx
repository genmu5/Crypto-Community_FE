import React, { useEffect, useState } from 'react';
import PostItem from './PostItem';
import { fetchPosts } from '../api';

export default function PostList() {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        fetchPosts().then(d => setPosts(d.content));
    }, []);

    return (
        <div className="grid gap-6
                    sm:grid-cols-1
                    md:grid-cols-2
                    lg:grid-cols-3">
            {posts.map(post => (
                <PostItem key={post.id} post={post} />
            ))}
        </div>
    );
}