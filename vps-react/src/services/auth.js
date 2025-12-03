import api from './api';

/**
 * 认证服务
 */

export const authService = {
    /**
     * 用户登录
     */
    async login(email, password) {
        // 模拟 API 调用延迟
        await new Promise(resolve => setTimeout(resolve, 800));

        // 模拟验证
        if (email && password) {
            return {
                token: 'mock_jwt_token_' + Date.now(),
                user: {
                    id: Math.floor(Math.random() * 1000),
                    email: email,
                    name: email.split('@')[0],
                },
            };
        } else {
            throw new Error('邮箱或密码错误');
        }
    },

    /**
     * 用户注册
     */
    async register(email, password, inviteCode) {
        // 模拟 API 调用延迟
        await new Promise(resolve => setTimeout(resolve, 1000));

        return {
            success: true,
            message: '注册成功',
        };
    },

    /**
     * 发送重置密码验证码
     */
    async sendResetCode(email) {
        // 模拟 API 调用延迟
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log(`验证码已发送至 ${email}`);
        return {
            success: true,
            message: '验证码已发送',
        };
    },

    /**
     * 重置密码
     */
    async resetPassword(email, code, newPassword) {
        // 模拟 API 调用延迟
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (!code) {
            throw new Error('请输入验证码');
        }

        return {
            success: true,
            message: '密码重置成功',
        };
    },
};

export default authService;
