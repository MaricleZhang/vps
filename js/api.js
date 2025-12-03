/**
 * VPS管理平台 - API接口封装
 * 统一管理所有后端API调用
 */

// API基础配置
const API_CONFIG = {
    baseURL: '/api',  // 后端API基础URL，生产环境需要修改
    timeout: 10000,   // 请求超时时间
    headers: {
        'Content-Type': 'application/json'
    }
};

/**
 * HTTP请求封装
 */
class HttpClient {
    constructor(config) {
        this.config = config;
    }

    /**
     * 获取请求头
     * @returns {object} 请求头对象
     */
    getHeaders() {
        const headers = { ...this.config.headers };

        // 从localStorage获取token并添加到请求头
        const token = localStorage.getItem('access_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    /**
     * 处理响应
     * @param {Response} response - fetch响应对象
     * @returns {Promise<any>}
     */
    async handleResponse(response) {
        // 检查HTTP状态码
        if (!response.ok) {
            if (response.status === 401) {
                // 未授权，清除token并跳转到登录页
                localStorage.removeItem('access_token');
                window.location.href = '/login.html';
                throw new Error('未授权，请重新登录');
            }

            if (response.status === 403) {
                throw new Error('无权限访问');
            }

            if (response.status === 404) {
                throw new Error('请求的资源不存在');
            }

            if (response.status >= 500) {
                throw new Error('服务器错误，请稍后重试');
            }
        }

        // 解析JSON响应
        const data = await response.json();

        // 检查业务状态码
        if (data.code !== 0 && data.code !== 200) {
            throw new Error(data.message || '请求失败');
        }

        return data.data || data;
    }

    /**
     * 处理错误
     * @param {Error} error - 错误对象
     */
    handleError(error) {
        console.error('API请求错误:', error);

        if (error.name === 'AbortError') {
            throw new Error('请求超时');
        }

        throw error;
    }

    /**
     * GET请求
     * @param {string} url - 请求URL
     * @param {object} params - 查询参数
     * @returns {Promise<any>}
     */
    async get(url, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const fullUrl = `${this.config.baseURL}${url}${queryString ? '?' + queryString : ''}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        try {
            const response = await fetch(fullUrl, {
                method: 'GET',
                headers: this.getHeaders(),
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            return await this.handleResponse(response);
        } catch (error) {
            clearTimeout(timeoutId);
            return this.handleError(error);
        }
    }

    /**
     * POST请求
     * @param {string} url - 请求URL
     * @param {object} data - 请求体数据
     * @returns {Promise<any>}
     */
    async post(url, data = {}) {
        const fullUrl = `${this.config.baseURL}${url}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        try {
            const response = await fetch(fullUrl, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(data),
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            return await this.handleResponse(response);
        } catch (error) {
            clearTimeout(timeoutId);
            return this.handleError(error);
        }
    }

    /**
     * PUT请求
     * @param {string} url - 请求URL
     * @param {object} data - 请求体数据
     * @returns {Promise<any>}
     */
    async put(url, data = {}) {
        const fullUrl = `${this.config.baseURL}${url}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        try {
            const response = await fetch(fullUrl, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(data),
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            return await this.handleResponse(response);
        } catch (error) {
            clearTimeout(timeoutId);
            return this.handleError(error);
        }
    }

    /**
     * DELETE请求
     * @param {string} url - 请求URL
     * @returns {Promise<any>}
     */
    async delete(url) {
        const fullUrl = `${this.config.baseURL}${url}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        try {
            const response = await fetch(fullUrl, {
                method: 'DELETE',
                headers: this.getHeaders(),
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            return await this.handleResponse(response);
        } catch (error) {
            clearTimeout(timeoutId);
            return this.handleError(error);
        }
    }
}

// 创建HTTP客户端实例
const http = new HttpClient(API_CONFIG);

/**
 * API接口定义
 */
export const api = {
    /**
     * 用户相关接口
     */
    user: {
        /**
         * 获取用户信息
         * @returns {Promise<object>}
         * 响应数据格式：
         * {
         *   id: number,
         *   username: string,
         *   email: string,
         *   avatar: string,
         *   createdAt: string
         * }
         */
        getInfo() {
            return http.get('/user/info');
        },

        /**
         * 更新用户信息
         * @param {object} data - 用户数据
         * @returns {Promise<object>}
         */
        updateInfo(data) {
            return http.put('/user/info', data);
        },

        /**
         * 修改密码
         * @param {string} oldPassword - 旧密码
         * @param {string} newPassword - 新密码
         * @returns {Promise<object>}
         */
        changePassword(oldPassword, newPassword) {
            return http.post('/user/change-password', { oldPassword, newPassword });
        }
    },

    /**
     * 账户相关接口
     */
    account: {
        /**
         * 获取账户余额
         * @returns {Promise<object>}
         * 响应数据格式：
         * {
         *   balance: number,      // 余额（CNY）
         *   currency: string      // 货币类型
         * }
         */
        getBalance() {
            return http.get('/account/balance');
        },

        /**
         * 获取流量使用情况
         * @returns {Promise<object>}
         * 响应数据格式：
         * {
         *   used: number,         // 已使用流量（字节）
         *   total: number,        // 总流量（字节）
         *   percentage: number,   // 使用百分比
         *   resetDate: string     // 重置日期
         * }
         */
        getTraffic() {
            return http.get('/account/traffic');
        },

        /**
         * 获取账户统计信息
         * @returns {Promise<object>}
         * 响应数据格式：
         * {
         *   balance: number,
         *   traffic: { used: number, total: number },
         *   expireDate: string,   // 到期时间
         *   daysRemaining: number // 剩余天数
         * }
         */
        getStats() {
            return http.get('/account/stats');
        },

        /**
         * 充值
         * @param {number} amount - 充值金额
         * @param {string} method - 支付方式
         * @returns {Promise<object>}
         */
        recharge(amount, method) {
            return http.post('/account/recharge', { amount, method });
        }
    },

    /**
     * 订阅相关接口
     */
    subscription: {
        /**
         * 获取订阅列表
         * @returns {Promise<array>}
         * 响应数据格式：
         * [{
         *   id: number,
         *   name: string,
         *   type: string,         // 套餐类型
         *   price: number,
         *   traffic: number,      // 流量额度（字节）
         *   duration: number,     // 有效期（天）
         *   status: string,       // active/expired/cancelled
         *   expireDate: string,
         *   subscribeUrl: string  // 订阅链接
         * }]
         */
        getList() {
            return http.get('/subscriptions');
        },

        /**
         * 获取可用套餐
         * @returns {Promise<array>}
         * 响应数据格式：
         * [{
         *   id: number,
         *   name: string,
         *   description: string,
         *   price: number,
         *   traffic: number,
         *   duration: number,
         *   features: string[]    // 特性列表
         * }]
         */
        getPlans() {
            return http.get('/subscriptions/plans');
        },

        /**
         * 购买订阅
         * @param {number} planId - 套餐ID
         * @param {string} paymentMethod - 支付方式
         * @returns {Promise<object>}
         */
        purchase(planId, paymentMethod) {
            return http.post('/subscriptions/purchase', { planId, paymentMethod });
        },

        /**
         * 续费订阅
         * @param {number} subscriptionId - 订阅ID
         * @param {number} duration - 续费时长（月）
         * @returns {Promise<object>}
         */
        renew(subscriptionId, duration) {
            return http.post('/subscriptions/renew', { subscriptionId, duration });
        },

        /**
         * 取消订阅
         * @param {number} subscriptionId - 订阅ID
         * @returns {Promise<object>}
         */
        cancel(subscriptionId) {
            return http.delete(`/subscriptions/${subscriptionId}`);
        }
    },

    /**
     * 节点相关接口
     */
    node: {
        /**
         * 获取节点列表
         * @param {object} filters - 筛选条件
         * @returns {Promise<array>}
         * 响应数据格式：
         * [{
         *   id: number,
         *   name: string,
         *   location: string,     // 地理位置
         *   protocol: string,     // 协议类型
         *   status: string,       // online/offline/maintenance
         *   latency: number,      // 延迟（ms）
         *   load: number,         // 负载百分比
         *   bandwidth: string     // 带宽
         * }]
         */
        getList(filters = {}) {
            return http.get('/nodes', filters);
        },

        /**
         * 获取节点详情
         * @param {number} nodeId - 节点ID
         * @returns {Promise<object>}
         */
        getDetail(nodeId) {
            return http.get(`/nodes/${nodeId}`);
        },

        /**
         * 测试节点延迟
         * @param {number} nodeId - 节点ID
         * @returns {Promise<object>}
         */
        testLatency(nodeId) {
            return http.post(`/nodes/${nodeId}/test`);
        }
    },

    /**
     * 公告相关接口
     */
    announcement: {
        /**
         * 获取公告列表
         * @param {number} limit - 数量限制
         * @returns {Promise<array>}
         * 响应数据格式：
         * [{
         *   id: number,
         *   title: string,
         *   content: string,
         *   type: string,         // info/warning/success
         *   link: string,         // 链接（可选）
         *   createdAt: string
         * }]
         */
        getList(limit = 10) {
            return http.get('/announcements', { limit });
        },

        /**
         * 标记公告已读
         * @param {number} announcementId - 公告ID
         * @returns {Promise<object>}
         */
        markAsRead(announcementId) {
            return http.post(`/announcements/${announcementId}/read`);
        }
    },

    /**
     * 下载相关接口
     */
    download: {
        /**
         * 获取客户端下载链接
         * @param {string} platform - 平台名称：windows/macos/ios/android/linux/openwrt
         * @returns {Promise<object>}
         * 响应数据格式：
         * {
         *   platform: string,
         *   version: string,
         *   downloadUrl: string,
         *   fileSize: number,
         *   releaseDate: string
         * }
         */
        getClientUrl(platform) {
            return http.get(`/downloads/${platform}`);
        },

        /**
         * 获取所有平台下载链接
         * @returns {Promise<array>}
         */
        getAllClients() {
            return http.get('/downloads');
        }
    },

    /**
     * 认证相关接口
     */
    auth: {
        /**
         * 用户登录
         * @param {string} email 
         * @param {string} password 
         */
        async login(email, password) {
            // 模拟API调用延迟
            await new Promise(resolve => setTimeout(resolve, 800));

            // 模拟验证
            if (email === 'demo@example.com' && password === '123456') {
                return {
                    token: 'mock_jwt_token_' + Date.now(),
                    user: {
                        id: 1,
                        email: email,
                        name: 'Demo User'
                    }
                };
            } else if (email && password) {
                // 允许任意非空账号登录（演示用）
                return {
                    token: 'mock_jwt_token_' + Date.now(),
                    user: {
                        id: Math.floor(Math.random() * 1000),
                        email: email,
                        name: email.split('@')[0]
                    }
                };
            } else {
                throw new Error('邮箱或密码错误');
            }
        },

        /**
         * 用户注册
         * @param {string} email 
         * @param {string} password 
         */
        async register(email, password) {
            // 模拟API调用延迟
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 模拟注册成功
            return {
                success: true,
                message: '注册成功'
            };
        },

        /**
         * 退出登录
         */
        logout() {
            localStorage.removeItem('access_token');
            window.location.href = '/login.html';
        },

        /**
         * 发送重置密码验证码
         * @param {string} email 
         */
        async sendResetCode(email) {
            // 模拟API调用延迟
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 模拟发送成功
            console.log(`验证码已发送至 ${email}`);
            return {
                success: true,
                message: '验证码已发送'
            };
        },

        /**
         * 重置密码
         * @param {string} email 
         * @param {string} code 
         * @param {string} newPassword 
         */
        async resetPassword(email, code, newPassword) {
            // 模拟API调用延迟
            await new Promise(resolve => setTimeout(resolve, 1500));

            // 模拟验证码校验
            if (!code) {
                throw new Error('请输入验证码');
            }

            // 模拟重置成功
            return {
                success: true,
                message: '密码重置成功'
            };
        }
    },

    /**
     * 统计相关接口
     */
    stats: {
        /**
         * 获取使用统计
         * @param {string} period - 时间周期：day/week/month
         * @returns {Promise<object>}
         * 响应数据格式：
         * {
         *   traffic: array,       // 流量使用趋势
         *   bandwidth: array,     // 带宽使用趋势
         *   connections: array    // 连接数趋势
         * }
         */
        getUsage(period = 'week') {
            return http.get('/stats/usage', { period });
        }
    }
};

export default api;
