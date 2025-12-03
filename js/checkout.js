/**
 * VPS管理平台 - 结账页面
 * 处理用户输入、优惠码和支付
 */

import { dom } from './utils.js';
import shopManager from './shop.js';

class CheckoutManager {
  constructor() {
    this.selectedPlan = null;
    this.couponCode = '';
    this.discountAmount = 0;
    this.paymentMethod = 'alipay';
    this.username = '';
  }

  /**
   * 初始化结账页面
   * @param {string} planId - 选中的套餐ID
   */
  async init(planId) {
    console.log('💳 初始化结账页面...', planId);

    // 获取套餐信息
    this.selectedPlan = shopManager.getPlanById(planId);

    if (!this.selectedPlan) {
      alert('未选择套餐，请重新选择');
      window.app.navigateTo('subscribe');
      return;
    }

    this.render();
    this.bindEvents();
    this.updateOrderSummary();
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
          <button class="btn btn-text mb-sm" id="back-to-shop-btn">
            <i class="fas fa-arrow-left"></i> 返回选择套餐
          </button>
          <h2 class="text-xl font-semibold">
            <i class="fas fa-shopping-cart" style="color: var(--primary-color);"></i>
            确认订单
          </h2>
        </div>

        <div class="grid-layout" style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
          <!-- 左侧：表单信息 -->
          <div class="checkout-form">
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
          </div>

          <!-- 右侧：订单摘要 -->
          <div class="checkout-summary">
            <div class="card order-summary sticky-top" style="position: sticky; top: 1rem;">
              <h3 class="text-lg font-semibold mb-md">订单摘要</h3>
              
              <!-- 选中的套餐卡片简略版 -->
              <div class="selected-plan-preview mb-lg p-md bg-secondary rounded">
                <div class="font-bold text-primary mb-xs">${this.selectedPlan.name}</div>
                <div class="text-sm text-secondary mb-xs">${this.selectedPlan.traffic} | ${this.selectedPlan.speed}</div>
                <div class="text-sm text-secondary">${this.selectedPlan.period}</div>
              </div>

              <div class="summary-row">
                <span class="summary-label">商品总价</span>
                <span class="summary-value" id="summary-original">¥0.00</span>
              </div>
              <div class="summary-row" id="discount-row" style="display: none;">
                <span class="summary-label">优惠减免</span>
                <span class="summary-value text-success" id="summary-discount">-¥0.00</span>
              </div>
              <div class="summary-divider"></div>
              <div class="summary-row summary-total">
                <span class="summary-label">应付总额</span>
                <span class="summary-value text-primary" id="summary-total">¥0.00</span>
              </div>

              <button class="btn btn-primary btn-lg btn-block mt-lg" id="purchase-btn" disabled>
                <i class="fas fa-check-circle"></i>
                立即支付
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 绑定事件
   */
  bindEvents() {
    // 返回按钮
    const backBtn = dom.$('#back-to-shop-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        window.app.navigateTo('subscribe');
      });
    }

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
    const summaryOriginal = dom.$('#summary-original');
    const summaryDiscount = dom.$('#summary-discount');
    const summaryTotal = dom.$('#summary-total');
    const discountRow = dom.$('#discount-row');

    if (!this.selectedPlan) return;

    const originalPrice = this.selectedPlan.price;
    const finalPrice = this.discountAmount > 0
      ? (originalPrice * this.discountAmount).toFixed(2)
      : originalPrice.toFixed(2);
    const discount = this.discountAmount > 0
      ? (originalPrice - originalPrice * this.discountAmount).toFixed(2)
      : 0;

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
      purchaseBtn.innerHTML = '<i class="fas fa-check-circle"></i> 立即支付';
    }

    // 返回首页或订单页
    window.app.navigateTo('home');
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

const checkoutManager = new CheckoutManager();
export default checkoutManager;
