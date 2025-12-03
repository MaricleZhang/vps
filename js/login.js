/**
 * 登录页面逻辑
 */

import { api } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const submitBtn = loginForm.querySelector('button[type="submit"]');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 获取表单数据
        const formData = new FormData(loginForm);
        const email = formData.get('email');
        const password = formData.get('password');
        const remember = formData.get('remember') === 'on';

        try {
            // 设置加载状态
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 登录中...';

            // 调用登录接口
            const response = await api.auth.login(email, password);

            // 登录成功
            console.log('登录成功:', response);

            // 保存token (这里假设api.auth.login已经处理了token存储，或者在这里处理)
            // 如果api.auth.login返回了token，可以手动存储
            if (response.token) {
                localStorage.setItem('access_token', response.token);
            }

            // 显示成功提示
            submitBtn.innerHTML = '<i class="fas fa-check"></i> 登录成功';
            submitBtn.classList.remove('btn-primary');
            submitBtn.classList.add('btn-success');

            // 延迟跳转
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 800);

        } catch (error) {
            console.error('登录失败:', error);

            // 显示错误提示
            alert(error.message || '登录失败，请检查邮箱和密码');

            // 恢复按钮状态
            submitBtn.disabled = false;
            submitBtn.innerHTML = '登录';

            // 密码框震动效果
            const passwordInput = document.getElementById('password');
            passwordInput.parentElement.style.animation = 'shake 0.5s';
            setTimeout(() => {
                passwordInput.parentElement.style.animation = '';
            }, 500);

            passwordInput.value = '';
            passwordInput.focus();
        }
    });
});
