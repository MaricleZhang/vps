import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileForm from './components/ProfileForm';
import PasswordForm from './components/PasswordForm';
import styles from './Account.module.css';

function Account() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 模拟获取用户信息
        const fetchUser = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 500));

            const storedUser = localStorage.getItem('user_info');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                // Fallback mock data
                setUser({
                    email: 'user@example.com',
                    name: 'Demo User',
                    balance: 0.00,
                    currency: 'CNY'
                });
            }
            setLoading(false);
        };

        fetchUser();
    }, []);

    const handleUpdateProfile = async (data) => {
        // 模拟 API 调用
        await new Promise(resolve => setTimeout(resolve, 1000));

        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('user_info', JSON.stringify(updatedUser));
        alert('个人信息已更新');
    };

    const handleChangePassword = async (oldPassword, newPassword) => {
        // 模拟 API 调用
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (oldPassword === 'wrong') {
            throw new Error('当前密码错误');
        }
        // Success
    };

    const handleLogout = () => {
        if (window.confirm('确定要退出登录吗？')) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_info');
            navigate('/login');
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                <i className="fas fa-spinner fa-spin fa-2x" style={{ color: 'var(--text-secondary)' }}></i>
            </div>
        );
    }

    return (
        <div className={styles.accountPage}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    <i className="fas fa-user-cog" style={{ color: 'var(--primary-color)' }}></i>
                    个人中心
                </h1>
                <p className={styles.subtitle}>
                    管理您的个人信息和账户安全设置
                </p>
            </div>

            <div className={styles.grid}>
                <div className={styles.column}>
                    <ProfileForm user={user} onUpdate={handleUpdateProfile} />

                    {/* Balance Card */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>账户余额</h2>
                            <button className={styles.btnSm}>
                                <i className="fas fa-plus"></i> 充值
                            </button>
                        </div>
                        <div className={styles.balanceContent}>
                            <div className={styles.balanceLabel}>当前余额</div>
                            <div className={styles.balanceValue}>
                                {user.balance?.toFixed(2) || '0.00'} <span className={styles.currency}>{user.currency || 'CNY'}</span>
                            </div>
                            <div className={styles.balanceActions}>
                                <button className={styles.btnSecondary}>
                                    <i className="fas fa-history"></i> 交易记录
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.column}>
                    <PasswordForm onChangePassword={handleChangePassword} />

                    {/* Logout Card */}
                    <div className={styles.card}>
                        <button className={styles.logoutBtn} onClick={handleLogout}>
                            <i className="fas fa-sign-out-alt"></i> 退出登录
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Account;
