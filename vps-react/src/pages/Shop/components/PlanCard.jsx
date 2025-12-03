import styles from './PlanCard.module.css';

function PlanCard({ plan, onSelect }) {
    return (
        <div className={`${styles.card} ${plan.popular ? styles.popular : ''}`}>
            {plan.popular && (
                <div className={styles.badge}>
                    <i className="fas fa-star"></i> 最受欢迎
                </div>
            )}

            <div className={styles.header}>
                <div className={styles.name}>{plan.name}</div>
                <div className={styles.period}>{plan.period}</div>
            </div>

            <div className={styles.pricing}>
                <div className={styles.price}>
                    <span className={styles.symbol}>¥</span>
                    <span className={styles.amount}>{plan.price}</span>
                    <span className={styles.unit}>/期</span>
                </div>
                {plan.originalPrice && (
                    <div className={styles.originalPrice}>原价 ¥{plan.originalPrice}</div>
                )}
            </div>

            <div className={styles.features}>
                <div className={styles.feature}>
                    <i className="fas fa-check-circle"></i>
                    <span>{plan.traffic}</span>
                </div>
                <div className={styles.feature}>
                    <i className="fas fa-check-circle"></i>
                    <span>{plan.speed}</span>
                </div>
                <div className={styles.feature}>
                    <i className="fas fa-check-circle"></i>
                    <span>{plan.devices}</span>
                </div>
                <div className={styles.feature}>
                    <i className="fas fa-check-circle"></i>
                    <span>{plan.nodes}</span>
                </div>
            </div>

            <button
                className={styles.selectBtn}
                onClick={() => onSelect(plan)}
            >
                <i className="fas fa-shopping-cart"></i>
                立即购买
            </button>
        </div>
    );
}

export default PlanCard;
