import React from 'react';
import Sidebar from './Sidebar';
import ChartPlaceholder from '../components/ChartPlaceholder';
import PostList from '../components/PostList';

export default function Home() {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 p-6 overflow-auto">
                <section className="mb-8"><ChartPlaceholder /></section>
                <section><PostList /></section>
            </main>
        </div>
    );
}