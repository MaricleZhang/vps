/**
 * VPS管理平台 - 节点优选逻辑
 * 处理节点列表展示和状态监控
 */

import { dom, showToast } from './utils.js';

class Nodes {
    constructor() {
        this.nodes = [];
        this.filter = 'all';
    }

    /**
     * 初始化节点页面
     */
    async init() {
        try {
            // 加载节点数据
            await this.loadNodes();
            // 渲染页面
            this.render();
            // 绑定事件
            this.bindEvents();
        } catch (error) {
            console.error('节点页面初始化失败:', error);
            showToast('加载节点数据失败', 'error');
        }
    }

    /**
     * 加载节点数据 (模拟)
     */
    async loadNodes() {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 500));

        // 模拟节点数据
        this.nodes = [
            {
                id: 1,
                name: '香港 HK 01 [高速]',
                group: '香港',
                flag: 'hk',
                type: 'vless',
                latency: 45,
                load: 35,
                tags: ['流媒体解锁', '低倍率'],
                status: 'online'
            },
            {
                id: 2,
                name: '香港 HK 02 [原生]',
                group: '香港',
                flag: 'hk',
                type: 'vmess',
                latency: 52,
                load: 68,
                tags: ['Netflix', 'Disney+'],
                status: 'online'
            },
            {
                id: 3,
                name: '日本 JP 01 [软银]',
                group: '日本',
                flag: 'jp',
                type: 'trojan',
                latency: 89,
                load: 42,
                tags: ['Softbank', '游戏优化'],
                status: 'online'
            },
            {
                id: 4,
                name: '日本 JP 02 [IIJ]',
                group: '日本',
                flag: 'jp',
                type: 'vless',
                latency: 95,
                load: 25,
                tags: ['IIJ'],
                status: 'online'
            },
            {
                id: 5,
                name: '美国 US 01 [CN2]',
                group: '美国',
                flag: 'us',
                type: 'shadowsocks',
                latency: 168,
                load: 15,
                tags: ['CN2 GIA', '4K秒开'],
                status: 'online'
            },
            {
                id: 6,
                name: '美国 US 02 [9929]',
                group: '美国',
                flag: 'us',
                type: 'vmess',
                latency: 175,
                load: 10,
                tags: ['联通9929'],
                status: 'online'
            },
            {
                id: 7,
                name: '新加坡 SG 01',
                group: '新加坡',
                flag: 'sg',
                type: 'trojan',
                latency: 120,
                load: 55,
                tags: ['ChatGPT'],
                status: 'online'
            },
            {
                id: 8,
                name: '韩国 KR 01',
                group: '韩国',
                flag: 'kr',
                type: 'vless',
                latency: 65,
                load: 88,
                tags: ['Oracle'],
                status: 'warning' // 负载高
            }
        ];
    }

    /**
     * 渲染页面
     */
    render() {
        const content = dom.$('.content');
        if (!content) return;

        content.innerHTML = `
            <div class="nodes-header mb-xl">
                <div>
                    <h2 class="text-xl font-bold mb-xs">节点优选</h2>
                    <p class="text-secondary text-sm">实时监控全球节点状态，智能选择最佳线路</p>
                </div>
                <div class="nodes-actions">
                    <button class="btn btn-secondary btn-sm" onclick="nodesManager.checkAllLatency()">
                        <i class="fas fa-bolt"></i> 测试延迟
                    </button>
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" placeholder="搜索节点..." id="node-search">
                    </div>
                </div>
            </div>

            <div class="nodes-filter mb-lg">
                <button class="filter-btn active" data-group="all">全部</button>
                <button class="filter-btn" data-group="香港">香港</button>
                <button class="filter-btn" data-group="日本">日本</button>
                <button class="filter-btn" data-group="美国">美国</button>
                <button class="filter-btn" data-group="新加坡">新加坡</button>
                <button class="filter-btn" data-group="韩国">韩国</button>
            </div>

            <div id="nodes-list" class="nodes-grid">
                <!-- 节点列表将通过JS渲染 -->
            </div>
        `;

        this.renderNodeList();
    }

    /**
     * 渲染节点列表
     */
    renderNodeList() {
        const container = dom.$('#nodes-list');
        if (!container) return;

        let filteredNodes = this.nodes;

        // 过滤分组
        if (this.filter !== 'all') {
            filteredNodes = filteredNodes.filter(node => node.group === this.filter);
        }

        // 搜索过滤
        const searchInput = dom.$('#node-search');
        if (searchInput && searchInput.value) {
            const keyword = searchInput.value.toLowerCase();
            filteredNodes = filteredNodes.filter(node =>
                node.name.toLowerCase().includes(keyword) ||
                node.tags.some(tag => tag.toLowerCase().includes(keyword))
            );
        }

        if (filteredNodes.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-server"></i>
                    <p>未找到匹配的节点</p>
                </div>
            `;
            return;
        }

        const html = filteredNodes.map(node => this.createNodeCard(node)).join('');
        container.innerHTML = html;
    }

    /**
     * 创建节点卡片HTML
     */
    createNodeCard(node) {
        // 根据延迟计算颜色
        let latencyClass = 'success';
        if (node.latency > 100) latencyClass = 'warning';
        if (node.latency > 200) latencyClass = 'error';

        // 根据负载计算颜色
        let loadClass = 'success';
        if (node.load > 50) loadClass = 'warning';
        if (node.load > 80) loadClass = 'error';

        // 标签HTML
        const tagsHtml = node.tags.map(tag => `<span class="node-tag">${tag}</span>`).join('');

        return `
            <div class="node-card card">
                <div class="node-header">
                    <div class="node-flag">
                        <span class="flag-icon flag-icon-${node.flag}"></span>
                        <img src="https://flagcdn.com/w40/${node.flag}.png" alt="${node.group}" class="flag-img">
                    </div>
                    <div class="node-info">
                        <div class="node-name">${node.name}</div>
                        <div class="node-tags">${tagsHtml}</div>
                    </div>
                    <div class="node-status ${node.status}">
                        <i class="fas fa-circle"></i>
                    </div>
                </div>
                
                <div class="node-metrics">
                    <div class="metric-item">
                        <div class="metric-label">延迟</div>
                        <div class="metric-value ${latencyClass}">
                            <i class="fas fa-signal"></i> ${node.latency}ms
                        </div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-label">负载</div>
                        <div class="metric-value ${loadClass}">
                            <i class="fas fa-tachometer-alt"></i> ${node.load}%
                        </div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-label">倍率</div>
                        <div class="metric-value">
                            <i class="fas fa-percentage"></i> 1.0x
                        </div>
                    </div>
                </div>

                <div class="node-actions">
                    <button class="btn btn-sm btn-secondary btn-block" onclick="nodesManager.copyLink(${node.id})">
                        <i class="fas fa-copy"></i> 复制链接
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 过滤器点击事件
        const filterBtns = dom.$$('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // 更新激活状态
                filterBtns.forEach(b => dom.removeClass(b, 'active'));
                dom.addClass(btn, 'active');

                // 更新过滤器并重新渲染
                this.filter = btn.dataset.group;
                this.renderNodeList();
            });
        });

        // 搜索框输入事件
        const searchInput = dom.$('#node-search');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.renderNodeList();
            });
        }
    }

    /**
     * 复制节点链接
     */
    copyLink(id) {
        const node = this.nodes.find(n => n.id === id);
        if (node) {
            const link = `${node.type}://${node.id}@${node.group}:443`; // 模拟链接
            navigator.clipboard.writeText(link).then(() => {
                showToast(`✅ 已复制 ${node.name} 链接`, 'success');
            }).catch(() => {
                showToast('❌ 复制失败', 'error');
            });
        }
    }

    /**
     * 测试所有节点延迟（模拟）
     */
    async checkAllLatency() {
        showToast('正在测试节点延迟...', 'info');

        const latencyEls = dom.$$('.metric-value i.fa-signal');
        latencyEls.forEach(el => {
            const valueEl = el.parentElement;
            valueEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 测试中...';
        });

        await new Promise(resolve => setTimeout(resolve, 1500));

        // 重新渲染以恢复（并更新随机延迟）
        this.nodes = this.nodes.map(node => ({
            ...node,
            latency: Math.floor(Math.random() * 200) + 30
        }));
        this.renderNodeList();

        showToast('✅ 延迟测试完成', 'success');
    }
}

const nodesManager = new Nodes();
export default nodesManager;

// 挂载到window供HTML调用
window.nodesManager = nodesManager;
