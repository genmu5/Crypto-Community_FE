import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',      // Spring Boot 서버 주소
});

// 요청 인터셉터: 로컬스토리지에 ACCESS_TOKEN 있으면 자동으로 Authorization 헤더에 붙여줌
api.interceptors.request.use(config => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ─── Auth ────────────────────────────────────────────────────────────────────
export async function login(credentials) {
    const res = await api.post('/auth/login', credentials);
    return res.data; // { accessToken: '...' }
}

export const register = data =>
    api.post('/auth/register', data).then(res => res.data);

// ─── Posts ───────────────────────────────────────────────────────────────────
export const fetchPosts = (page = 0, size = 10) =>
    api.get(`/posts?page=${page}&size=${size}`).then(res => res.data);

export const fetchPost = postId =>
    api.get(`/posts/${postId}`).then(res => res.data);

export const createPost = data =>
    api.post('/posts', data).then(res => res.data);

// ─── Comments ────────────────────────────────────────────────────────────────
export const fetchComments = postId =>
    api.get(`/posts/${postId}/comments`).then(res => res.data);

export const createComment = (postId, comment) =>
    api.post(`/posts/${postId}/comments`, comment).then(res => res.data);