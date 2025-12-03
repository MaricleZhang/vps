/**
 * VPS管理平台 - 主应用逻辑
 * 应用入口和全局管理
 */

import dashboard from './dashboard.js';
import shopManager from './shop.js';
import checkoutManager from './checkout.js';
import { dom } from './utils.js';

/**
 * 应用类
 */
class App {
    constructor() {
        this.currentPage = 'home';
        this.sidebarOpen = false;
    }

    /**
     * 初始化应用
     */
    async init() {
        console.log('🚀 VPS管理平台启动中...');

        // 检查登录状态
        this.checkAuth();

        // 绑定全局事件
        this.bindGlobalEvents();

        // 解析URL参数以确定初始页面
        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('page') || 'home';
        const params = {};
        for (const [key, value] of urlParams.entries()) {
            if (key !== 'page') params[key] = value;
        }

        // 初始化页面
        await this.loadPage(page, true, params);

        console.log('✅ 应用初始化完成');
    }

    /**
     * 检查认证状态
     */
    checkAuth() {
        const token = localStorage.getItem('access_token');

        // 如果没有token且不在登录页，跳转到登录页
        // 注意：这里暂时不实现跳转，因为我们还没有登录页
        if (!token) {
            console.log('ℹ️ 未检测到登录token，使用演示模式');
            // 设置一个模拟token用于演示
            localStorage.setItem('access_token', 'demo_token_' + Date.now());
        }
    }

    /**
     * 绑定全局事件
     */
    bindGlobalEvents() {
        // 移动端菜单切换
        const menuToggle = dom.$('.mobile-menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => this.toggleSidebar());
        }

        // 点击内容区域关闭侧边栏（移动端）
        const mainContent = dom.$('.main-content');
        if (mainContent) {
            mainContent.addEventListener('click', (e) => {
                if (window.innerWidth <= 768 && this.sidebarOpen) {
                    this.toggleSidebar();
                }
            });
        }

        // 导航菜单点击
        const navItems = dom.$$('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const page = item.dataset.page;
                if (page) {
                    this.navigateTo(page);
                }
            });
        });

        // 窗口大小改变
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.sidebarOpen) {
                this.closeSidebar();
            }
        });

        // 监听浏览器后退/前进
        window.addEventListener('popstate', (e) => {
            const page = e.state?.page || 'home';
            const params = e.state?.params || {};
            this.loadPage(page, false, params);
        });
    }

    /**
     * 切换侧边栏
     */
    toggleSidebar() {
        const sidebar = dom.$('.sidebar');
        if (!sidebar) return;

        this.sidebarOpen = !this.sidebarOpen;

        if (this.sidebarOpen) {
            dom.addClass(sidebar, 'open');
        } else {
            dom.removeClass(sidebar, 'open');
        }
    }

    /**
     * 关闭侧边栏
     */
    closeSidebar() {
        const sidebar = dom.$('.sidebar');
        if (!sidebar) return;

        this.sidebarOpen = false;
        dom.removeClass(sidebar, 'open');
    }

    /**
     * 导航到指定页面
     * @param {string} page - 页面名称
     */
    navigateTo(page, params = {}) {
        // 构建URL查询参数
        const urlParams = new URLSearchParams({ page, ...params });
        const url = `?${urlParams.toString()}`;

        // 更新URL（不刷新页面）
        history.pushState({ page, params }, '', url);

        // 加载页面
        this.loadPage(page, true, params);

        // 关闭移动端侧边栏
        if (window.innerWidth <= 768) {
            this.closeSidebar();
        }
    }

    /**
     * 加载页面
     * @param {string} page - 页面名称
     * @param {boolean} updateNav - 是否更新导航状态
     */
    async loadPage(page, updateNav = true, params = {}) {
        this.currentPage = page;

        // 更新导航激活状态
        if (updateNav) {
            this.updateNavState(page);
        }

        // 根据页面加载对应内容
        switch (page) {
            case 'home':
                // 重新初始化首页以刷新数据
                await dashboard.init();
                break;

            case 'docs':
                this.loadDocsPage();
                break;

            case 'subscribe':
                this.loadSubscribePage();
                break;

            case 'checkout':
                this.loadCheckoutPage(params);
                break;

            case 'nodes':
                this.loadNodesPage();
                break;

            case 'account':
                this.loadAccountPage();
                break;

            default:
                this.load404Page();
        }
    }

    /**
     * 更新导航激活状态
     * @param {string} page - 当前页面
     */
    updateNavState(page) {
        const navItems = dom.$$('.nav-item');

        navItems.forEach(item => {
            const itemPage = item.dataset.page;

            if (itemPage === page) {
                dom.addClass(item, 'active');
            } else {
                dom.removeClass(item, 'active');
            }
        });
    }

    /**
     * 加载文档页面
     */
    loadDocsPage() {
        const content = dom.$('.content');
        if (!content) return;

        content.innerHTML = `
      <div class="card">
        <h2 class="card-title mb-lg">使用文档</h2>
        <div class="text-secondary">
          <p class="mb-md">使用文档页面开发中...</p>
          <p>这里将展示VPS使用教程、客户端配置指南等内容。</p>
        </div>
      </div>
    `;
    }

    /**
     * 加载订阅页面
     */
    async loadSubscribePage() {
        // 初始化购买订阅页面
        await shopManager.init();
    }

    /**
     * 加载结账页面
     */
    async loadCheckoutPage(params) {
        // 初始化结账页面
        await checkoutManager.init(params.plan);
    }

    /**
     * 加载节点页面
     */
    loadNodesPage() {
        const content = dom.$('.content');
        if (!content) return;

        content.innerHTML = `
      <div class="card">
        <h2 class="card-title mb-lg">节点优选</h2>
        <div class="text-secondary">
          <p class="mb-md">节点优选页面开发中...</p>
          <p>这里将展示所有节点的状态、延迟和负载信息。</p>
        </div>
      </div>
    `;
    }

    /**
     * 加载账户页面
     */
    loadAccountPage() {
        const content = dom.$('.content');
        if (!content) return;

        content.innerHTML = `
      <div class="card">
        <h2 class="card-title mb-lg">个人中心</h2>
        <div class="text-secondary">
          <p class="mb-md">个人中心页面开发中...</p>
          <p>这里将展示用户信息、账户设置等内容。</p>
        </div>
      </div>
    `;
    }

    /**
     * 加载404页面
     */
    load404Page() {
        const content = dom.$('.content');
        if (!content) return;

        content.innerHTML = `
      <div class="card" style="text-align: center; padding: 4rem 2rem;">
        <h1 style="font-size: 4rem; color: var(--text-tertiary); margin-bottom: 1rem;">404</h1>
        <p class="text-secondary mb-lg">页面未找到</p>
        <button class="btn btn-primary" onclick="app.navigateTo('home')">
          <i class="fas fa-home"></i> 返回首页
        </button>
      </div>
    `;
    }
}

// 创建应用实例
const app = new App();

// 导出
export default app;

// 挂载到window供HTML调用
window.app = app;

// DOM加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}
