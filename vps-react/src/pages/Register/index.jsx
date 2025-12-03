import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/auth';
import styles from './Register.module.css';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [verifyCode, setVerifyCode] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(0);
    const navigate = useNavigate();

    // 发送验证码
    const handleSendCode = async () => {
        if (countdown > 0) return;

        if (!email) {
            setError('请先输入邮箱地址');
            return;
        }

        try {
            setError('');

            // 模拟发送验证码
            await new Promise(resolve => setTimeout(resolve, 800));

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

            // 显示提示（在实际应用中，验证码会发送到邮箱）
            alert('验证码已发送到您的邮箱（演示模式验证码：123456）');
        } catch (err) {
            setError('发送验证码失败，请重试');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // 表单验证
        if (!email || !password || !confirmPassword || !verifyCode) {
            setError('请填写所有必填字段');
            return;
        }

        if (password !== confirmPassword) {
            setError('两次输入的密码不一致');
            return;
        }

        // 密码复杂度验证：至少8位，包含字母和数字
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            setError('密码必须至少包含8个字符，且同时包含字母和数字');
            return;
        }

        // 验证码验证（演示模式）
        if (verifyCode !== '123456') {
            setError('验证码错误（演示模式验证码：123456）');
            return;
        }

        if (!agreedToTerms) {
            setError('请同意服务条款');
            return;
        }

        setLoading(true);
        try {
            await authService.register(email, password);

            // 注册成功，跳转到登录页
            alert('注册成功！请登录');
            navigate('/login');
        } catch (err) {
            setError(err.message || '注册失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.registerPage}>
            <div className={styles.registerContainer}>
                <div className={styles.registerCard}>
                    {/* Logo */}
                    <div className={styles.logo}>
                        <i className="fas fa-user-plus"></i>
                    </div>

                    {/* Title */}
                    <h1 className={styles.title}>创建账户</h1>
                    <p className={styles.subtitle}>加入 DiceCloud，开启您的云端之旅</p>

                    {/* Error Message */}
                    {error && (
                        <div className={styles.error}>
                            <i className="fas fa-exclamation-circle"></i>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Register Form */}
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
                            <label htmlFor="password">
                                <i className="fas fa-lock"></i>
                                密码
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="设置您的密码"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword">
                                <i className="fas fa-check-circle"></i>
                                确认密码
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="再次输入密码"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="verifyCode">
                                <i className="fas fa-shield-alt"></i>
                                验证码
                            </label>
                            <div className={styles.verifyCodeGroup}>
                                <input
                                    id="verifyCode"
                                    type="text"
                                    placeholder="验证码"
                                    value={verifyCode}
                                    onChange={(e) => setVerifyCode(e.target.value)}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className={styles.sendCodeBtn}
                                    onClick={handleSendCode}
                                    disabled={countdown > 0 || loading}
                                >
                                    {countdown > 0 ? `${countdown}s` : '获取验证码'}
                                </button>
                            </div>
                        </div>

                        <div className={styles.termsGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    disabled={loading}
                                />
                                <span>
                                    我已阅读并同意 <a href="#">服务条款</a>
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    注册中...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-user-plus"></i>
                                    立即注册
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Link */}
                    <div className={styles.footer}>
                        <a href="/login">
                            <i className="fas fa-sign-in-alt"></i>
                            已有账户？立即登录
                        </a>
                    </div>

                    {/* Demo Hint */}
                    <div className={styles.demoHint}>
                        <i className="fas fa-info-circle"></i>
                        演示模式: 验证码为 123456，密码需至少8位且包含字母和数字
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
