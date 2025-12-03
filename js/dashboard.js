/**
 * VPS管理平台 - 首页逻辑
 * 处理首页数据加载和交互
 */

import api from './api.js';
import { formatBytes, formatCurrency, formatDate, timeFromNow, formatPercentage, showToast, dom } from './utils.js';

/**
 * 首页控制器
 */
class Dashboard {
    constructor() {
        this.data = {
            user: null,
            stats: null,
            subscriptions: [],
            announcements: [],
            plans: []
        };

        this.selectedPlatform = null;
    }

    /**
     * 初始化首页
     */
    async init() {
        try {
            // 显示加载状态
            this.showLoading();

            // 并行加载所有数据
            await Promise.all([
                this.loadUserInfo(),
                this.loadAccountStats(),
                this.loadSubscriptions(),
                this.loadAnnouncements(),
                this.loadPlans()
            ]);

            // 渲染页面
            this.render();

            // 绑定事件
            this.bindEvents();

            // 隐藏加载状态
            this.hideLoading();

        } catch (error) {
            console.error('首页初始化失败:', error);
            showToast('加载失败，请刷新页面重试', 'error');
            this.hideLoading();
        }
    }

    /**
     * 加载用户信息
     */
    async loadUserInfo() {
        try {
            this.data.user = await api.user.getInfo();
        } catch (error) {
            console.error('加载用户信息失败:', error);
            // 使用模拟数据
            this.data.user = {
                id: 1,
                username: 'ME',
                email: 'user@example.com',
                avatar: null
            };
        }
    }

    /**
     * 加载账户统计
     */
    async loadAccountStats() {
        try {
            this.data.stats = await api.account.getStats();
        } catch (error) {
            console.error('加载账户统计失败:', error);
            // 使用模拟数据
            this.data.stats = {
                balance: 0,
                traffic: {
                    used: 90.64 * 1024 * 1024 * 1024,  // 90.64 GB
                    total: 74.14 * 1024 * 1024 * 1024  // 74.14 GB (注意：实际应该是total > used，这里用于演示)
                },
                expireDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(),
                daysRemaining: 23
            };
        }
    }

    /**
     * 加载订阅列表
     */
    async loadSubscriptions() {
        try {
            this.data.subscriptions = await api.subscription.getList();
        } catch (error) {
            console.error('加载订阅列表失败:', error);
            // 使用模拟数据
            this.data.subscriptions = [
                {
                    id: 1,
                    name: '轻量 Lite 50G',
                    type: 'monthly',
                    status: 'active',
                    expireDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(),
                    subscribeUrl: 'https://example.com/subscribe/abc123'
                }
            ];
        }
    }

    /**
     * 加载公告
     */
    async loadAnnouncements() {
        try {
            this.data.announcements = await api.announcement.getList(5);
        } catch (error) {
            console.error('加载公告失败:', error);
            // 使用模拟数据
            this.data.announcements = [
                {
                    id: 1,
                    title: '欢迎使用DiceCloud',
                    content: '因GFW新策略相继封杀，如您在对接服务端时遇到地址无法访问或者，请查看官网最新入门级地址换成最新。',
                    link: 'https://nycink.cc',
                    type: 'info',
                    createdAt: new Date().toISOString()
                }
            ];
        }
    }

    /**
     * 加载套餐
     */
    async loadPlans() {
        try {
            this.data.plans = await api.subscription.getPlans();
        } catch (error) {
            console.error('加载套餐失败:', error);
            // 使用模拟数据
            this.data.plans = [
                { id: 1, name: 'Shadowrocket 订阅', icon: '🚀', type: 'shadowrocket' },
                { id: 2, name: 'Stash 订阅', icon: '⚡', type: 'stash' },
                { id: 3, name: 'Clash 订阅', icon: '🔥', type: 'clash' }
            ];
        }
    }

    /**
     * 渲染页面
     */
    render() {
        this.renderUserInfo();
        this.renderAnnouncement();
        this.renderStatsCards();
        this.renderSubscriptions();
        this.renderQuickActions();
        this.renderPlatformSelector();
    }

    /**
     * 渲染用户信息
     */
    renderUserInfo() {
        const userNameEl = dom.$('.user-name');
        const userAvatarEl = dom.$('.user-avatar');

        if (userNameEl) {
            userNameEl.textContent = this.data.user.username;
        }

        if (userAvatarEl) {
            userAvatarEl.textContent = this.data.user.username.charAt(0).toUpperCase();
        }
    }

    /**
     * 渲染公告栏
     */
    renderAnnouncement() {
        const container = dom.$('#announcement-container');
        if (!container || this.data.announcements.length === 0) return;

        const announcement = this.data.announcements[0];

        container.innerHTML = `
      <div class="announcement-banner">
        <div class="announcement-icon">
          <i class="fas fa-bullhorn"></i>
        </div>
        <div class="announcement-content">
          公告：${announcement.content}
          ${announcement.link ? ` <a href="${announcement.link}" class="announcement-link" target="_blank">${announcement.link}</a>` : ''}
        </div>
        <div class="announcement-close" onclick="dashboard.closeAnnouncement()">
          <i class="fas fa-times"></i>
        </div>
      </div>
    `;
    }

    /**
     * 渲染统计卡片
     */
    renderStatsCards() {
        // 余额卡片
        const balanceEl = dom.$('#balance-value');
        const balancePercentEl = dom.$('#balance-percent');
        if (balanceEl) {
            balanceEl.textContent = `${this.data.stats.balance} CNY`;
            if (balancePercentEl) {
                balancePercentEl.textContent = '100%';
            }
        }

        // 流量卡片
        const trafficUsedEl = dom.$('#traffic-used');
        const trafficTotalEl = dom.$('#traffic-total');
        const trafficPercentEl = dom.$('#traffic-percent');
        const trafficProgressEl = dom.$('#traffic-progress');

        if (trafficUsedEl) {
            trafficUsedEl.textContent = formatBytes(this.data.stats.traffic.used);
        }
        if (trafficTotalEl) {
            trafficTotalEl.textContent = formatBytes(this.data.stats.traffic.total);
        }

        const trafficPercent = (this.data.stats.traffic.used / this.data.stats.traffic.total) * 100;
        if (trafficPercentEl) {
            trafficPercentEl.textContent = `${Math.round(trafficPercent)}%`;
        }
        if (trafficProgressEl) {
            trafficProgressEl.style.width = `${Math.min(trafficPercent, 100)}%`;
        }

        // 到期时间卡片
        const expireDateEl = dom.$('#expire-date');
        const expireDaysEl = dom.$('#expire-days');
        const expirePercentEl = dom.$('#expire-percent');

        if (expireDateEl) {
            expireDateEl.textContent = formatDate(this.data.stats.expireDate, 'YYYY-MM-DD');
        }
        if (expireDaysEl) {
            expireDaysEl.textContent = timeFromNow(this.data.stats.expireDate);
        }
        if (expirePercentEl) {
            expirePercentEl.textContent = '100%';
        }
    }

    /**
     * 渲染订阅列表
     */
    renderSubscriptions() {
        const container = dom.$('#subscriptions-container');
        if (!container) return;

        if (this.data.subscriptions.length === 0) {
            container.innerHTML = '<p class="text-secondary">暂无订阅</p>';
            return;
        }

        const html = this.data.subscriptions.map(sub => `
      <div class="card">
        <div class="flex justify-between items-center mb-md">
          <h3 class="card-title">${sub.name}</h3>
          <span class="badge badge-success">
            <i class="fas fa-check"></i> 活跃
          </span>
        </div>
        <p class="text-sm text-secondary mb-md">
          订阅地址：<code style="background: var(--bg-tertiary); padding: 4px 8px; border-radius: 4px; font-size: 0.75rem;">${sub.subscribeUrl}</code>
        </p>
        <p class="text-sm text-tertiary">
          到期时间：${formatDate(sub.expireDate, 'YYYY-MM-DD')} (剩余 ${timeFromNow(sub.expireDate)})
        </p>
        <div class="flex gap-md mt-md">
          <button class="btn btn-sm btn-primary" onclick="dashboard.copySubscribeUrl('${sub.subscribeUrl}')">
            <i class="fas fa-copy"></i> 复制订阅
          </button>
          <button class="btn btn-sm btn-secondary" onclick="dashboard.renewSubscription(${sub.id})">
            <i class="fas fa-redo"></i> 续费
          </button>
        </div>
      </div>
    `).join('');

        container.innerHTML = html;
    }

    /**
     * 渲染快捷操作
     */
    renderQuickActions() {
        const container = dom.$('#quick-actions-container');
        if (!container) return;

        const quickPlans = this.data.plans.slice(0, 3);

        const html = quickPlans.map((plan, index) => {
            const gradients = ['primary', 'success', 'purple'];
            return `
        <button class="quick-action-btn" onclick="dashboard.quickSubscribe('${plan.type}')">
          <div class="quick-action-icon ${gradients[index]}">
            <span>${plan.icon}</span>
          </div>
          <div class="quick-action-content">
            <div class="quick-action-title">${plan.name}</div>
            <div class="quick-action-desc">快速订阅</div>
          </div>
          <i class="fas fa-chevron-right" style="color: var(--text-tertiary);"></i>
        </button>
      `;
        }).join('');

        container.innerHTML = html;
    }

    /**
     * 渲染平台选择器
     */
    renderPlatformSelector() {
        const container = dom.$('#platform-selector');
        if (!container) return;

        const platforms = [
            { id: 'windows', name: 'Windows', icon: '💻' },
            { id: 'android', name: 'Android', icon: '📱' },
            { id: 'ios', name: 'iOS', icon: '🍎' },
            { id: 'macos', name: 'macOS', icon: '🖥️' },
            { id: 'linux', name: 'Linux', icon: '🐧' },
            { id: 'openwrt', name: 'Openwrt', icon: '⚙️' }
        ];

        const html = platforms.map(platform => `
      <div class="platform-btn" data-platform="${platform.id}" onclick="dashboard.selectPlatform('${platform.id}')">
        <div class="platform-icon">${platform.icon}</div>
        <div class="platform-name">${platform.name}</div>
      </div>
    `).join('');

        container.innerHTML = html;
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 下载客户端按钮
        const downloadBtn = dom.$('#download-client-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadClient());
        }

        // 续费订阅按钮
        const renewBtn = dom.$('#renew-subscription-btn');
        if (renewBtn) {
            renewBtn.addEventListener('click', () => this.showRenewDialog());
        }
    }

    /**
     * 关闭公告
     */
    closeAnnouncement() {
        const banner = dom.$('.announcement-banner');
        if (banner) {
            banner.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => banner.remove(), 300);
        }
    }

    /**
     * 选择平台
     */
    selectPlatform(platformId) {
        // 移除所有选中状态
        const allPlatforms = dom.$$('.platform-btn');
        allPlatforms.forEach(btn => dom.removeClass(btn, 'selected'));

        // 添加选中状态
        const selectedBtn = dom.$(`.platform-btn[data-platform="${platformId}"]`);
        if (selectedBtn) {
            dom.addClass(selectedBtn, 'selected');
            this.selectedPlatform = platformId;
        }
    }

    /**
     * 下载客户端
     */
    async downloadClient() {
        if (!this.selectedPlatform) {
            showToast('请先选择平台', 'warning');
            return;
        }

        try {
            const downloadInfo = await api.download.getClientUrl(this.selectedPlatform);
            window.open(downloadInfo.downloadUrl, '_blank');
            showToast('开始下载...', 'success');
        } catch (error) {
            console.error('获取下载链接失败:', error);
            showToast('获取下载链接失败', 'error');
        }
    }

    /**
     * 复制订阅链接
     */
    async copySubscribeUrl(url) {
        try {
            await navigator.clipboard.writeText(url);
            showToast('订阅链接已复制', 'success');
        } catch (error) {
            console.error('复制失败:', error);
            showToast('复制失败，请手动复制', 'error');
        }
    }

    /**
     * 续费订阅
     */
    renewSubscription(subscriptionId) {
        showToast('续费功能开发中...', 'info');
        // TODO: 实现续费逻辑
    }

    /**
     * 快捷订阅
     */
    quickSubscribe(type) {
        showToast(`正在订阅 ${type}...`, 'info');
        // TODO: 实现快捷订阅逻辑
    }

    /**
     * 显示续费对话框
     */
    showRenewDialog() {
        showToast('续费对话框开发中...', 'info');
        // TODO: 实现续费对话框
    }

    /**
     * 显示加载状态
     */
    showLoading() {
        const content = dom.$('.content');
        if (content) {
            content.innerHTML = '<div class="loading-spinner"></div>';
        }
    }

    /**
     * 隐藏加载状态
     */
    hideLoading() {
        // 加载状态会在render()时被覆盖
    }
}

// 创建全局实例
const dashboard = new Dashboard();

// 导出
export default dashboard;

// 也挂载到window供HTML调用
window.dashboard = dashboard;
