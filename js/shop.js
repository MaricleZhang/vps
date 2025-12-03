/**
 * VPS管理平台 - 购买订阅页面
 * 处理套餐选择
 */

import { dom } from './utils.js';

/**
 * 订阅计划数据
 */
export const subscriptionPlans = [
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
    // No longer needs state for checkout details
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
   * 获取套餐信息
   */
  getPlanById(planId) {
    return subscriptionPlans.find(p => p.id === planId);
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
          <div class="subscription-plans-grid">
            ${this.renderPlans()}
          </div>
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
        <button class="btn btn-primary btn-block select-plan-btn">
          <i class="fas fa-shopping-cart"></i>
          立即购买
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
        const planId = card.dataset.planId;
        this.goToCheckout(planId);
      });
    });
  }

  /**
   * 跳转到结账页面
   */
  goToCheckout(planId) {
    if (window.app) {
      window.app.navigateTo('checkout', { plan: planId });
    }
  }
}

// 创建实例
const shopManager = new ShopManager();

// 导出
export default shopManager;
