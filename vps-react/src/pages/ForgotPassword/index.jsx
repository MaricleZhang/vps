import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/auth';
import styles from './ForgotPassword.module.css';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(0);
    const navigate = useNavigate();

    // 发送验证码
    const handleSendCode = async () => {
        if (countdown > 0) return;

        if (!email) {
            setError('请先输入电子邮箱');
            return;
        }

        // 邮箱格式验证
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('请输入有效的电子邮箱地址');
            return;
        }

        try {
            setError('');

            // 调用发送验证码API
            await authService.sendResetCode(email);

            // 开始倒计时
            setCountdown(60);
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            // 显示提示
            alert('验证码已发送到您的邮箱');
        } catch (err) {
            setError(err.message || '发送验证码失败，请稍后重试');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // 表单验证
        if (!email || !code || !newPassword || !confirmPassword) {
            setError('请填写所有必填字段');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('两次输入的密码不一致');
            return;
        }

        // 密码复杂度验证：至少8位，包含字母和数字
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            setError('密码必须至少包含8个字符，且同时包含字母和数字');
            return;
        }

        setLoading(true);
        try {
            await authService.resetPassword(email, code, newPassword);

            // 重置成功
            alert('密码重置成功，请使用新密码登录');
            navigate('/login');
        } catch (err) {
            setError(err.message || '重置密码失败，请检查验证码是否正确');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.forgotPasswordPage}>
            <div className={styles.forgotPasswordContainer}>
                <div className={styles.forgotPasswordCard}>
                    {/* Logo */}
                    <div className={styles.logo}>
                        <i className="fas fa-key"></i>
                    </div>

                    {/* Title */}
                    <h1 className={styles.title}>找回密码</h1>
                    <p className={styles.subtitle}>验证您的邮箱以重置密码</p>

                    {/* Error Message */}
                    {error && (
                        <div className={styles.error}>
                            <i className="fas fa-exclamation-circle"></i>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Forgot Password Form */}
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="email">
                                <i className="fas fa-envelope"></i>
                                电子邮箱
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                autoFocus
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="code">
                                <i className="fas fa-shield-alt"></i>
                                验证码
                            </label>
                            <div className={styles.verifyCodeGroup}>
                                <input
                                    id="code"
                                    type="text"
                                    placeholder="请输入验证码"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className={styles.sendCodeBtn}
                                    onClick={handleSendCode}
                                    disabled={countdown > 0 || loading}
                                >
                                    {countdown > 0 ? `${countdown}s 后重发` : '发送验证码'}
                                </button>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="newPassword">
                                <i className="fas fa-lock"></i>
                                新密码
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                placeholder="请输入新密码"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword">
                                <i className="fas fa-lock"></i>
                                确认新密码
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="请再次输入新密码"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    重置中...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-redo"></i>
                                    重置密码
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Link */}
                    <div className={styles.footer}>
                        <a href="/login">
                            <i className="fas fa-arrow-left"></i>
                            返回登录
                        </a>
                    </div>

                    {/* Demo Hint */}
                    <div className={styles.demoHint}>
                        <i className="fas fa-info-circle"></i>
                        演示模式: 输入任意邮箱和验证码即可重置密码
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
