import React from 'react';
import Sidebar from './Sidebar';
import CandleChart from '../components/CandleChart';
import PostList from '../components/PostList';

export default function Home() {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 p-6 overflow-auto">
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">KRW-BTC 1분봉 차트</h2>
                    <CandleChart market="KRW-BTC" limit={100} />
                </section>
                <section>
                    <PostList />
                </section>
            </main>
        </div>
    );
}
