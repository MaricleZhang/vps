/**
 * VPS管理平台 - 首页逻辑
 * 处理首页数据加载和交互
 */

import api from './api.js';
import { formatBytes, formatCurrency, formatDate, timeFromNow, formatPercentage, getTrafficStatus, showToast, dom } from './utils.js';

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

        // 从localStorage读取上次选择的平台
        this.selectedPlatform = localStorage.getItem('selectedPlatform') || null;
        this.currentTab = 'my-subscriptions'; // 'my-subscriptions' or 'quick-subscribe'
    }

    /**
     * 初始化首页
     */
    async init() {
        try {
            // 先恢复原始的HTML结构（如果被其他页面替换了）
            this.restoreHomeContent();

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
     * 恢复首页内容结构
     */
    restoreHomeContent() {
        const content = dom.$('.content');
        if (!content) return;

        // 检查是否需要恢复原始结构
        const hasOriginalStructure = content.querySelector('#announcement-container');

        if (!hasOriginalStructure) {
            // 恢复原始HTML结构
            content.innerHTML = `
                <!-- 公告栏 -->
                <div id="announcement-container"></div>
                
                <!-- 账户信息卡片 -->
                <div class="grid grid-cols-3 mb-xl">
                    <!-- 余额卡片 -->
                    <div class="stats-card">
                        <div class="stats-label">
                            <i class="fas fa-wallet"></i>
                            转换余额(限时活动赠送)
                        </div>
                        <div class="stats-value" id="balance-value">0 CNY</div>
                        <div class="stats-description">
                            上次充值 <span id="balance-percent">100%</span>
                        </div>
                    </div>
                    
                    <!-- 流量卡片 -->
                    <div class="stats-card">
                        <div class="stats-label">
                            <i class="fas fa-chart-line"></i>
                            可用流量
                        </div>
                        <div class="stats-value">
                            <span id="traffic-used">0 GB</span> / <span id="traffic-total">0 GB</span>
                        </div>
                        <div class="stats-description">
                            已使用 <span id="traffic-percent">0%</span>
                        </div>
                        <div class="stats-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" id="traffic-progress" style="width: 0%"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 过期时间卡片 -->
                    <div class="stats-card">
                        <div class="stats-label">
                            <i class="fas fa-clock"></i>
                            过期时间
                        </div>
                        <div class="stats-value" id="expire-date">--</div>
                        <div class="stats-description">
                            剩余 <span id="expire-days">--</span> · 已续费 <span id="expire-percent">100%</span>
                        </div>
                    </div>
                </div>
                
                <!-- 订阅管理区域 -->
                <div class="mb-xl">
                    <div class="tabs mb-lg">
                        <div class="tab active" data-tab="my-subscriptions">我的订阅</div>
                        <div class="tab" data-tab="quick-subscribe">快捷订阅</div>
                    </div>
                    
                    <div id="subscriptions-container" class="grid grid-cols-1">
                        <!-- 订阅列表将通过JS动态渲染 -->
                    </div>
                </div>
                
                <!-- 快捷入口 -->
                <div class="mb-xl">
                    <h3 class="text-lg font-semibold mb-md">
                        <i class="fas fa-bolt" style="color: var(--primary-color);"></i>
                        快捷订阅
                    </h3>
                    <div id="quick-actions-container" class="quick-actions">
                        <!-- 快捷操作按钮将通过JS动态渲染 -->
                    </div>
                </div>
                
                <!-- 平台选择 -->
                <div class="mb-xl">
                    <h3 class="text-lg font-semibold mb-md">
                        <i class="fas fa-desktop" style="color: var(--primary-color);"></i>
                        快速入口
                    </h3>
                    <div id="platform-selector" class="platform-selector">
                        <!-- 平台按钮将通过JS动态渲染 -->
                    </div>
                </div>
                
                <!-- 流量限制提示 -->
                <div class="card" style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%); border-color: rgba(239, 68, 68, 0.3);">
                    <div class="flex items-center gap-md">
                        <div style="width: 48px; height: 48px; background: rgba(239, 68, 68, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--color-error); font-size: 1.5rem;">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <div>
                            <h4 class="font-semibold mb-xs">流量限制热点</h4>
                            <p class="text-sm text-secondary">若下地铁时无法使用，请重启手机以便下载完整配置文件</p>
                        </div>
                    </div>
                </div>
            `;
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
            const now = new Date();
            const subscriptionStart = new Date(now.getTime() - 307 * 24 * 60 * 60 * 1000); // 307天前开始
            const totalDays = 365; // 订阅总时长1年
            const daysRemaining = 23; // 剩余23天

            this.data.stats = {
                balance: 128.50, // 余额
                lastRecharge: {
                    amount: 100,
                    date: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString() // 15天前充值
                },
                traffic: {
                    used: 90.64 * 1024 * 1024 * 1024,  // 已使用90.64 GB
                    total: 150 * 1024 * 1024 * 1024,    // 总共150 GB
                    resetDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7天后重置
                },
                subscription: {
                    startDate: subscriptionStart.toISOString(),
                    totalDays: totalDays,
                    daysUsed: totalDays - daysRemaining
                },
                expireDate: new Date(now.getTime() + daysRemaining * 24 * 60 * 60 * 1000).toISOString(),
                daysRemaining: daysRemaining
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
        this.renderTabs();
        this.renderSubscriptions();
        this.renderQuickActions();
        this.renderPlatformSelector();
        this.renderTrafficTrends();
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
        // 如果数据未加载，使用默认值
        const stats = this.data.stats || {
            balance: 0,
            traffic: { used: 0, total: 1 },
            expireDate: new Date().toISOString(),
            daysRemaining: 0
        };

        // === 余额卡片 ===
        const balanceEl = dom.$('#balance-value');
        const balancePercentEl = dom.$('#balance-percent');

        if (balanceEl) {
            balanceEl.textContent = formatCurrency(stats.balance);
        }

        if (balancePercentEl && stats.lastRecharge) {
            const rechargePercent = Math.round((stats.lastRecharge.amount / (stats.balance + stats.lastRecharge.amount)) * 100);
            balancePercentEl.textContent = `${rechargePercent}%`;
        } else if (balancePercentEl) {
            balancePercentEl.textContent = '100%';
        }

        // === 流量卡片 ===
        const trafficUsedEl = dom.$('#traffic-used');
        const trafficTotalEl = dom.$('#traffic-total');
        const trafficPercentEl = dom.$('#traffic-percent');
        const trafficProgressEl = dom.$('#traffic-progress');

        if (trafficUsedEl) {
            trafficUsedEl.textContent = formatBytes(stats.traffic.used);
        }
        if (trafficTotalEl) {
            trafficTotalEl.textContent = formatBytes(stats.traffic.total);
        }

        // 计算流量使用百分比
        const trafficPercent = (stats.traffic.used / stats.traffic.total) * 100;

        if (trafficPercentEl) {
            trafficPercentEl.textContent = `${Math.round(trafficPercent)}%`;
        }

        // 设置进度条宽度和颜色
        if (trafficProgressEl) {
            trafficProgressEl.style.width = `${Math.min(trafficPercent, 100)}%`;

            // 移除所有颜色类
            trafficProgressEl.classList.remove('success', 'warning', 'critical', 'normal');

            // 根据使用率添加对应颜色
            const trafficStatus = getTrafficStatus(
                stats.traffic.used,
                stats.traffic.total
            );
            trafficProgressEl.classList.add(trafficStatus.level);

            // 如果有警告,显示提示
            if (trafficStatus.warning) {
                const trafficCard = dom.$('#traffic-used')?.closest('.stats-card');
                if (trafficCard) {
                    // 添加警告图标
                    let warningIcon = trafficCard.querySelector('.traffic-warning-icon');
                    if (!warningIcon) {
                        warningIcon = dom.create('div', {
                            className: 'traffic-warning-icon',
                            style: {
                                marginTop: 'var(--spacing-sm)',
                                color: trafficStatus.color === 'error' ? 'var(--color-error)' : 'var(--color-warning)',
                                fontSize: '0.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-xs)'
                            }
                        }, `<i class="fas fa-exclamation-triangle"></i> ${trafficStatus.message}`);
                        trafficCard.appendChild(warningIcon);
                    } else {
                        warningIcon.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${trafficStatus.message}`;
                        warningIcon.style.color = trafficStatus.color === 'error' ? 'var(--color-error)' : 'var(--color-warning)';
                    }
                }
            }
        }

        // === 到期时间卡片 ===
        const expireDateEl = dom.$('#expire-date');
        const expireDaysEl = dom.$('#expire-days');
        const expirePercentEl = dom.$('#expire-percent');

        if (expireDateEl) {
            expireDateEl.textContent = formatDate(stats.expireDate, 'YYYY-MM-DD');
        }

        if (expireDaysEl) {
            const daysText = timeFromNow(stats.expireDate);
            expireDaysEl.textContent = daysText;

            // 如果少于7天,添加警告样式
            if (stats.daysRemaining <= 7) {
                expireDaysEl.style.color = 'var(--color-error)';
                expireDaysEl.style.fontWeight = '600';
            } else {
                expireDaysEl.style.color = '';
                expireDaysEl.style.fontWeight = '';
            }
        }

        // 计算续费百分比(已使用时间的百分比)
        if (expirePercentEl && stats.subscription) {
            const renewPercent = Math.round(
                (stats.subscription.daysUsed / stats.subscription.totalDays) * 100
            );
            expirePercentEl.textContent = `${renewPercent}%`;
        } else if (expirePercentEl) {
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
      <div class="card subscription-card">
        <div class="flex justify-between items-center mb-md">
          <h3 class="card-title">${sub.name}</h3>
          <span class="badge badge-success">
            <i class="fas fa-check"></i> 活跃
          </span>
        </div>
        <div class="subscription-info mb-md">
          <div class="info-row">
            <span class="info-label"><i class="fas fa-link"></i> 订阅地址</span>
            <div class="info-value">
              <code class="subscribe-url">${sub.subscribeUrl}</code>
            </div>
          </div>
          <div class="info-row">
            <span class="info-label"><i class="fas fa-clock"></i> 到期时间</span>
            <span class="info-value">${formatDate(sub.expireDate, 'YYYY-MM-DD')} <span class="text-tertiary">(剩余 ${timeFromNow(sub.expireDate)})</span></span>
          </div>
        </div>
        <div class="subscription-actions">
          <button class="btn btn-sm btn-primary" onclick="dashboard.copySubscribeUrl('${sub.subscribeUrl}')">
            <i class="fas fa-copy"></i> 一键复制
          </button>
          <button class="btn btn-sm btn-secondary" onclick="dashboard.importToClient(${sub.id})">
            <i class="fas fa-download"></i> 导入客户端
          </button>
          <button class="btn btn-sm btn-outline" onclick="dashboard.renewSubscription(${sub.id})">
            <i class="fas fa-redo"></i> 续费
          </button>
        </div>
      </div>
    `).join('');

        container.innerHTML = html;
    }

    /**
     * 渲染快捷订阅列表
     */
    renderQuickSubscriptionList() {
        const container = dom.$('#subscriptions-container');
        if (!container) return;

        const quickPlans = [
            { id: 1, name: 'Shadowrocket 订阅', price: '¥19.9/月', traffic: '100GB', icon: '🚀', color: 'primary' },
            { id: 2, name: 'Clash 订阅', price: '¥29.9/月', traffic: '200GB', icon: '🔥', color: 'danger' },
            { id: 3, name: 'Stash 订阅', price: '¥39.9/月', traffic: '300GB', icon: '⚡', color: 'success' }
        ];

        const html = quickPlans.map(plan => `
      <div class="card quick-plan-card">
        <div class="flex items-center gap-md mb-md">
          <div class="plan-icon ${plan.color}">${plan.icon}</div>
          <div class="flex-1">
            <h3 class="card-title">${plan.name}</h3>
            <p class="text-sm text-tertiary">${plan.traffic} 流量/月</p>
          </div>
          <div class="plan-price">${plan.price}</div>
        </div>
        <div class="plan-features mb-md">
          <div class="feature-item">
            <i class="fas fa-check-circle" style="color: var(--color-success);"></i>
            <span>高速稳定节点</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-check-circle" style="color: var(--color-success);"></i>
            <span>24/7 技术支持</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-check-circle" style="color: var(--color-success);"></i>
            <span>多设备同时使用</span>
          </div>
        </div>
        <button class="btn btn-primary btn-block" onclick="dashboard.purchasePlan(${plan.id})">
          <i class="fas fa-shopping-cart"></i> 立即订阅
        </button>
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
      <div class="platform-btn ${this.selectedPlatform === platform.id ? 'selected' : ''}" 
           data-platform="${platform.id}" 
           onclick="dashboard.selectPlatform('${platform.id}')">
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

        // Tab切换
        this.bindTabEvents();

        // 绑定刷新按钮(如果有的话)
        const refreshBtns = dom.$$('.refresh-stats-btn');
        refreshBtns.forEach(btn => {
            btn.addEventListener('click', () => this.refreshStats());
        });
    }

    /**
     * 刷新账户统计数据
     */
    async refreshStats() {
        try {
            showToast('正在刷新数据...', 'info', 1500);

            // 重新加载统计数据
            await this.loadAccountStats();

            // 重新渲染卡片
            this.renderStatsCards();

            showToast('✅ 数据已更新', 'success', 2000);
        } catch (error) {
            console.error('刷新数据失败:', error);
            showToast('❌ 刷新失败,请稍后重试', 'error');
        }
    }

    /**
     * 绑定Tab切换事件
     */
    bindTabEvents() {
        const tabs = dom.$$('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabType = tab.dataset.tab;
                if (tabType) {
                    this.switchTab(tabType);
                }
            });
        });
    }

    /**
     * 切换Tab
     */
    switchTab(tabType) {
        this.currentTab = tabType;

        // 更新Tab激活状态
        const tabs = dom.$$('.tab');
        tabs.forEach(tab => {
            if (tab.dataset.tab === tabType) {
                dom.addClass(tab, 'active');
            } else {
                dom.removeClass(tab, 'active');
            }
        });

        // 重新渲染内容
        if (tabType === 'my-subscriptions') {
            this.renderSubscriptions();
        } else if (tabType === 'quick-subscribe') {
            this.renderQuickSubscriptionList();
        }
    }

    /**
     * 渲染Tab标签
     */
    renderTabs() {
        const tabsContainer = dom.$('.tabs');
        if (!tabsContainer) return;

        const tabs = [
            { id: 'my-subscriptions', label: '我的订阅' },
            { id: 'quick-subscribe', label: '快捷订阅' }
        ];

        const html = tabs.map(tab => `
            <div class="tab ${tab.id === this.currentTab ? 'active' : ''}" data-tab="${tab.id}">
                ${tab.label}
            </div>
        `).join('');

        tabsContainer.innerHTML = html;

        // 重新绑定事件
        this.bindTabEvents();
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
        // 保存选择到localStorage
        localStorage.setItem('selectedPlatform', platformId);
        this.selectedPlatform = platformId;

        // 移除所有选中状态
        const allPlatforms = dom.$$('.platform-btn');
        allPlatforms.forEach(btn => dom.removeClass(btn, 'selected'));

        // 添加选中状态
        const selectedBtn = dom.$(`.platform-btn[data-platform="${platformId}"]`);
        if (selectedBtn) {
            dom.addClass(selectedBtn, 'selected');
        }

        // 提示用户
        showToast(`已选择 ${platformId} 平台`, 'success', 2000);
    }

    /**
     * 下载客户端
     */
    async downloadClient() {
        if (!this.selectedPlatform) {
            showToast('⚠️ 请先选择您的设备平台', 'warning');
            // 高亮平台选择区域
            const platformSelector = dom.$('#platform-selector');
            if (platformSelector) {
                platformSelector.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    platformSelector.style.animation = '';
                }, 500);
            }
            return;
        }

        try {
            // 显示下载中提示
            showToast(`正在获取 ${this.selectedPlatform} 客户端下载链接...`, 'info', 2000);

            const downloadInfo = await api.download.getClientUrl(this.selectedPlatform);

            // 打开下载链接
            window.open(downloadInfo.downloadUrl, '_blank');
            showToast('✅ 下载已开始，请查看浏览器下载列表', 'success');
        } catch (error) {
            console.error('获取下载链接失败:', error);
            // 显示错误信息和备用方案
            showToast('暂时无法获取下载链接，请稍后重试或联系客服', 'error', 4000);
        }
    }

    /**
     * 复制订阅链接
     */
    async copySubscribeUrl(url) {
        try {
            await navigator.clipboard.writeText(url);
            showToast('✅ 订阅链接已复制到剪贴板', 'success');

            // 添加复制成功的视觉反馈
            const event = new CustomEvent('copy-success');
            document.dispatchEvent(event);
        } catch (error) {
            console.error('复制失败:', error);
            // 降级方案：显示选择文本提示
            showToast('复制失败，请手动选择复制', 'error');
        }
    }

    /**
     * 导入到客户端
     */
    importToClient(subscriptionId) {
        const subscription = this.data.subscriptions.find(s => s.id === subscriptionId);
        if (!subscription) return;

        // 尝试打开客户端协议链接
        const protocols = [
            `shadowrocket://add/sub?url=${encodeURIComponent(subscription.subscribeUrl)}`,
            `clash://install-config?url=${encodeURIComponent(subscription.subscribeUrl)}`,
            `stash://install-config?url=${encodeURIComponent(subscription.subscribeUrl)}`
        ];

        // 先复制链接
        this.copySubscribeUrl(subscription.subscribeUrl);

        // 显示导入说明
        showToast('订阅链接已复制，请在客户端中手动添加', 'info');
    }

    /**
     * 购买套餐
     */
    purchasePlan(planId) {
        showToast('正在跳转到购买页面...', 'info');
        // TODO: 实现购买逻辑
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
            // 检查是否已存在loading overlay
            let overlay = content.querySelector('.loading-overlay');
            if (!overlay) {
                // 创建loading overlay而不是替换innerHTML
                overlay = dom.create('div', {
                    className: 'loading-overlay',
                    style: {
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        right: '0',
                        bottom: '0',
                        background: 'rgba(15, 20, 25, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: '1000'
                    }
                });

                const spinner = dom.create('div', {
                    className: 'loading-spinner'
                });

                overlay.appendChild(spinner);
                content.style.position = 'relative';
                content.appendChild(overlay);
            }
        }
    }

    /**
     * 隐藏加载状态
     */
    hideLoading() {
        const content = dom.$('.content');
        if (content) {
            // 移除loading overlay
            const overlay = content.querySelector('.loading-overlay');
            if (overlay) {
                overlay.remove();
            }
        }
    }

    /**
     * 生成模拟流量数据
     */
    generateMockTrafficData(days = 7) {
        const data = [];
        const now = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);

            // 生成随机但有规律的流量数据
            const baseUpload = 2 + Math.random() * 3; // 2-5 GB
            const baseDownload = 5 + Math.random() * 8; // 5-13 GB

            // 添加一些峰值和低谷
            const dayOfWeek = date.getDay();
            const multiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.3 : 1.0; // 周末流量更高

            data.push({
                date: date,
                upload: baseUpload * multiplier,
                download: baseDownload * multiplier
            });
        }

        return data;
    }

    /**
     * 渲染流量走势图
     */
    renderTrafficTrends() {
        const canvas = dom.$('#traffic-chart-canvas');
        if (!canvas) return;

        // 设置canvas实际尺寸
        const container = canvas.parentElement;
        const dpr = window.devicePixelRatio || 1;
        const rect = container.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';

        // 初始化图表数据
        this.currentPeriod = 7;
        this.chartData = this.generateMockTrafficData(7);

        // 绘制图表
        this.drawTrafficChart();

        // 绑定期间选择器事件
        this.bindPeriodSelector();

        // 绑定图表交互事件
        this.bindChartInteraction();
    }

    /**
     * 绘制流量图表
     */
    drawTrafficChart() {
        const canvas = dom.$('#traffic-chart-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const width = canvas.width;
        const height = canvas.height;

        // 清空画布
        ctx.clearRect(0, 0, width, height);
        ctx.scale(dpr, dpr);

        const actualWidth = width / dpr;
        const actualHeight = height / dpr;

        // 计算绘图区域
        const padding = { top: 20, right: 20, bottom: 40, left: 50 };
        const chartWidth = actualWidth - padding.left - padding.right;
        const chartHeight = actualHeight - padding.top - padding.bottom;

        // 找出最大值用于缩放
        const maxValue = Math.max(
            ...this.chartData.map(d => Math.max(d.upload, d.download))
        );
        const yScale = chartHeight / (maxValue * 1.1); // 留10%空间

        // 绘制网格线
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding.top + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(padding.left + chartWidth, y);
            ctx.stroke();
        }

        // 绘制Y轴标签
        ctx.fillStyle = '#718096';
        ctx.font = '11px -apple-system, sans-serif';
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const value = (maxValue * 1.1) * (1 - i / 5);
            const y = padding.top + (chartHeight / 5) * i;
            ctx.fillText(value.toFixed(1) + ' GB', padding.left - 10, y + 4);
        }

        // 计算点的位置
        const points = this.chartData.map((d, i) => {
            const x = padding.left + (chartWidth / (this.chartData.length - 1)) * i;
            return {
                x,
                uploadY: padding.top + chartHeight - d.upload * yScale,
                downloadY: padding.top + chartHeight - d.download * yScale,
                data: d
            };
        });

        // 保存点数据供交互使用
        this.chartPoints = points;

        // 绘制下载区域（紫色渐变）
        const downloadGradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
        downloadGradient.addColorStop(0, 'rgba(102, 126, 234, 0.3)');
        downloadGradient.addColorStop(1, 'rgba(118, 75, 162, 0.05)');

        ctx.fillStyle = downloadGradient;
        ctx.beginPath();
        ctx.moveTo(points[0].x, padding.top + chartHeight);
        points.forEach(p => ctx.lineTo(p.x, p.downloadY));
        ctx.lineTo(points[points.length - 1].x, padding.top + chartHeight);
        ctx.closePath();
        ctx.fill();

        // 绘制下载线条
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        points.forEach((p, i) => {
            if (i === 0) ctx.moveTo(p.x, p.downloadY);
            else ctx.lineTo(p.x, p.downloadY);
        });
        ctx.stroke();

        // 绘制上传区域（蓝色渐变）
        const uploadGradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
        uploadGradient.addColorStop(0, 'rgba(79, 172, 254, 0.3)');
        uploadGradient.addColorStop(1, 'rgba(0, 242, 254, 0.05)');

        ctx.fillStyle = uploadGradient;
        ctx.beginPath();
        ctx.moveTo(points[0].x, padding.top + chartHeight);
        points.forEach(p => ctx.lineTo(p.x, p.uploadY));
        ctx.lineTo(points[points.length - 1].x, padding.top + chartHeight);
        ctx.closePath();
        ctx.fill();

        // 绘制上传线条
        ctx.strokeStyle = '#4facfe';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        points.forEach((p, i) => {
            if (i === 0) ctx.moveTo(p.x, p.uploadY);
            else ctx.lineTo(p.x, p.uploadY);
        });
        ctx.stroke();

        // 绘制数据点
        points.forEach(p => {
            // 下载点
            ctx.fillStyle = '#667eea';
            ctx.beginPath();
            ctx.arc(p.x, p.downloadY, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // 上传点
            ctx.fillStyle = '#4facfe';
            ctx.beginPath();
            ctx.arc(p.x, p.uploadY, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        // 绘制X轴标签
        ctx.fillStyle = '#718096';
        ctx.font = '11px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        points.forEach((p, i) => {
            const date = p.data.date;
            const label = `${date.getMonth() + 1}/${date.getDate()}`;

            // 根据数据点数量决定显示哪些标签
            const showEvery = this.chartData.length > 15 ? 3 : (this.chartData.length > 10 ? 2 : 1);
            if (i % showEvery === 0 || i === this.chartData.length - 1) {
                ctx.fillText(label, p.x, padding.top + chartHeight + 20);
            }
        });

        ctx.setTransform(1, 0, 0, 1, 0, 0); // 重置缩放
    }

    /**
     * 绑定期间选择器
     */
    bindPeriodSelector() {
        const periodBtns = dom.$$('.period-btn');
        periodBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const period = parseInt(btn.dataset.period);
                this.updateChartPeriod(period);

                // 更新按钮状态
                periodBtns.forEach(b => dom.removeClass(b, 'active'));
                dom.addClass(btn, 'active');
            });
        });
    }

    /**
     * 更新图表周期
     */
    updateChartPeriod(period) {
        this.currentPeriod = period;
        this.chartData = this.generateMockTrafficData(period);
        this.drawTrafficChart();
    }

    /**
     * 绑定图表交互
     */
    bindChartInteraction() {
        const canvas = dom.$('#traffic-chart-canvas');
        if (!canvas) return;

        // 创建tooltip元素
        let tooltip = dom.$('.chart-tooltip');
        if (!tooltip) {
            tooltip = dom.create('div', { className: 'chart-tooltip' });
            canvas.parentElement.appendChild(tooltip);
        }

        // 鼠标移动事件
        canvas.addEventListener('mousemove', (e) => {
            if (!this.chartPoints) return;

            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // 查找最近的数据点
            let nearestPoint = null;
            let minDistance = Infinity;

            this.chartPoints.forEach(p => {
                const dx = p.x - x;
                const dyUpload = p.uploadY - y;
                const dyDownload = p.downloadY - y;

                const distUpload = Math.sqrt(dx * dx + dyUpload * dyUpload);
                const distDownload = Math.sqrt(dx * dx + dyDownload * dyDownload);

                const dist = Math.min(distUpload, distDownload);

                if (dist < minDistance && dist < 20) {
                    minDistance = dist;
                    nearestPoint = p;
                }
            });

            if (nearestPoint) {
                // 显示tooltip
                const date = nearestPoint.data.date;
                const dateStr = `${date.getMonth() + 1}月${date.getDate()}日`;

                tooltip.innerHTML = `
                    <div class="chart-tooltip-date">${dateStr}</div>
                    <div class="chart-tooltip-value">
                        <div class="dot" style="background: #4facfe;"></div>
                        上传: ${nearestPoint.data.upload.toFixed(2)} GB
                    </div>
                    <div class="chart-tooltip-value">
                        <div class="dot" style="background: #667eea;"></div>
                        下载: ${nearestPoint.data.download.toFixed(2)} GB
                    </div>
                `;

                tooltip.style.left = (e.clientX - rect.left + 10) + 'px';
                tooltip.style.top = (e.clientY - rect.top - 60) + 'px';
                dom.addClass(tooltip, 'visible');
            } else {
                dom.removeClass(tooltip, 'visible');
            }
        });

        // 鼠标离开事件
        canvas.addEventListener('mouseleave', () => {
            dom.removeClass(tooltip, 'visible');
        });
    }
}


// 创建全局实例
const dashboard = new Dashboard();

// 导出
export default dashboard;

// 也挂载到window供HTML调用
window.dashboard = dashboard;
