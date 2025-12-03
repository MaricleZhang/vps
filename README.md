# VPS管理平台 (DiceCloud)

一个现代化的VPS管理平台前端界面，采用深色主题设计，支持响应式布局。

![VPS Platform](https://img.shields.io/badge/version-1.0.0-blue) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## ✨ 特性

- 🎨 **现代化UI设计** - 采用深色主题、渐变色和玻璃态效果
- 📱 **响应式布局** - 完美适配桌面端和移动端
- ⚡ **流畅动画** - 精心设计的微动画提升用户体验
- 🔌 **API就绪** - 完整的后端接口预留和文档
- 🚀 **零依赖** - 纯HTML/CSS/JavaScript实现，无需框架
- 🎯 **模块化架构** - 清晰的代码组织和可维护性

## 📁 项目结构

```
vps/
├── index.html              # 主页面
├── css/
│   ├── style.css           # 主样式表（设计系统、布局）
│   └── components.css      # 组件样式库
├── js/
│   ├── app.js              # 主应用逻辑（路由、导航）
│   ├── dashboard.js        # 首页控制器
│   ├── api.js              # API接口封装
│   └── utils.js            # 工具函数库
└── API_DOCUMENTATION.md    # 后端API接口文档
```

## 🚀 快速开始

### 本地运行

1. 克隆或下载项目

2. 启动本地服务器：

```bash
cd vps
python3 -m http.server 8000
```

3. 在浏览器访问：
```
http://localhost:8000
```

### 使用Node.js（可选）

如果你更喜欢使用Node.js：

```bash
npx -y http-server -p 8000
```

## 📱 功能模块

### 1. 首页仪表板
- ✅ 账户余额显示
- ✅ 流量使用情况（带进度条）
- ✅ 订阅过期时间
- ✅ 公告栏
- ✅ 订阅管理

### 2. 快捷操作
- ✅ Shadowrocket订阅
- ✅ Stash订阅
- ✅ Clash订阅
- ✅ 一键复制订阅链接

### 3. 平台选择
- ✅ Windows客户端
- ✅ macOS客户端
- ✅ iOS客户端
- ✅ Android客户端
- ✅ Linux客户端
- ✅ OpenWrt客户端

### 4. 侧边栏导航
- ✅ 首页
- ✅ 使用文档
- ✅ 购买订阅
- ✅ 节点优选
- ✅ 个人中心
- ✅ 我的订单

## 🎨 设计特点

### 颜色系统
- **主色调**: 渐变紫蓝色 (#667eea → #764ba2)
- **背景色**: 深色主题 (#0f1419, #1a1f2e, #252b3b)
- **强调色**: 成功(绿)、警告(橙)、错误(红)、信息(蓝)

### 视觉效果
- 玻璃态卡片 (backdrop-filter)
- 流畅的悬停动画
- 渐变色按钮
- 进度条动画
- 微动效

### 响应式断点
- **移动端**: ≤ 768px
- **平板**: 769px - 1024px
- **桌面**: ≥ 1025px

## 🔌 后端API集成

所有API接口已在 `js/api.js` 中预留，详细文档请参考 [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### 主要接口模块

1. **用户相关** (`/api/user/*`)
   - 获取用户信息
   - 更新用户信息
   - 修改密码

2. **账户相关** (`/api/account/*`)
   - 获取余额
   - 流量使用情况
   - 账户统计
   - 充值

3. **订阅相关** (`/api/subscriptions/*`)
   - 订阅列表
   - 可用套餐
   - 购买订阅
   - 续费订阅

4. **节点相关** (`/api/nodes/*`)
   - 节点列表
   - 节点详情
   - 延迟测试

5. **其他**
   - 公告管理
   - 客户端下载
   - 使用统计

### 配置后端URL

修改 `js/api.js` 中的配置：

```javascript
const API_CONFIG = {
  baseURL: '/api',  // 改为你的后端API地址
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};
```

## 🛠️ 技术栈

- **HTML5** - 语义化标签
- **CSS3** - Grid、Flexbox、自定义属性
- **JavaScript ES6+** - 模块化、异步/等待
- **Font Awesome** - 图标库

## 📝 开发指南

### 添加新页面

1. 在 `app.js` 中添加页面加载函数：

```javascript
loadNewPage() {
  const content = dom.$('.content');
  content.innerHTML = `
    <div class="card">
      <h2>新页面标题</h2>
      <p>页面内容...</p>
    </div>
  `;
}
```

2. 在路由中注册：

```javascript
case 'newpage':
  this.loadNewPage();
  break;
```

3. 在HTML中添加导航项：

```html
<div class="nav-item" data-page="newpage">
  <div class="nav-item-icon">
    <i class="fas fa-star"></i>
  </div>
  <span>新页面</span>
</div>
```

### 添加新组件

在 `css/components.css` 中定义组件样式，遵循BEM命名规范。

### 添加新API接口

在 `js/api.js` 的 `api` 对象中添加：

```javascript
export const api = {
  // ... 现有接口
  
  newModule: {
    getData() {
      return http.get('/new-module/data');
    }
  }
};
```

## 🎯 待实现功能

- [ ] 登录/注册页面
- [ ] 订单支付流程
- [ ] 节点选择页面
- [ ] 使用统计图表
- [ ] 工单系统
- [ ] 多语言支持

## 📄 许可证

MIT License

## 👨‍💻 作者

VPS Platform Team

## 🤝 贡献

欢迎提交Issue和Pull Request！

---

**注意**: 这是一个前端演示项目，包含模拟数据。在生产环境中需要连接真实的后端API。
