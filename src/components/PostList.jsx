import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate 추가
import { fetchPosts, fetchPostsByMarket } from '../api';
import CandleChart from './CandleChart';

export default function PostList() {
    const [posts, setPosts] = useState([]);
    const { market } = useParams();
    const navigate = useNavigate(); // useNavigate 훅 사용

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
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-18">
                                번호
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                제목
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                작성자
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                                작성일
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {posts.map((post, index) => (
                            <tr key={post.id} className="hover:bg-gray-50 cursor-pointer"
                                onClick={() => navigate(`/post/${post.id}`)}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {posts.length - index} {/* 역순으로 번호 매기기 */}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {post.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {post.authorUsername || '익명'} {/* 작성자 정보가 없으면 '익명' */}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(post.createdAt).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}