import { useState } from 'react';
import styles from './Announcement.module.css';

function Announcement({ announcements = [] }) {
    const [visible, setVisible] = useState(true);

    if (!visible || announcements.length === 0) return null;

    // 只显示最新的一条公告
    const latest = announcements[0];

    return (
        <div className={`${styles.announcement} ${styles[latest.type || 'info']}`}>
            <div className={styles.content}>
                <i className="fas fa-bullhorn"></i>
                <span>{latest.content}</span>
                {latest.link && (
                    <a href={latest.link} className={styles.link}>查看详情</a>
                )}
            </div>
            <button className={styles.closeBtn} onClick={() => setVisible(false)}>
                <i className="fas fa-times"></i>
            </button>
        </div>
    );
}

export default Announcement;
