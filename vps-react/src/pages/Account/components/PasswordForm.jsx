import { useState } from 'react';
import styles from '../Account.module.css';

function PasswordForm({ onChangePassword }) {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.newPassword !== formData.confirmPassword) {
            setError('两次输入的密码不一致');
            return;
        }

        if (formData.newPassword.length < 6) {
            setError('新密码长度不能少于6位');
            return;
        }

        setLoading(true);
        try {
            await onChangePassword(formData.oldPassword, formData.newPassword);
            setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            alert('密码修改成功');
        } catch (err) {
            setError(err.message || '修改失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.card}>
            <h3 className={styles.cardTitle}>修改密码</h3>
            <form onSubmit={handleSubmit} className={styles.form}>
                {error && <div style={{ color: 'var(--color-error)', fontSize: '0.875rem' }}>{error}</div>}

                <div className={styles.formGroup}>
                    <label>当前密码</label>
                    <input
                        type="password"
                        name="oldPassword"
                        value={formData.oldPassword}
                        onChange={handleChange}
                        placeholder="请输入当前密码"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>新密码</label>
                    <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="请输入新密码"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>确认新密码</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="请再次输入新密码"
                        required
                    />
                </div>

                <div className={styles.formActions}>
                    <button type="submit" className={styles.btnPrimary} disabled={loading}>
                        {loading ? '修改中...' : '确认修改'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PasswordForm;
