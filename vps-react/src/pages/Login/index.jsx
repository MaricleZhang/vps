import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/auth';
import styles from './Login.module.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('请输入邮箱和密码');
            return;
        }

        setLoading(true);
        try {
            const response = await authService.login(email, password);

            // 保存 token
            localStorage.setItem('access_token', response.token);
            localStorage.setItem('user_info', JSON.stringify(response.user));

            // 跳转到首页
            navigate('/');
        } catch (err) {
            setError(err.message || '登录失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginPage}>
            <div className={styles.loginContainer}>
                <div className={styles.loginCard}>
                    {/* Logo */}
                    <div className={styles.logo}>
                        <i className="fas fa-cloud"></i>
                    </div>

                    {/* Title */}
                    <h1 className={styles.title}>欢迎回来</h1>
                    <p className={styles.subtitle}>登录 DiceCloud VPS 管理平台</p>

                    {/* Error Message */}
                    {error && (
                        <div className={styles.error}>
                            <i className="fas fa-exclamation-circle"></i>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="email">
                                <i className="fas fa-envelope"></i>
                                邮箱地址
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="请输入邮箱"
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
                                placeholder="请输入密码"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                                    登录中...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-sign-in-alt"></i>
                                    登录
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className={styles.footer}>
                        <a href="/register">
                            <i className="fas fa-user-plus"></i>
                            注册账号
                        </a>
                        <a href="/forgot-password">
                            <i className="fas fa-key"></i>
                            忘记密码
                        </a>
                    </div>

                    {/* Demo Hint */}
                    <div className={styles.demoHint}>
                        <i className="fas fa-info-circle"></i>
                        演示模式: 输入任意邮箱和密码即可登录
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
