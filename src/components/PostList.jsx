import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PostItem from './PostItem';
import { fetchPosts, fetchPostsByMarket } from '../api';
import CandleChart from './CandleChart'; // 차트 컴포넌트 임포트

export default function PostList() {
    const [posts, setPosts] = useState([]);
    const { market } = useParams(); // URL에서 market 파라미터 추출

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const data = market
                    ? await fetchPostsByMarket(market)
                    : await fetchPosts();
                setPosts(data.content);
            } catch (error) {
                console.error("게시글 조회 실패:", error);
                setPosts([]);
            }
        };

        loadPosts();
    }, [market]);

    return (
        <div>
            {market && (
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">
                        {market} 1분봉 차트
                    </h2>
                    <CandleChart market={market} limit={100} />
                </section>
            )}
            <h2 className="text-2xl font-bold mb-6">{market ? `${market} 게시판` : '전체 글'}</h2>
            <div className="grid gap-6
                        sm:grid-cols-1
                        md:grid-cols-2
                        lg:grid-cols-3">
                {posts.map(post => (
                    <PostItem key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}