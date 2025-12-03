import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';

function Sidebar({ isOpen, onClose }) {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        {
            title: '概览',
            items: [
                { icon: 'fa-home', label: '首页', path: '/' }
            ]
        },
        {
            title: '服务',
            items: [
                { icon: 'fa-book', label: '使用文档', path: '/docs' },
                { icon: 'fa-shopping-cart', label: '购买订阅', path: '/shop', badge: 'NEW' },
                { icon: 'fa-server', label: '节点优选', path: '/nodes' }
            ]
        },
        {
            title: '用户',
            items: [
                { icon: 'fa-user', label: '个人中心', path: '/account' },
                { icon: 'fa-receipt', label: '我的订单', path: '/orders' }
            ]
        }
    ];

    const handleNavigation = (path) => {
        navigate(path);
        if (window.innerWidth <= 768 && onClose) {
            onClose();
        }
    };

    return (
        <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
            {/* Logo区域 */}
            <div className={styles.sidebarHeader}>
                <div className={styles.sidebarLogo}>
                    <i className="fas fa-cloud"></i>
                </div>
                <div className={styles.sidebarTitle}>DiceCloud</div>
            </div>

            {/* 导航菜单 */}
            <nav className={styles.sidebarNav}>
                {menuItems.map((section, index) => (
                    <div key={index} className={styles.navSection}>
                        <div className={styles.navSectionTitle}>{section.title}</div>
                        {section.items.map((item, itemIndex) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <div
                                    key={itemIndex}
                                    className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                                    onClick={() => handleNavigation(item.path)}
                                >
                                    <div className={styles.navItemIcon}>
                                        <i className={`fas ${item.icon}`}></i>
                                    </div>
                                    <span>{item.label}</span>
                                    {item.badge && (
                                        <span className={styles.navItemBadge}>{item.badge}</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </nav>
        </aside>
    );
}

export default Sidebar;
