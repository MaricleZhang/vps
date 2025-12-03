/**
 * 找回密码页面逻辑
 */

import { api } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const forgetForm = document.getElementById('forget-form');
    const sendCodeBtn = document.getElementById('send-code-btn');
    const submitBtn = forgetForm.querySelector('button[type="submit"]');
    const emailInput = document.getElementById('email');

    // 发送验证码倒计时
    let countdown = 0;
    let timer = null;

    // 发送验证码
    sendCodeBtn.addEventListener('click', async () => {
        if (countdown > 0) return;

        const email = emailInput.value.trim();
        if (!email) {
            alert('请先输入电子邮箱');
            emailInput.focus();
            return;
        }

        // 简单的邮箱格式验证
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('请输入有效的电子邮箱地址');
            emailInput.focus();
            return;
        }

        try {
            sendCodeBtn.disabled = true;
            sendCodeBtn.textContent = '发送中...';

            await api.auth.sendResetCode(email);

            alert('验证码已发送，请查收邮件');
            startCountdown();

        } catch (error) {
            console.error('发送验证码失败:', error);
            alert(error.message || '发送验证码失败，请稍后重试');
            sendCodeBtn.disabled = false;
            sendCodeBtn.textContent = '发送验证码';
        }
    });

    // 开始倒计时
    function startCountdown() {
        countdown = 60;
        sendCodeBtn.disabled = true;
        sendCodeBtn.textContent = `${countdown}s 后重发`;

        timer = setInterval(() => {
            countdown--;
            if (countdown <= 0) {
                clearInterval(timer);
                sendCodeBtn.disabled = false;
                sendCodeBtn.textContent = '发送验证码';
            } else {
                sendCodeBtn.textContent = `${countdown}s 后重发`;
            }
        }, 1000);
    }

    // 表单提交
    forgetForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(forgetForm);
        const email = formData.get('email');
        const code = formData.get('code');
        const newPassword = formData.get('newPassword');
        const confirmPassword = formData.get('confirmPassword');

        if (newPassword !== confirmPassword) {
            alert('两次输入的密码不一致');
            return;
        }

        // 密码复杂度验证：至少8位，包含字母和数字
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            alert('密码必须至少包含8个字符，且同时包含字母和数字');
            return;
        }

        try {
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 重置中...';

            await api.auth.resetPassword(email, code, newPassword);

            submitBtn.innerHTML = '<i class="fas fa-check"></i> 重置成功';
            submitBtn.classList.remove('btn-primary');
            submitBtn.classList.add('btn-success');

            alert('密码重置成功，请使用新密码登录');

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);

        } catch (error) {
            console.error('重置密码失败:', error);
            alert(error.message || '重置密码失败，请检查验证码是否正确');

            submitBtn.disabled = false;
            submitBtn.innerHTML = '重置密码';
        }
    });
});
