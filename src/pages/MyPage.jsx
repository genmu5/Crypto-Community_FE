import React, { useState, useEffect } from 'react';
import { fetchMyPosts, updateUser, deleteUser } from '../api';
import useAuth from '../auth/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

const MyPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [myPosts, setMyPosts] = useState([]);
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (location.state?.fromVerification !== true) {
            navigate('/verify-password');
            return; // 리디렉션 후 추가 실행 방지
        }

        fetchMyPosts().then(data => {
            setMyPosts(data.content);
        });
    }, [location, navigate]);

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            await updateUser({ email, password });
            alert('회원 정보가 수정되었습니다.');
            setPassword('');
        } catch (error) {
            console.error('Failed to update user:', error);
            alert('회원 정보 수정에 실패했습니다.');
        }
    };

    const handleDeleteUser = async () => {
        if (window.confirm('정말로 회원 탈퇴를 하시겠습니까? 모든 게시글과 댓글이 삭제됩니다.')) {
            try {
                await deleteUser();
                alert('회원 탈퇴가 완료되었습니다.');
                logout();
                navigate('/');
            } catch (error) {
                console.error('Failed to delete user:', error);
                alert('회원 탈퇴에 실패했습니다.');
            }
        }
    };

    return (
        <div className="container mx-auto p-4">

            <h1 className="text-2xl font-bold mb-4">마이페이지</h1>
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-xl font-bold mb-4">회원 정보 수정</h2>
                <form onSubmit={handleUpdateUser}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            아이디
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                            id="username"
                            type="text"
                            value={user?.username || ''}
                            disabled
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            이메일
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            새 비밀번호
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder="******************"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            정보 수정
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-xl font-bold mb-4">내가 쓴 글</h2>
                <ul>
                    {myPosts.map(post => (
                        <li key={post.id} className="border-b py-2">
                            <a href={`/post/${post.id}`} className="text-blue-500 hover:underline">{post.title}</a>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">회원 탈퇴</strong>
                <p className="block sm:inline">회원 탈퇴 시 모든 정보가 삭제되며 복구할 수 없습니다.</p>
                <button
                    onClick={handleDeleteUser}
                    className="absolute top-0 bottom-0 right-0 px-4 py-3 bg-red-500 text-white font-bold hover:bg-red-700"
                >
                    회원 탈퇴
                </button>
            </div>
        </div>
    );
};

export default MyPage;
