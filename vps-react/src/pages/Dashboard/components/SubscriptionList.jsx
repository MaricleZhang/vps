import { useNavigate } from 'react-router-dom';
import { formatBytes, timeFromNow } from '@/utils/format';
import styles from './SubscriptionList.module.css';

function SubscriptionList({ subscriptions = [] }) {
    const navigate = useNavigate();

    if (subscriptions.length === 0) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                    <i className="fas fa-box-open"></i>
                </div>
                <p>暂无有效订阅</p>
                <button
                    className={styles.buyBtn}
                    onClick={() => navigate('/shop')}
                >
                    购买订阅
                </button>
            </div>
        );
    }

    return (
        <div className={styles.list}>
            {subscriptions.map(sub => (
                <div key={sub.id} className={styles.item}>
                    <div className={styles.itemHeader}>
                        <div className={styles.itemName}>{sub.name}</div>
                        <div className={`${styles.status} ${styles[sub.status]}`}>
                            {sub.status === 'active' ? '使用中' : '已过期'}
                        </div>
                    </div>

                    <div className={styles.itemDetails}>
                        <div className={styles.detail}>
                            <i className="fas fa-database"></i>
                            <span>{formatBytes(sub.traffic)}</span>
                        </div>
                        <div className={styles.detail}>
                            <i className="fas fa-clock"></i>
                            <span>{timeFromNow(sub.expireDate)}</span>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button
                            className={styles.actionBtn}
                            onClick={() => navigate(`/shop?renew=${sub.id}`)}
                        >
                            续费
                        </button>
                        <button className={`${styles.actionBtn} ${styles.secondary}`}>
                            管理
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default SubscriptionList;
