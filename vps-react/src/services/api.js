import axios from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '@/utils/constants';

// 创建 Axios 实例
const axiosInstance = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器 - 自动添加 token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器 - 统一处理错误
axiosInstance.interceptors.response.use(
    (response) => {
        const { data } = response;

        // 检查业务状态码
        if (data.code !== 0 && data.code !== 200) {
            return Promise.reject(new Error(data.message || '请求失败'));
        }

        return data.data || data;
    },
    (error) => {
        if (error.response) {
            const { status } = error.response;

            if (status === 401) {
                // 未授权,清除 token 并跳转登录
                localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                window.location.href = '/login';
                return Promise.reject(new Error('未授权,请重新登录'));
            }

            if (status === 403) {
                return Promise.reject(new Error('无权限访问'));
            }

            if (status === 404) {
                return Promise.reject(new Error('请求的资源不存在'));
            }

            if (status >= 500) {
                return Promise.reject(new Error('服务器错误,请稍后重试'));
            }
        }

        if (error.code === 'ECONNABORTED') {
            return Promise.reject(new Error('请求超时'));
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
