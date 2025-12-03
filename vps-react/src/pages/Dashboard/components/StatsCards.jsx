import { formatCurrency, formatBytes, formatPercentage, timeFromNow } from '@/utils/format';
import styles from './StatsCards.module.css';

function StatsCards({ stats }) {
    if (!stats) return null;

    const { balance, traffic, expireDate, daysRemaining } = stats;
    const trafficPercent = (traffic.used / traffic.total) * 100;

    return (
        <div className={styles.grid}>
            {/* 余额卡片 */}
            <div className={styles.card}>
                <div className={styles.label}>
                    <i className="fas fa-wallet"></i>
                    账户余额
                </div>
                <div className={styles.value}>
                    {formatCurrency(balance || 0)}
                </div>
                <div className={styles.description}>
                    上次充值 <span className={styles.highlight}>100%</span>
                </div>
            </div>

            {/* 流量卡片 */}
            <div className={styles.card}>
                <div className={styles.label}>
                    <i className="fas fa-chart-line"></i>
                    可用流量
                </div>
                <div className={styles.value}>
                    <span className={styles.subValue}>{formatBytes(traffic.used)}</span>
                    <span className={styles.separator}>/</span>
                    <span className={styles.subValue}>{formatBytes(traffic.total)}</span>
                </div>
                <div className={styles.description}>
                    已使用 <span className={styles.highlight}>{formatPercentage(traffic.used, traffic.total)}</span>
                </div>
                <div className={styles.progress}>
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${Math.min(trafficPercent, 100)}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* 过期时间卡片 */}
            <div className={styles.card}>
                <div className={styles.label}>
                    <i className="fas fa-clock"></i>
                    过期时间
                </div>
                <div className={styles.value}>
                    {expireDate || '未订阅'}
                </div>
                <div className={styles.description}>
                    剩余 <span className={styles.highlight}>{daysRemaining}天</span> ·
                    已续费 <span className={styles.highlight}>100%</span>
                </div>
            </div>
        </div>
    );
}

export default StatsCards;
