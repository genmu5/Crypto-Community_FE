import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useNavigate,
} from 'react-router-dom';

import useAuth from './auth/useAuth';
import Sidebar from './components/Sidebar';
import PostList from './components/PostList'; // Home 대신 PostList를 메인으로 사용
import PostDetail from './components/PostDetail';
import CreatePost from './pages/CreatePost';
import Login from './pages/Login';
import Register from './pages/Register';

import MyPage from './pages/MyPage';

function Header() {
    const navigate = useNavigate();
    const { user, isLoggedIn, logout } = useAuth();

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
                    <span className="font-semibold">{user?.username}님 환영합니다!</span>
                    <button
                        onClick={() => navigate('/mypage')}
                        className="bg-purple-500 text-white rounded px-4 py-2 hover:bg-purple-600 transition"
                    >
                        마이페이지
                    </button>
                    <button
                        onClick={() => navigate('/create-post')}
                        className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600 transition"
                    >
                        글쓰기
                    </button>
                    <button
                        onClick={async () => {
                            await logout();
                            navigate('/');
                            window.location.reload(); // [추가] 로그아웃 후 페이지 새로고침
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
                    <Routes>
                        <Route path="/" element={<PostList />} />
                        <Route path="/board/:market" element={<PostList />} />
                        <Route path="/post/:postId" element={<PostDetail />} />
                        <Route path="/create-post" element={<CreatePost />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/mypage" element={<MyPage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}