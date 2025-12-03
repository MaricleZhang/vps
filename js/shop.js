/**
 * VPS管理平台 - 购买订阅页面
 * 处理套餐选择、用户输入、优惠码和支付
 */

import { dom } from './utils.js';

/**
 * 订阅计划数据
 */
const subscriptionPlans = [
    {
        id: 'basic-monthly',
        name: '基础版',
        period: '月付',
        price: 29.9,
        originalPrice: 39.9,
        traffic: '100GB',
        speed: '100Mbps',
        devices: '3台设备',
        nodes: '10+节点',
        popular: false,
        color: 'primary'
    },
    {
        id: 'standard-monthly',
        name: '标准版',
        period: '月付',
        price: 49.9,
        originalPrice: 69.9,
        traffic: '300GB',
        speed: '200Mbps',
        devices: '5台设备',
        nodes: '20+节点',
        popular: true,
        color: 'success'
    },
    {
        id: 'premium-monthly',
        name: '高级版',
        period: '月付',
        price: 99.9,
        originalPrice: 129.9,
        traffic: '不限流量',
        speed: '500Mbps',
        devices: '10台设备',
        nodes: '50+节点',
        popular: false,
        color: 'purple'
    },
    {
        id: 'basic-quarterly',
        name: '基础版',
        period: '季付',
        price: 79.9,
        originalPrice: 119.7,
        traffic: '100GB/月',
        speed: '100Mbps',
        devices: '3台设备',
        nodes: '10+节点',
        popular: false,
        color: 'primary'
    },
    {
        id: 'standard-quarterly',
        name: '标准版',
        period: '季付',
        price: 139.9,
        originalPrice: 209.7,
        traffic: '300GB/月',
        speed: '200Mbps',
        devices: '5台设备',
        nodes: '20+节点',
        popular: false,
        color: 'success'
    },
    {
        id: 'premium-quarterly',
        name: '高级版',
        period: '季付',
        price: 279.9,
        originalPrice: 389.7,
        traffic: '不限流量',
        speed: '500Mbps',
        devices: '10台设备',
        nodes: '50+节点',
        popular: false,
        color: 'purple'
    }
];

/**
 * 购买订阅模块
 */
class ShopManager {
    constructor() {
        this.selectedPlan = null;
        this.couponCode = '';
        this.discountAmount = 0;
        this.paymentMethod = 'alipay';
        this.username = '';
    }

    /**
     * 初始化购买页面
     */
    async init() {
        console.log('📦 初始化购买订阅页面...');
        this.render();
        this.bindEvents();
    }

    /**
     * 渲染页面
     */
    render() {
        const content = dom.$('.content');
        if (!content) return;

        content.innerHTML = `
      <div class="shop-container">
        <!-- 页面标题 -->
        <div class="mb-xl">
          <h2 class="text-xl font-semibold mb-sm">
            <i class="fas fa-shopping-cart" style="color: var(--primary-color);"></i>
            购买订阅
          </h2>
          <p class="text-secondary">选择适合您的套餐，享受高速稳定的VPS服务</p>
        </div>

        <!-- 套餐选择 -->
        <div class="mb-xl">
          <h3 class="text-lg font-semibold mb-md">
            <i class="fas fa-box-open" style="color: var(--primary-color);"></i>
            选择套餐
          </h3>
          <div class="subscription-plans-grid">
            ${this.renderPlans()}
          </div>
        </div>

        <!-- 用户信息 -->
        <div class="mb-xl">
          <h3 class="text-lg font-semibold mb-md">
            <i class="fas fa-user" style="color: var(--primary-color);"></i>
            用户信息
          </h3>
          <div class="card">
            <div class="form-group mb-md">
              <label class="form-label">
                用户名/用户ID
                <span class="text-error">*</span>
              </label>
              <input 
                type="text" 
                class="form-input" 
                id="username-input" 
                placeholder="请输入您的用户名或用户ID"
              />
              <p class="form-hint">请确保用户信息正确，订阅将添加到此账户</p>
            </div>
          </div>
        </div>

        <!-- 优惠码 -->
        <div class="mb-xl">
          <h3 class="text-lg font-semibold mb-md">
            <i class="fas fa-ticket-alt" style="color: var(--primary-color);"></i>
            优惠码（可选）
          </h3>
          <div class="card">
            <div class="flex gap-md">
              <input 
                type="text" 
                class="form-input" 
                id="coupon-input" 
                placeholder="请输入优惠码"
                style="flex: 1;"
              />
              <button class="btn btn-secondary" id="apply-coupon-btn">
                <i class="fas fa-check"></i>
                应用
              </button>
            </div>
            <div id="coupon-message" class="mt-sm"></div>
          </div>
        </div>

        <!-- 支付方式 -->
        <div class="mb-xl">
          <h3 class="text-lg font-semibold mb-md">
            <i class="fas fa-credit-card" style="color: var(--primary-color);"></i>
            支付方式
          </h3>
          <div class="payment-methods">
            <div class="payment-method active" data-method="alipay">
              <div class="payment-icon">
                <i class="fab fa-alipay"></i>
              </div>
              <div class="payment-name">支付宝</div>
            </div>
            <div class="payment-method" data-method="wechat">
              <div class="payment-icon">
                <i class="fab fa-weixin"></i>
              </div>
              <div class="payment-name">微信支付</div>
            </div>
          </div>
        </div>

        <!-- 订单摘要 -->
        <div class="mb-xl">
          <h3 class="text-lg font-semibold mb-md">
            <i class="fas fa-file-invoice-dollar" style="color: var(--primary-color);"></i>
            订单摘要
          </h3>
          <div class="card order-summary">
            <div class="summary-row">
              <span class="summary-label">选择套餐</span>
              <span class="summary-value" id="summary-plan">未选择</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">原价</span>
              <span class="summary-value" id="summary-original">¥0.00</span>
            </div>
            <div class="summary-row" id="discount-row" style="display: none;">
              <span class="summary-label">优惠</span>
              <span class="summary-value text-success" id="summary-discount">-¥0.00</span>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-row summary-total">
              <span class="summary-label">实付金额</span>
              <span class="summary-value text-primary" id="summary-total">¥0.00</span>
            </div>
          </div>
        </div>

        <!-- 立即购买按钮 -->
        <div class="text-center">
          <button class="btn btn-primary btn-lg" id="purchase-btn" disabled>
            <i class="fas fa-shopping-cart"></i>
            立即购买
          </button>
        </div>
      </div>
    `;
    }

    /**
     * 渲染套餐卡片
     */
    renderPlans() {
        return subscriptionPlans.map(plan => `
      <div class="subscription-plan-card ${plan.popular ? 'popular' : ''}" data-plan-id="${plan.id}">
        ${plan.popular ? '<div class="plan-badge"><i class="fas fa-star"></i> 最受欢迎</div>' : ''}
        <div class="plan-header">
          <div class="plan-name">${plan.name}</div>
          <div class="plan-period">${plan.period}</div>
        </div>
        <div class="plan-pricing">
          <div class="plan-price">
            <span class="price-symbol">¥</span>
            <span class="price-amount">${plan.price}</span>
            <span class="price-unit">/期</span>
          </div>
          ${plan.originalPrice ? `<div class="plan-original-price">原价 ¥${plan.originalPrice}</div>` : ''}
        </div>
        <div class="plan-features">
          <div class="feature-item">
            <i class="fas fa-check-circle"></i>
            <span>${plan.traffic}</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-check-circle"></i>
            <span>${plan.speed}</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-check-circle"></i>
            <span>${plan.devices}</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-check-circle"></i>
            <span>${plan.nodes}</span>
          </div>
        </div>
        <button class="btn btn-secondary btn-block select-plan-btn">
          <i class="fas fa-hand-pointer"></i>
          选择此套餐
        </button>
      </div>
    `).join('');
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 套餐选择
        const planCards = dom.$$('.subscription-plan-card');
        planCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // 如果点击的是按钮，不处理卡片点击
                if (e.target.closest('.select-plan-btn')) {
                    this.selectPlan(card.dataset.planId);
                } else if (!e.target.closest('button')) {
                    this.selectPlan(card.dataset.planId);
                }
            });

            // 按钮单独处理
            const btn = card.querySelector('.select-plan-btn');
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.selectPlan(card.dataset.planId);
                });
            }
        });

        // 用户名输入
        const usernameInput = dom.$('#username-input');
        if (usernameInput) {
            usernameInput.addEventListener('input', (e) => {
                this.username = e.target.value.trim();
                this.updatePurchaseButton();
            });
        }

        // 优惠码应用
        const applyCouponBtn = dom.$('#apply-coupon-btn');
        if (applyCouponBtn) {
            applyCouponBtn.addEventListener('click', () => this.applyCoupon());
        }

        // 支付方式选择
        const paymentMethods = dom.$$('.payment-method');
        paymentMethods.forEach(method => {
            method.addEventListener('click', () => {
                paymentMethods.forEach(m => dom.removeClass(m, 'active'));
                dom.addClass(method, 'active');
                this.paymentMethod = method.dataset.method;
            });
        });

        // 购买按钮
        const purchaseBtn = dom.$('#purchase-btn');
        if (purchaseBtn) {
            purchaseBtn.addEventListener('click', () => this.handlePurchase());
        }
    }

    /**
     * 选择套餐
     */
    selectPlan(planId) {
        const plan = subscriptionPlans.find(p => p.id === planId);
        if (!plan) return;

        this.selectedPlan = plan;

        // 更新UI
        const planCards = dom.$$('.subscription-plan-card');
        planCards.forEach(card => {
            if (card.dataset.planId === planId) {
                dom.addClass(card, 'selected');
                const btn = card.querySelector('.select-plan-btn');
                if (btn) {
                    btn.innerHTML = '<i class="fas fa-check"></i> 已选择';
                    dom.addClass(btn, 'btn-success');
                    dom.removeClass(btn, 'btn-secondary');
                }
            } else {
                dom.removeClass(card, 'selected');
                const btn = card.querySelector('.select-plan-btn');
                if (btn) {
                    btn.innerHTML = '<i class="fas fa-hand-pointer"></i> 选择此套餐';
                    dom.addClass(btn, 'btn-secondary');
                    dom.removeClass(btn, 'btn-success');
                }
            }
        });

        // 更新订单摘要
        this.updateOrderSummary();
        this.updatePurchaseButton();
    }

    /**
     * 应用优惠码
     */
    applyCoupon() {
        const couponInput = dom.$('#coupon-input');
        const couponMessage = dom.$('#coupon-message');

        if (!couponInput || !couponMessage) return;

        const code = couponInput.value.trim().toUpperCase();

        if (!code) {
            couponMessage.innerHTML = '<p class="text-warning text-sm"><i class="fas fa-exclamation-circle"></i> 请输入优惠码</p>';
            return;
        }

        // 模拟优惠码验证
        const validCoupons = {
            'WELCOME10': 0.9,  // 9折
            'VIP20': 0.8,      // 8折
            'SPECIAL50': 0.5   // 5折
        };

        if (validCoupons[code]) {
            this.couponCode = code;
            this.discountAmount = validCoupons[code];
            couponMessage.innerHTML = `<p class="text-success text-sm"><i class="fas fa-check-circle"></i> 优惠码已应用，享受 ${(1 - validCoupons[code]) * 100}% 折扣</p>`;
            this.updateOrderSummary();
        } else {
            this.couponCode = '';
            this.discountAmount = 0;
            couponMessage.innerHTML = '<p class="text-error text-sm"><i class="fas fa-times-circle"></i> 优惠码无效</p>';
        }
    }

    /**
     * 更新订单摘要
     */
    updateOrderSummary() {
        const summaryPlan = dom.$('#summary-plan');
        const summaryOriginal = dom.$('#summary-original');
        const summaryDiscount = dom.$('#summary-discount');
        const summaryTotal = dom.$('#summary-total');
        const discountRow = dom.$('#discount-row');

        if (!this.selectedPlan) {
            if (summaryPlan) summaryPlan.textContent = '未选择';
            if (summaryOriginal) summaryOriginal.textContent = '¥0.00';
            if (discountRow) discountRow.style.display = 'none';
            if (summaryTotal) summaryTotal.textContent = '¥0.00';
            return;
        }

        const originalPrice = this.selectedPlan.price;
        const finalPrice = this.discountAmount > 0
            ? (originalPrice * this.discountAmount).toFixed(2)
            : originalPrice.toFixed(2);
        const discount = this.discountAmount > 0
            ? (originalPrice - originalPrice * this.discountAmount).toFixed(2)
            : 0;

        if (summaryPlan) {
            summaryPlan.textContent = `${this.selectedPlan.name} - ${this.selectedPlan.period}`;
        }
        if (summaryOriginal) {
            summaryOriginal.textContent = `¥${originalPrice.toFixed(2)}`;
        }

        if (this.discountAmount > 0) {
            if (discountRow) discountRow.style.display = 'flex';
            if (summaryDiscount) summaryDiscount.textContent = `-¥${discount}`;
        } else {
            if (discountRow) discountRow.style.display = 'none';
        }

        if (summaryTotal) {
            summaryTotal.textContent = `¥${finalPrice}`;
        }
    }

    /**
     * 更新购买按钮状态
     */
    updatePurchaseButton() {
        const purchaseBtn = dom.$('#purchase-btn');
        if (!purchaseBtn) return;

        const canPurchase = this.selectedPlan && this.username.length > 0;
        purchaseBtn.disabled = !canPurchase;
    }

    /**
     * 处理购买
     */
    async handlePurchase() {
        if (!this.selectedPlan || !this.username) {
            alert('请完善购买信息');
            return;
        }

        const orderData = {
            plan: this.selectedPlan,
            username: this.username,
            couponCode: this.couponCode,
            paymentMethod: this.paymentMethod,
            totalAmount: this.calculateFinalAmount()
        };

        console.log('📝 创建订单:', orderData);

        // 显示加载状态
        const purchaseBtn = dom.$('#purchase-btn');
        if (purchaseBtn) {
            purchaseBtn.disabled = true;
            purchaseBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 处理中...';
        }

        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1500));

        // 显示成功消息
        alert(`订单创建成功！\n\n套餐: ${this.selectedPlan.name} - ${this.selectedPlan.period}\n金额: ¥${this.calculateFinalAmount()}\n支付方式: ${this.paymentMethod === 'alipay' ? '支付宝' : '微信支付'}\n\n请按照支付页面提示完成付款。`);

        // 恢复按钮状态
        if (purchaseBtn) {
            purchaseBtn.disabled = false;
            purchaseBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> 立即购买';
        }
    }

    /**
     * 计算最终金额
     */
    calculateFinalAmount() {
        if (!this.selectedPlan) return '0.00';

        const originalPrice = this.selectedPlan.price;
        const finalPrice = this.discountAmount > 0
            ? (originalPrice * this.discountAmount).toFixed(2)
            : originalPrice.toFixed(2);

        return finalPrice;
    }
}

// 创建实例
const shopManager = new ShopManager();

// 导出
export default shopManager;
