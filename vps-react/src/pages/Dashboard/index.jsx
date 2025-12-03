import { useState, useEffect } from 'react';
import api from '@/services/api';
import StatsCards from './components/StatsCards';
import Announcement from './components/Announcement';
import SubscriptionList from './components/SubscriptionList';
import QuickActions from './components/QuickActions';
import PlatformSelector from './components/PlatformSelector';
import styles from './Dashboard.module.css';

function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        stats: null,
        announcements: [],
        subscriptions: [],
    });
    const [activeTab, setActiveTab] = useState('my-subscriptions');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // 并行请求数据
                // 注意：这里使用 mock 数据，因为后端 API 尚未完全就绪
                // 实际开发中应使用 Promise.all([api.account.getStats(), ...])

                // 模拟延迟
                await new Promise(resolve => setTimeout(resolve, 800));

                setData({
                    stats: {
                        balance: 120.50,
                        traffic: { used: 35 * 1024 * 1024 * 1024, total: 100 * 1024 * 1024 * 1024 },
                        expireDate: '2025-12-31',
                        daysRemaining: 25
                    },
                    announcements: [
                        { id: 1, content: '系统维护通知：将于今晚凌晨进行节点升级', type: 'warning' }
                    ],
                    subscriptions: [
                        {
                            id: 1,
                            name: '高级版月付',
                            status: 'active',
                            traffic: 100 * 1024 * 1024 * 1024,
                            expireDate: '2025-12-31'
                        }
                    ]
                });
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className={styles.loading}>
                <i className="fas fa-spinner fa-spin"></i>
                <span>加载中...</span>
            </div>
        );
    }

    return (
        <div className={styles.dashboard}>
            {/* 公告栏 */}
            <Announcement announcements={data.announcements} />

            {/* 统计卡片 */}
            <StatsCards stats={data.stats} />

            {/* 订阅管理 */}
            <div className={styles.section}>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'my-subscriptions' ? styles.active : ''}`}
                        onClick={() => setActiveTab('my-subscriptions')}
                    >
                        我的订阅
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'quick-subscribe' ? styles.active : ''}`}
                        onClick={() => setActiveTab('quick-subscribe')}
                    >
                        快捷订阅
                    </button>
                </div>

                <div className={styles.tabContent}>
                    {activeTab === 'my-subscriptions' ? (
                        <SubscriptionList subscriptions={data.subscriptions} />
                    ) : (
                        <QuickActions />
                    )}
                </div>
            </div>

            {/* 快捷操作 (如果不在 Tab 中显示) */}
            {activeTab !== 'quick-subscribe' && (
                <div className={styles.section}>
                    <QuickActions />
                </div>
            )}

            {/* 平台选择 */}
            <div className={styles.section}>
                <PlatformSelector />
            </div>

            {/* 流量走势图 (占位) */}
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                    <i className="fas fa-chart-area" style={{ color: 'var(--primary-color)' }}></i>
                    流量走势
                </h3>
                <div className={styles.chartPlaceholder}>
                    <p>流量走势图表开发中...</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
