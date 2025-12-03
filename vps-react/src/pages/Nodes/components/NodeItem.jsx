import styles from './NodeItem.module.css';

function NodeItem({ node }) {
    const getLoadColor = (load) => {
        if (load < 50) return 'var(--color-success)';
        if (load < 80) return 'var(--color-warning)';
        return 'var(--color-error)';
    };

    const getPingColor = (ping) => {
        if (ping < 100) return 'var(--color-success)';
        if (ping < 200) return 'var(--color-warning)';
        return 'var(--color-error)';
    };

    return (
        <div className={styles.item}>
            <div className={styles.header}>
                <div className={styles.flag}>
                    {node.flag}
                </div>
                <div className={styles.info}>
                    <div className={styles.name}>{node.name}</div>
                    <div className={styles.tags}>
                        {node.tags && node.tags.map((tag, index) => (
                            <span key={index} className={styles.tag}>{tag}</span>
                        ))}
                    </div>
                </div>
                <div className={styles.status}>
                    <div className={`${styles.dot} ${node.online ? styles.online : styles.offline}`}></div>
                </div>
            </div>

            <div className={styles.metrics}>
                <div className={styles.metric}>
                    <div className={styles.metricLabel}>负载</div>
                    <div className={styles.metricValue} style={{ color: getLoadColor(node.load) }}>
                        {node.load}%
                    </div>
                </div>
                <div className={styles.metric}>
                    <div className={styles.metricLabel}>延迟</div>
                    <div className={styles.metricValue} style={{ color: getPingColor(node.ping) }}>
                        {node.ping}ms
                    </div>
                </div>
            </div>

            <div className={styles.loadBar}>
                <div
                    className={styles.loadFill}
                    style={{
                        width: `${node.load}%`,
                        backgroundColor: getLoadColor(node.load)
                    }}
                ></div>
            </div>
        </div>
    );
}

export default NodeItem;
