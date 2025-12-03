import { useNavigate } from 'react-router-dom';
import { SUBSCRIPTION_PLANS } from '@/utils/constants';
import PlanCard from './components/PlanCard';
import styles from './Shop.module.css';

function Shop() {
    const navigate = useNavigate();

    const handleSelectPlan = (plan) => {
        // 导航到结账页面，并传递套餐ID
        navigate(`/checkout?plan=${plan.id}`);
    };

    return (
        <div className={styles.shop}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    <i className="fas fa-shopping-cart" style={{ color: 'var(--primary-color)' }}></i>
                    购买订阅
                </h1>
                <p className={styles.subtitle}>选择适合您的套餐，享受高速稳定的VPS服务</p>
            </div>

            <div className={styles.grid}>
                {SUBSCRIPTION_PLANS.map(plan => (
                    <PlanCard
                        key={plan.id}
                        plan={plan}
                        onSelect={handleSelectPlan}
                    />
                ))}
            </div>
        </div>
    );
}

export default Shop;
