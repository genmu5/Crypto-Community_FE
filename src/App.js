// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ChartPlaceholder from './components/ChartPlaceholder';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import Login from './pages/Login';
import CreatePost from './pages/CreatePost';    // 새로 추가
import 'chartjs-adapter-date-fns';

import useAuth from './auth/useAuth';
import { Chart as ChartJS, registerables } from 'chart.js';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';

ChartJS.register(
    ...registerables,
    CandlestickController,
    CandlestickElement
);

function Header() {
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useAuth();

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow flex items-center justify-between px-6 z-20">
            <h1
                className="text-2xl font-bold text-primary cursor-pointer"
                onClick={() => navigate('/')}
            >
                Crypto Community
            </h1>

            {isLoggedIn ? (
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => navigate('/create-post')}
                        className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600 transition"
                    >
                        글쓰기
                    </button>
                    <button
                        onClick={() => {
                            logout();
                            navigate('/');
                        }}
                        className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition"
                    >
                        로그아웃
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => navigate('/login')}
                    className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition"
                >
                    로그인
                </button>
            )}
        </header>

    );
}

export default function App() {
    return (
        <Router>
            <Header />

            <div className="pt-16 flex h-[calc(100vh-4rem)] bg-gray-50">
                <Sidebar />
                <main className="flex-1 p-8 overflow-auto">
                    <div className="max-w-6xl mx-auto space-y-8">
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <>
                                        <ChartPlaceholder />
                                        <PostList />
                                    </>
                                }
                            />
                            <Route path="/post/:postId" element={<PostDetail />} />
                            <Route path="/create-post" element={<CreatePost />} />  {/* 글쓰기 라우트 */}
                            <Route path="/login" element={<Login />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </Router>
    );
}
