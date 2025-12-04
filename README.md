# VPS管理平台 (DiceCloud)

一个现代化的全栈VPS管理平台，采用React前端 + Go后端架构，支持用户认证、订阅管理、节点管理等完整功能。

![VPS Platform](https://img.shields.io/badge/version-2.0.0-blue) ![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white) ![Go](https://img.shields.io/badge/Go-1.21-00ADD8?logo=go&logoColor=white) ![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white) ![Redis](https://img.shields.io/badge/Redis-7.0-DC382D?logo=redis&logoColor=white)

## ✨ 特性

- 🎨 **现代化React界面** - 采用深色主题、渐变色和玻璃态效果
- 📱 **响应式布局** - 完美适配桌面端和移动端
- ⚡ **高性能Go后端** - 基于Gin框架，支持高并发
- 🔐 **完整认证系统** - JWT认证、邮箱验证、密码找回
- � **订阅管理** - 套餐购买、续费、流量统计
- 🌐 **节点管理** - 多地区节点、延迟检测、负载均衡
- �️ **双数据库支持** - MySQL持久化 + Redis缓存
- 🐳 **Docker容器化** - 一键部署，环境隔离

## 📁 项目结构

```
vps/
├── vps-react/                  # React前端项目
│   ├── src/
│   │   ├── components/         # React组件
│   │   │   ├── auth/          # 认证相关组件
│   │   │   │   ├── Login.jsx  # 登录页面
│   │   │   │   ├── Register.jsx  # 注册页面
│   │   │   │   └── ForgotPassword.jsx  # 忘记密码
│   │   │   └── layout/        # 布局组件
│   │   ├── pages/             # 页面组件
│   │   ├── services/          # API服务
│   │   ├── styles/            # 样式文件
│   │   └── main.jsx           # 应用入口
│   ├── vite.config.js         # Vite配置
│   └── package.json
│
├── vps-backend/               # Go后端项目
│   ├── cmd/
│   │   └── server/
│   │       └── main.go        # 服务入口
│   ├── internal/
│   │   ├── config/            # 配置管理
│   │   ├── database/          # 数据库连接
│   │   ├── handler/           # HTTP处理器
│   │   ├── middleware/        # 中间件
│   │   ├── model/             # 数据模型
│   │   ├── repository/        # 数据访问层
│   │   ├── service/           # 业务逻辑层
│   │   └── util/              # 工具函数
│   ├── scripts/
│   │   ├── start.sh           # 启动脚本
│   │   └── stop.sh            # 停止脚本
│   ├── go.mod
│   └── docker-compose.yml     # Docker编排
│
└── API_DOCUMENTATION.md       # API接口文档
```

## 🚀 快速开始

### 环境要求

- **前端**: Node.js 18+ & npm/yarn
- **后端**: Go 1.21+, Docker & Docker Compose
- **数据库**: MySQL 8.0+, Redis 7.0+

### 后端启动

1. 进入后端目录：
```bash
cd vps-backend
```

2. 启动Docker服务（MySQL + Redis）：
```bash
docker-compose up -d
```

3. 启动Go服务：
```bash
./scripts/start.sh
```

后端将运行在 `http://localhost:8080`

### 前端启动

1. 进入前端目录：
```bash
cd vps-react
```

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm run dev
```

前端将运行在 `http://localhost:5173`

### 停止服务

```bash
# 停止后端
cd vps-backend
./scripts/stop.sh

# 停止Docker
docker-compose down
```

## 📱 已实现功能

### 用户认证 ✅
- ✅ 邮箱登录
- ✅ 用户注册（邮箱验证码）
- ✅ 忘记密码（邮箱找回）
- ✅ JWT认证
- ✅ 密码加密（bcrypt）
- ✅ 用户登出

### 用户中心 ✅
- ✅ 个人信息展示
- ✅ 头像上传
- ✅ 用户名修改
- ✅ 密码修改
- ✅ 账户余额管理

### 订阅管理 ✅
- ✅ 套餐列表展示
- ✅ 订阅购买
- ✅ 订阅续费
- ✅ 流量使用统计
- ✅ 订阅有效期管理
- ✅ 一键复制订阅链接

### 节点管理 ✅
- ✅ 节点列表
- ✅ 节点状态监控
- ✅ 延迟检测
- ✅ 多地区节点支持

### 其他功能 ✅
- ✅ 仪表板数据统计
- ✅ 公告系统
- ✅ 订单管理
- ✅ 客户端下载

## 🎨 设计特点

### 前端技术栈
- **React 18** - 使用Hooks和函数组件
- **React Router** - SPA路由管理
- **CSS Modules** - 组件样式隔离
- **Vite** - 快速构建工具
- **Axios** - HTTP请求库

### 后端技术栈
- **Gin** - 高性能Web框架
- **GORM** - ORM数据库操作
- **JWT** - JSON Web Token认证
- **Redis** - 缓存和会话管理
- **MySQL** - 关系型数据库
- **Bcrypt** - 密码加密

### 颜色系统
- **主色调**: 渐变紫蓝色 (#667eea → #764ba2)
- **背景色**: 深色主题 (#0f1419, #1a1f2e, #252b3b)
- **强调色**: 成功(绿)、警告(橙)、错误(红)、信息(蓝)

## 🔌 API接口

详细API文档请参考 [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### 认证接口
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `POST /api/auth/send-code` - 发送验证码
- `POST /api/auth/verify-code` - 验证验证码
- `POST /api/auth/reset-password` - 重置密码

### 用户接口
- `GET /api/user/info` - 获取用户信息
- `PUT /api/user/info` - 更新用户信息
- `PUT /api/user/password` - 修改密码
- `POST /api/user/avatar` - 上传头像

### 订阅接口
- `GET /api/subscriptions` - 获取订阅列表
- `GET /api/subscriptions/plans` - 获取套餐列表
- `POST /api/subscriptions/purchase` - 购买订阅
- `POST /api/subscriptions/renew` - 续费订阅
- `GET /api/subscriptions/link` - 获取订阅链接

### 节点接口
- `GET /api/nodes` - 获取节点列表
- `GET /api/nodes/:id` - 获取节点详情
- `POST /api/nodes/test-latency` - 测试节点延迟

### 账户接口
- `GET /api/account/balance` - 获取账户余额
- `GET /api/account/traffic` - 获取流量使用情况
- `POST /api/account/recharge` - 账户充值

## �️ 开发指南

### 添加新的React页面

1. 在 `src/pages/` 创建新组件：
```jsx
// src/pages/NewPage.jsx
export default function NewPage() {
  return (
    <div>
      <h1>新页面</h1>
    </div>
  );
}
```

2. 在路由中注册（`src/main.jsx`）：
```jsx
import NewPage from './pages/NewPage';

// 添加路由
<Route path="/new-page" element={<NewPage />} />
```

### 添加新的Go API

1. 定义数据模型（`internal/model/`）
2. 创建Repository（`internal/repository/`）
3. 实现Service逻辑（`internal/service/`）
4. 创建Handler（`internal/handler/`）
5. 注册路由（`cmd/server/main.go`）

### 环境变量配置

#### 后端环境变量 (`.env`)
```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=vps_user
DB_PASSWORD=vps_password
DB_NAME=vps_db

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT配置
JWT_SECRET=your-secret-key
JWT_EXPIRE_HOURS=24

# 服务器配置
SERVER_PORT=8080
```

#### 前端环境变量 (`.env`)
```env
VITE_API_BASE_URL=http://localhost:8080
```

## 🎯 待实现功能

- [ ] 支付网关集成（支付宝、微信支付）
- [ ] 工单系统
- [ ] 推荐奖励系统
- [ ] 多语言支持（i18n）
- [ ] 管理员后台
- [ ] 使用统计图表（ECharts）
- [ ] 邮件通知系统
- [ ] WebSocket实时通知
- [ ] API限流和防护
- [ ] 日志审计系统

## 🐳 Docker部署

### 完整部署（前后端+数据库）

```bash
# 构建并启动所有服务
docker-compose up -d --build

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 仅数据库服务

```bash
cd vps-backend
docker-compose up -d mysql redis
```

## 📊 数据库设计

### 主要数据表

- `users` - 用户表
- `subscriptions` - 订阅表
- `plans` - 套餐表
- `nodes` - 节点表
- `orders` - 订单表
- `transactions` - 交易记录表
- `announcements` - 公告表

详细的数据库Schema请查看 `vps-backend/scripts/schema.sql`

## 📄 许可证

MIT License

## 👨‍💻 作者

VPS Platform Team

## 🤝 贡献

欢迎提交Issue和Pull Request！

### 贡献指南

1. Fork本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交Pull Request

## 📞 联系方式

- 项目主页: [GitHub Repository]
- 问题反馈: [Issues]
- 邮箱: support@dicecloud.com

---

**生产环境部署提示**:
- 修改所有默认密码和密钥
- 启用HTTPS（使用Let's Encrypt）
- 配置防火墙规则
- 定期备份数据库
- 监控系统性能和日志
- 设置错误告警机制
