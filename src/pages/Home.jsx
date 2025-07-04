import React from 'react';
import CandleChart from '../components/CandleChart'; // lightweight-charts 버전
import PostList from '../components/PostList';

export default function Home({ market }) {
    return (
        <>
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2">
                    {market} 1분봉 차트
                </h2>
                <CandleChart market={market} limit={100} />
            </section>
            <section>
                <PostList />
            </section>
        </>
    );
}