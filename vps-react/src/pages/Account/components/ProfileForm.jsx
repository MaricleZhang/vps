import { useState } from 'react';
import styles from '../Account.module.css';

function ProfileForm({ user, onUpdate }) {
    const [name, setName] = useState(user.name || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onUpdate({ name });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.card}>
            <h3 className={styles.cardTitle}>基本信息</h3>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label>邮箱地址</label>
                    <input
                        type="email"
                        value={user.email}
                        disabled
                        className={styles.inputDisabled}
                    />
                    <span className={styles.hint}>邮箱地址不可修改</span>
                </div>

                <div className={styles.formGroup}>
                    <label>显示名称</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="请输入您的昵称"
                    />
                </div>

                <div className={styles.formActions}>
                    <button type="submit" className={styles.btnPrimary} disabled={loading}>
                        {loading ? '保存中...' : '保存修改'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ProfileForm;
