import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',      // Spring Boot 서버 주소
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

// 요청 인터셉터: 로컬스토리지에 ACCESS_TOKEN 있으면 자동으로 Authorization 헤더에 붙여줌
api.interceptors.request.use(config => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
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

            const refreshToken = localStorage.getItem('REFRESH_TOKEN');

            if (!refreshToken) {
                // 리프레시 토큰이 없으면 바로 로그아웃
                localStorage.removeItem('ACCESS_TOKEN');
                localStorage.removeItem('REFRESH_TOKEN');
                window.location.href = '/login'; // 로그인 페이지로 리다이렉트
                return Promise.reject(error);
            }

            try {
                const res = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { refreshToken });
                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data;

                localStorage.setItem('ACCESS_TOKEN', newAccessToken);
                localStorage.setItem('REFRESH_TOKEN', newRefreshToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

                processQueue(null, newAccessToken); // 큐에 있는 요청들 처리
                return api(originalRequest); // 원래 요청 재시도
            } catch (refreshError) {
                // 리프레시 토큰도 만료되었거나 재발급 실패 시
                console.error('Refresh token failed:', refreshError);
                localStorage.removeItem('ACCESS_TOKEN');
                localStorage.removeItem('REFRESH_TOKEN');
                processQueue(refreshError); // 큐에 있는 요청들 실패 처리
                window.location.href = '/login'; // 로그인 페이지로 리다이렉트
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
        const res = await api.post('/auth/login', credentials);
        return res.data; // { accessToken: '...', refreshToken: '...' }
    } catch (error) {
        console.error('Error during login API call:', error);
        throw error;
    }
}

export const fetchCurrentUser = () =>
    api.get('auth/me').then(res => res.data);

export const register = data =>
    api.post('/auth/register', data).then(res => res.data);

// ─── Posts ───────────────────────────────────────────────────────────────────
export const fetchPosts = (page = 0, size = 10) =>
    api.get(`/posts?page=${page}&size=${size}`).then(res => res.data);

export const fetchPost = postId =>
    api.get(`/posts/${postId}`).then(res => res.data);

export const fetchPostsByMarket = (market, page = 0, size = 10) =>
    api.get(`/posts/market/${market}?page=${page}&size=${size}`).then(res => res.data);


export const createPost = data =>
    api.post('/posts', data).then(res => res.data);

// ─── Comments ────────────────────────────────────────────────────────────────
export const fetchComments = postId =>
    api.get(`/posts/${postId}/comments`).then(res => res.data);

export const createComment = (postId, comment) =>
    api.post(`/posts/${postId}/comments`, comment).then(res => res.data);

export default api; // api 인스턴스를 export하여 AuthContext에서 사용 가능하게 함
