import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',      // Spring Boot 서버 주소
    withCredentials: true, // [추가] 쿠키 전송을 위해 필수
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};


api.interceptors.request.use(config => {
    return config;
});

// 응답 인터셉터: 토큰 만료 시 재발급 로직
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // 401 또는 403 에러이고, 이미 재시도된 요청이 아니며, refresh 엔드포인트가 아닌 경우
        if ((error.response.status === 401 || error.response.status === 403) && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
            originalRequest._retry = true; // 재시도 플래그 설정

            if (isRefreshing) {
                // 이미 토큰 재발급 중이면, 현재 요청을 큐에 추가
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            isRefreshing = true; // 토큰 재발급 시작

            // Refresh Token을 쿠키에서 자동으로 보내므로 요청 본문이 필요 없음
            try {
                const res = await api.post('/auth/refresh'); 
                const { accessToken: newAccessToken } = res.data; // 새로운 Access Token만 받음

                // AuthContext나 상태 관리 라이브러리를 통해 새 Access Token을 메모리에 업데이트해야 함
                window.dispatchEvent(new CustomEvent('tokenRefreshed', { detail: newAccessToken }));

                api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                
                processQueue(null, newAccessToken);
                return api(originalRequest);
            } catch (refreshError) {
                // 초기 /auth/me 호출 실패는 일반적인 상황이므로 콘솔 에러를 출력하지 않음
                if (originalRequest.url !== 'auth/me') {
                    console.error('Refresh token failed:', refreshError);
                }
                // 로그아웃 처리 (AuthContext에서 처리)
                window.dispatchEvent(new Event('logout'));
                processQueue(refreshError);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export async function login(credentials) {
    try {
        // 응답으로 accessToken만 받음
        const res = await api.post('/auth/login', credentials);
        return res.data; // { accessToken: '...' }
    } catch (error) {
        console.error('Error during login API call:', error);
        throw error;
    }
}

export const fetchCurrentUser = () =>
    api.get('auth/me').then(res => res.data);

export const register = data =>
    api.post('/auth/register', data).then(res => res.data);

// [추가] logout API
export const logout = () => api.post('/auth/logout');

// ─── Posts ───────────────────────────────────────────────────────────────────
export const fetchPosts = (page = 0, size = 10) =>
    api.get(`/posts?page=${page}&size=${size}`).then(res => res.data);

export const fetchPost = postId =>
    api.get(`/posts/${postId}`).then(res => res.data);

export const fetchPostsByMarket = (market, page = 0, size = 10) =>
    api.get(`/posts/market/${market}?page=${page}&size=${size}`).then(res => res.data);


export const createPost = data =>
    api.post('/posts', data).then(res => res.data);

export const updatePost = (postId, data) =>
    api.put(`/posts/${postId}`, data).then(res => res.data);

export const deletePost = postId =>
    api.delete(`posts/${postId}`).then(res => res.data);

// ─── Comments ────────────────────────────────────────────────────────────────
export const fetchComments = postId =>
    api.get(`/posts/${postId}/comments`).then(res => res.data);

export const createComment = (postId, comment) =>
    api.post(`/posts/${postId}/comments`, comment).then(res => res.data);

export const updateComment = (postId, commentId, comment) =>
    api.put(`/posts/${postId}/comments/${commentId}`, comment).then(res => res.data);

export const deleteComment = (postId, commentId) =>
    api.delete(`/posts/${postId}/comments/${commentId}`).then(res => res.data);

// ─── User ────────────────────────────────────────────────────────────────────
export const fetchMyPosts = (page = 0, size = 10) =>
    api.get(`/posts/my?page=${page}&size=${size}`).then(res => res.data);

export const updateUser = (data) =>
    api.put('/user/update', data).then(res => res.data);

export const deleteUser = () =>
    api.delete('/user/delete').then(res => res.data);

export default api;
