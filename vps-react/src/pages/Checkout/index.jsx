import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SUBSCRIPTION_PLANS } from '@/utils/constants';
import styles from './Checkout.module.css';

function Checkout() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const planId = searchParams.get('plan');

    const [selectedPlan, setSelectedPlan] = useState(null);
    const [username, setUsername] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('alipay');
    const [loading, setLoading] = useState(false);
    const [couponMessage, setCouponMessage] = useState(null);

    useEffect(() => {
        if (planId) {
            const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
            if (plan) {
                setSelectedPlan(plan);
            } else {
                alert('无效的套餐ID');
                navigate('/shop');
            }
        } else {
            navigate('/shop');
        }
    }, [planId, navigate]);

    const handleApplyCoupon = () => {
        if (!couponCode.trim()) {
            setCouponMessage({ type: 'error', text: '请输入优惠码' });
            return;
        }

        // Mock coupon validation
        const validCoupons = {
            'WELCOME10': 0.1, // 10% off
            'VIP20': 0.2,     // 20% off
            'SPECIAL50': 0.5  // 50% off
        };

        const code = couponCode.trim().toUpperCase();
        if (validCoupons[code]) {
            setDiscount(validCoupons[code]);
            setCouponMessage({ type: 'success', text: `优惠码已应用，享受 ${validCoupons[code] * 100}% 折扣` });
        } else {
            setDiscount(0);
            setCouponMessage({ type: 'error', text: '优惠码无效' });
        }
    };

    const calculateTotal = () => {
        if (!selectedPlan) return '0.00';
        const originalPrice = selectedPlan.price;
        const finalPrice = originalPrice * (1 - discount);
        return finalPrice.toFixed(2);
    };

    const handlePurchase = async () => {
        if (!username.trim()) {
            alert('请输入用户名');
            return;
        }

        setLoading(true);
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);

        alert(`订单创建成功！\n\n套餐: ${selectedPlan.name}\n金额: ¥${calculateTotal()}\n支付方式: ${paymentMethod === 'alipay' ? '支付宝' : '微信支付'}`);
        navigate('/');
    };

    if (!selectedPlan) return null;

    return (
        <div className={styles.checkoutPage}>
            <div className={styles.header}>
                <button className={styles.backBtn} onClick={() => navigate('/shop')}>
                    <i className="fas fa-arrow-left"></i> 返回选择套餐
                </button>
                <h1 className={styles.title}>
                    <i className="fas fa-shopping-cart" style={{ color: 'var(--primary-color)' }}></i>
                    确认订单
                </h1>
            </div>

            <div className={styles.grid}>
                <div className={styles.formSection}>
                    {/* User Info */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>
                            <i className="fas fa-user" style={{ color: 'var(--primary-color)' }}></i>
                            用户信息
                        </h3>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                用户名/用户ID <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="请输入您的用户名或用户ID"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <p className={styles.hint}>请确保用户信息正确，订阅将添加到此账户</p>
                        </div>
                    </div>

                    {/* Coupon */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>
                            <i className="fas fa-ticket-alt" style={{ color: 'var(--primary-color)' }}></i>
                            优惠码（可选）
                        </h3>
                        <div className={styles.couponInputGroup}>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="请输入优惠码"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                            />
                            <button className={styles.applyBtn} onClick={handleApplyCoupon}>
                                <i className="fas fa-check"></i> 应用
                            </button>
                        </div>
                        {couponMessage && (
                            <p className={`${styles.message} ${styles[couponMessage.type]}`}>
                                {couponMessage.type === 'error' ? <i className="fas fa-times-circle"></i> : <i className="fas fa-check-circle"></i>}
                                {couponMessage.text}
                            </p>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>
                            <i className="fas fa-credit-card" style={{ color: 'var(--primary-color)' }}></i>
                            支付方式
                        </h3>
                        <div className={styles.paymentMethods}>
                            <div
                                className={`${styles.paymentMethod} ${paymentMethod === 'alipay' ? styles.active : ''}`}
                                onClick={() => setPaymentMethod('alipay')}
                            >
                                <i className="fab fa-alipay" style={{ color: '#1677ff', fontSize: '1.5rem' }}></i>
                                <span>支付宝</span>
                            </div>
                            <div
                                className={`${styles.paymentMethod} ${paymentMethod === 'wechat' ? styles.active : ''}`}
                                onClick={() => setPaymentMethod('wechat')}
                            >
                                <i className="fab fa-weixin" style={{ color: '#07c160', fontSize: '1.5rem' }}></i>
                                <span>微信支付</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.summarySection}>
                    <div className={`${styles.card} ${styles.sticky}`}>
                        <h3 className={styles.cardTitle}>订单摘要</h3>
                        <div className={styles.planPreview}>
                            <div className={styles.planName}>{selectedPlan.name}</div>
                            <div className={styles.planDetail}>{selectedPlan.traffic} | {selectedPlan.speed}</div>
                            <div className={styles.planPeriod}>{selectedPlan.period}</div>
                        </div>

                        <div className={styles.summaryRow}>
                            <span>商品总价</span>
                            <span>¥{selectedPlan.price.toFixed(2)}</span>
                        </div>
                        {discount > 0 && (
                            <div className={`${styles.summaryRow} ${styles.discount}`}>
                                <span>优惠减免</span>
                                <span>-¥{(selectedPlan.price * discount).toFixed(2)}</span>
                            </div>
                        )}
                        <div className={styles.divider}></div>
                        <div className={`${styles.summaryRow} ${styles.total}`}>
                            <span>应付总额</span>
                            <span className={styles.totalPrice}>¥{calculateTotal()}</span>
                        </div>

                        <button
                            className={styles.purchaseBtn}
                            disabled={!username || loading}
                            onClick={handlePurchase}
                        >
                            {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-check-circle"></i>}
                            {loading ? ' 处理中...' : ' 立即支付'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
