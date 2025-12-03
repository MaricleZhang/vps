import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Topbar.module.css';

function Topbar({ onMenuToggle }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userInfo = localStorage.getItem('user_info');
        if (userInfo) {
            try {
                setUser(JSON.parse(userInfo));
            } catch (e) {
                console.error('Failed to parse user info', e);
            }
        }
    }, []);

    const handleLogout = () => {
        if (window.confirm('确定要退出登录吗？')) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_info');
            navigate('/login');
        }
    };

    return (
        <header className={styles.topbar}>
            <div className={styles.topbarLeft}>
                {/* 移动端菜单按钮 */}
                <button className={styles.mobileMenuToggle} onClick={onMenuToggle}>
                    <i className="fas fa-bars"></i>
                </button>
            </div>

            <div className={styles.topbarRight}>
                {/* 下载客户端按钮 */}
                <button
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    onClick={() => window.open('https://github.com/shadowsocks/shadowsocks-windows/releases', '_blank')}
                >
                    <i className="fas fa-download"></i>
                    <span className={styles.btnText}>下载客户端</span>
                </button>

                {/* 续费订阅按钮 */}
                <button
                    className={`${styles.btn} ${styles.btnSuccess}`}
                    onClick={() => navigate('/shop')}
                >
                    <i className="fas fa-redo"></i>
                    <span className={styles.btnText}>续费订阅</span>
                </button>

                {/* 用户信息 */}
                {user && (
                    <div className={styles.userInfo} onClick={() => navigate('/account')}>
                        <div className={styles.userAvatar}>
                            {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span className={styles.userName}>{user.name || user.email}</span>
                    </div>
                )}

                {/* 退出按钮 (仅移动端或作为补充) */}
                <button className={styles.logoutBtn} onClick={handleLogout} title="退出登录">
                    <i className="fas fa-sign-out-alt"></i>
                </button>
            </div>
        </header>
    );
}

export default Topbar;
