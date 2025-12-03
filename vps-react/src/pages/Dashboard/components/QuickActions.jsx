import { copyToClipboard } from '@/utils/format';
import styles from './QuickActions.module.css';

function QuickActions() {
    const actions = [
        { id: 'shadowrocket', name: 'Shadowrocket 订阅', icon: 'fa-rocket', color: '#667eea' },
        { id: 'stash', name: 'Stash 订阅', icon: 'fa-bolt', color: '#f59e0b' },
        { id: 'clash', name: 'Clash 订阅', icon: 'fa-cat', color: '#3b82f6' },
    ];

    const handleCopy = async (name) => {
        // 模拟订阅链接
        const link = `https://example.com/subscribe?token=mock_token_${Date.now()}`;
        const success = await copyToClipboard(link);
        if (success) {
            // toast(`已复制 ${name} 链接`);
            console.log(`已复制 ${name} 链接`);
        } else {
            // toast('复制失败');
            console.error('复制失败');
        }
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>
                <i className="fas fa-bolt" style={{ color: 'var(--primary-color)' }}></i>
                快捷订阅
            </h3>
            <div className={styles.grid}>
                {actions.map(action => (
                    <button
                        key={action.id}
                        className={styles.actionBtn}
                        onClick={() => handleCopy(action.name)}
                    >
                        <div className={styles.iconWrapper} style={{ background: `${action.color}20`, color: action.color }}>
                            <i className={`fas ${action.icon}`}></i>
                        </div>
                        <span className={styles.label}>{action.name}</span>
                        <i className={`fas fa-copy ${styles.copyIcon}`}></i>
                    </button>
                ))}

                <button
                    className={styles.actionBtn}
                    onClick={() => handleCopy('通用订阅')}
                >
                    <div className={styles.iconWrapper} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                        <i className="fas fa-link"></i>
                    </div>
                    <span className={styles.label}>一键复制订阅链接</span>
                    <i className={`fas fa-copy ${styles.copyIcon}`}></i>
                </button>
            </div>
        </div>
    );
}

export default QuickActions;
