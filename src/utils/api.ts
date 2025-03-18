import axios from 'axios';
import { store } from '../stores/store';
import { logout } from '../stores/authSlice';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json'
    }
});


// 请求拦截器：添加 token
api.interceptors.request.use((config) => {
    // console.log('发送请求到:', config.url);
    
    const state = store.getState();
    // console.log('当前 Redux 状态:', JSON.stringify(state.auth));
    
    const token = state.auth.token?.accessToken;
    if (token) {
        config.headers.Authorization = ` ${token}`;
        // 调试信息
        // console.log('发送请求携带 token:', token);
        // console.log('完整请求头:', JSON.stringify(config.headers));
    } else {
        console.log('请求未携带 token,可能未登录');
    }
    return config;
});

// 响应拦截器：处理错误
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            console.error('API 错误:', error.response.status, error.response.data);
            // 如果是 401 错误，可能是 token 过期
            if (error.response.status === 401) {
                console.error('认证失败，可能需要重新登录');
                // 清除 token
                store.dispatch(logout());
                // 重定向到登录页面
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api; 