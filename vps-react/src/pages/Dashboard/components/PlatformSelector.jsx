import { CLIENT_PLATFORMS } from '@/utils/constants';
import styles from './PlatformSelector.module.css';

function PlatformSelector() {
    const handleDownload = (url) => {
        window.open(url, '_blank');
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>
                <i className="fas fa-desktop" style={{ color: 'var(--primary-color)' }}></i>
                快速入口
            </h3>
            <div className={styles.grid}>
                {CLIENT_PLATFORMS.map(platform => (
                    <button
                        key={platform.id}
                        className={styles.platformBtn}
                        onClick={() => handleDownload(platform.downloadUrl)}
                    >
                        <div className={styles.iconWrapper}>
                            <i className={`fab ${platform.icon}`}></i>
                        </div>
                        <span className={styles.label}>{platform.name}</span>
                        <i className={`fas fa-download ${styles.downloadIcon}`}></i>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default PlatformSelector;
