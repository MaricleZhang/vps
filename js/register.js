/**
 * 注册页面逻辑
 */

import { api } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const submitBtn = registerForm.querySelector('button[type="submit"]');

    const sendCodeBtn = document.getElementById('send-code-btn');
    let countdown = 0;

    // 发送验证码
    sendCodeBtn.addEventListener('click', async () => {
        if (countdown > 0) return;

        const email = registerForm.querySelector('#email').value;
        if (!email) {
            alert('请先输入邮箱地址');
            return;
        }

        try {
            sendCodeBtn.disabled = true;
            sendCodeBtn.textContent = '发送中...';

            // 模拟发送验证码API
            await new Promise(resolve => setTimeout(resolve, 1000));

            alert('验证码已发送到您的邮箱（模拟：123456）');

            // 开始倒计时
            countdown = 60;
            sendCodeBtn.textContent = `${countdown}s`;
            const timer = setInterval(() => {
                countdown--;
                if (countdown <= 0) {
                    clearInterval(timer);
                    sendCodeBtn.disabled = false;
                    sendCodeBtn.textContent = '获取验证码';
                } else {
                    sendCodeBtn.textContent = `${countdown}s`;
                }
            }, 1000);

        } catch (error) {
            console.error('发送验证码失败:', error);
            alert('发送验证码失败，请重试');
            sendCodeBtn.disabled = false;
            sendCodeBtn.textContent = '获取验证码';
        }
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 获取表单数据
        const formData = new FormData(registerForm);
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirm-password');
        const verifyCode = formData.get('verify-code');
        const terms = formData.get('terms') === 'on';

        // 简单验证
        if (password !== confirmPassword) {
            alert('两次输入的密码不一致');
            return;
        }

        if (verifyCode !== '123456') {
            alert('验证码错误（模拟验证码为：123456）');
            return;
        }

        if (!terms) {
            alert('请同意服务条款');
            return;
        }

        try {
            // 设置加载状态
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 注册中...';

            // 调用注册接口
            const response = await api.auth.register(email, password);

            // 注册成功
            console.log('注册成功:', response);

            // 显示成功提示
            submitBtn.innerHTML = '<i class="fas fa-check"></i> 注册成功';
            submitBtn.classList.remove('btn-primary');
            submitBtn.classList.add('btn-success');

            // 延迟跳转到登录页
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);

        } catch (error) {
            console.error('注册失败:', error);

            // 显示错误提示
            alert(error.message || '注册失败，请稍后重试');

            // 恢复按钮状态
            submitBtn.disabled = false;
            submitBtn.innerHTML = '立即注册';
        }
    });
});
