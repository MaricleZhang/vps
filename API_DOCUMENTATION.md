# VPS管理平台 - 后端API接口文档

本文档详细描述了VPS管理平台所需的所有后端API接口规范。前端代码已在 `js/api.js` 中预留了所有接口调用。

## 目录
- [认证机制](#认证机制)
- [通用响应格式](#通用响应格式)
- [错误码定义](#错误码定义)
- [用户相关接口](#1-用户相关接口)
- [账户相关接口](#2-账户相关接口)
- [订阅相关接口](#3-订阅相关接口)
- [节点相关接口](#4-节点相关接口)
- [公告相关接口](#5-公告相关接口)
- [下载相关接口](#6-下载相关接口)
- [统计相关接口](#7-统计相关接口)

---

## 认证机制

### JWT Token认证
所有需要认证的接口都需要在请求头中携带JWT Token：

```http
Authorization: Bearer <access_token>
```

### 获取Token
**接口**: `POST /api/auth/login`

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应**:
```json
{
  "code": 0,
  "message": "登录成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 7200
  }
}
```

### 刷新Token
**接口**: `POST /api/auth/refresh`

**请求体**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 通用响应格式

### 成功响应
```json
{
  "code": 0,
  "message": "success",
  "data": { /* 业务数据 */ }
}
```

### 错误响应
```json
{
  "code": 1001,
  "message": "error description",
  "data": null
}
```

---

## 错误码定义

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 1001 | 参数错误 |
| 1002 | 资源不存在 |
| 1003 | 权限不足 |
| 2001 | 未登录 |
| 2002 | Token过期 |
| 2003 | Token无效 |
| 3001 | 余额不足 |
| 3002 | 流量不足 |
| 3003 | 订阅已过期 |
| 5000 | 服务器内部错误 |

---

## 1. 用户相关接口

### 1.1 获取用户信息
**接口**: `GET /api/user/info`

**需要认证**: 是

**请求参数**: 无

**响应示例**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 12345,
    "username": "张三",
    "email": "zhangsan@example.com",
    "avatar": "https://example.com/avatar.jpg",
    "phone": "13800138000",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-12-01T15:20:00Z"
  }
}
```

### 1.2 更新用户信息
**接口**: `PUT /api/user/info`

**需要认证**: 是

**请求体**:
```json
{
  "username": "李四",
  "avatar": "https://example.com/new-avatar.jpg",
  "phone": "13900139000"
}
```

**响应**: 返回更新后的用户信息（格式同1.1）

### 1.3 修改密码
**接口**: `POST /api/user/change-password`

**需要认证**: 是

**请求体**:
```json
{
  "oldPassword": "old_password",
  "newPassword": "new_password"
}
```

**响应**:
```json
{
  "code": 0,
  "message": "密码修改成功",
  "data": null
}
```

---

## 2. 账户相关接口

### 2.1 获取账户余额
**接口**: `GET /api/account/balance`

**需要认证**: 是

**响应示例**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "balance": 128.50,
    "currency": "CNY",
    "frozenBalance": 0
  }
}
```

### 2.2 获取流量使用情况
**接口**: `GET /api/account/traffic`

**需要认证**: 是

**响应示例**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "used": 97345622016,
    "total": 79550488576,
    "percentage": 38.5,
    "resetDate": "2025-01-01T00:00:00Z",
    "unit": "bytes"
  }
}
```

### 2.3 获取账户统计信息
**接口**: `GET /api/account/stats`

**需要认证**: 是

**响应示例**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "balance": 128.50,
    "traffic": {
      "used": 97345622016,
      "total": 79550488576,
      "percentage": 38.5
    },
    "expireDate": "2025-12-26T23:59:59Z",
    "daysRemaining": 23
  }
}
```

### 2.4 充值
**接口**: `POST /api/account/recharge`

**需要认证**: 是

**请求体**:
```json
{
  "amount": 100.00,
  "method": "alipay"
}
```

**响应**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "orderId": "ORD20241203001",
    "amount": 100.00,
    "paymentUrl": "https://payment.example.com/pay?order=xxx",
    "qrCode": "https://example.com/qrcode.png"
  }
}
```

---

## 3. 订阅相关接口

### 3.1 获取订阅列表
**接口**: `GET /api/subscriptions`

**需要认证**: 是

**请求参数**: 无

**响应示例**:
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "轻量 Lite 50G",
      "type": "monthly",
      "price": 29.90,
      "traffic": 53687091200,
      "duration": 30,
      "status": "active",
      "expireDate": "2025-12-26T23:59:59Z",
      "subscribeUrl": "https://api.example.com/subscribe/abc123def456",
      "createdAt": "2024-11-26T10:00:00Z"
    }
  ]
}
```

### 3.2 获取可用套餐
**接口**: `GET /api/subscriptions/plans`

**需要认证**: 否（可公开访问）

**响应示例**:
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "入门套餐",
      "description": "适合轻度使用",
      "price": 19.90,
      "traffic": 32212254720,
      "duration": 30,
      "features": [
        "100+ 节点",
        "1Gbps 带宽",
        "不限设备数",
        "7x24小时客服"
      ],
      "popular": false
    },
    {
      "id": 2,
      "name": "标准套餐",
      "description": "性价比之选",
      "price": 39.90,
      "traffic": 107374182400,
      "duration": 30,
      "features": [
        "200+ 节点",
        "2Gbps 带宽",
        "不限设备数",
        "7x24小时客服",
        "专属线路"
      ],
      "popular": true
    }
  ]
}
```

### 3.3 购买订阅
**接口**: `POST /api/subscriptions/purchase`

**需要认证**: 是

**请求体**:
```json
{
  "planId": 2,
  "paymentMethod": "balance"
}
```

**响应**:
```json
{
  "code": 0,
  "message": "购买成功",
  "data": {
    "subscriptionId": 123,
    "orderId": "ORD20241203002",
    "expireDate": "2025-01-03T23:59:59Z"
  }
}
```

### 3.4 续费订阅
**接口**: `POST /api/subscriptions/renew`

**需要认证**: 是

**请求体**:
```json
{
  "subscriptionId": 123,
  "duration": 3
}
```

**响应**:
```json
{
  "code": 0,
  "message": "续费成功",
  "data": {
    "orderId": "ORD20241203003",
    "newExpireDate": "2026-04-03T23:59:59Z"
  }
}
```

### 3.5 取消订阅
**接口**: `DELETE /api/subscriptions/{subscriptionId}`

**需要认证**: 是

**响应**:
```json
{
  "code": 0,
  "message": "取消成功",
  "data": null
}
```

---

## 4. 节点相关接口

### 4.1 获取节点列表
**接口**: `GET /api/nodes`

**需要认证**: 是

**请求参数**:
- `location` (可选): 地理位置筛选，如 "HK", "US", "JP"
- `protocol` (可选): 协议类型筛选，如 "vmess", "trojan"
- `status` (可选): 状态筛选，如 "online", "offline"

**响应示例**:
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "香港 IEPL-01",
      "location": "HK",
      "country": "香港",
      "protocol": "vmess",
      "status": "online",
      "latency": 45,
      "load": 35,
      "bandwidth": "1Gbps",
      "online": true,
      "premium": true
    },
    {
      "id": 2,
      "name": "美国 CN2 GIA-01",
      "location": "US",
      "country": "美国",
      "protocol": "trojan",
      "status": "online",
      "latency": 180,
      "load": 58,
      "bandwidth": "10Gbps",
      "online": true,
      "premium": false
    }
  ]
}
```

### 4.2 获取节点详情
**接口**: `GET /api/nodes/{nodeId}`

**需要认证**: 是

**响应示例**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "name": "香港 IEPL-01",
    "location": "HK",
    "country": "香港",
    "city": "香港",
    "protocol": "vmess",
    "status": "online",
    "latency": 45,
    "load": 35,
    "bandwidth": "1Gbps",
    "onlineUsers": 120,
    "maxUsers": 500,
    "uptime": 99.95,
    "description": "香港IEPL专线，低延迟高稳定性",
    "features": ["游戏加速", "流媒体解锁", "ChatGPT可用"]
  }
}
```

### 4.3 测试节点延迟
**接口**: `POST /api/nodes/{nodeId}/test`

**需要认证**: 是

**响应**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "nodeId": 1,
    "latency": 42,
    "jitter": 3,
    "packetLoss": 0,
    "testTime": "2024-12-03T14:50:00Z"
  }
}
```

---

## 5. 公告相关接口

### 5.1 获取公告列表
**接口**: `GET /api/announcements`

**需要认证**: 否（可公开访问）

**请求参数**:
- `limit` (可选): 返回数量，默认10

**响应示例**:
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": 1,
      "title": "系统维护通知",
      "content": "因GFW新策略相继封杀，如您在对接服务端时遇到地址无法访问，请查看官网最新入门级地址。",
      "type": "warning",
      "link": "https://nycink.cc",
      "createdAt": "2024-12-01T10:00:00Z",
      "priority": 1,
      "sticky": true
    },
    {
      "id": 2,
      "title": "新增节点上线",
      "content": "日本IPLC专线节点已上线，欢迎体验。",
      "type": "info",
      "link": null,
      "createdAt": "2024-11-28T15:30:00Z",
      "priority": 2,
      "sticky": false
    }
  ]
}
```

### 5.2 标记公告已读
**接口**: `POST /api/announcements/{announcementId}/read`

**需要认证**: 是

**响应**:
```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

---

## 6. 下载相关接口

### 6.1 获取客户端下载链接
**接口**: `GET /api/downloads/{platform}`

**需要认证**: 否（可公开访问）

**路径参数**:
- `platform`: windows | macos | ios | android | linux | openwrt

**响应示例**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "platform": "windows",
    "version": "5.2.1",
    "downloadUrl": "https://cdn.example.com/clients/windows/v5.2.1/setup.exe",
    "fileSize": 52428800,
    "releaseDate": "2024-11-20T10:00:00Z",
    "changelog": "修复已知问题，提升稳定性",
    "checksum": "sha256:abc123def456..."
  }
}
```

### 6.2 获取所有平台下载链接
**接口**: `GET /api/downloads`

**需要认证**: 否（可公开访问）

**响应**: 返回所有平台的下载信息数组（格式同6.1）

---

## 7. 统计相关接口

### 7.1 获取使用统计
**接口**: `GET /api/stats/usage`

**需要认证**: 是

**请求参数**:
- `period`: day | week | month（默认week）

**响应示例**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "traffic": [
      { "date": "2024-11-27", "value": 5368709120 },
      { "date": "2024-11-28", "value": 6442450944 },
      { "date": "2024-11-29", "value": 4294967296 },
      { "date": "2024-11-30", "value": 7516192768 },
      { "date": "2024-12-01", "value": 5905580032 },
      { "date": "2024-12-02", "value": 6979321856 },
      { "date": "2024-12-03", "value": 3221225472 }
    ],
    "bandwidth": [
      { "date": "2024-11-27", "value": 125829120 },
      { "date": "2024-11-28", "value": 146800640 },
      { "date": "2024-11-29", "value": 104857600 },
      { "date": "2024-11-30", "value": 167772160 },
      { "date": "2024-12-01", "value": 134217728 },
      { "date": "2024-12-02", "value": 157286400 },
      { "date": "2024-12-03", "value": 83886080 }
    ],
    "connections": [
      { "date": "2024-11-27", "value": 1250 },
      { "date": "2024-11-28", "value": 1420 },
      { "date": "2024-11-29", "value": 980 },
      { "date": "2024-11-30", "value": 1680 },
      { "date": "2024-12-01", "value": 1340 },
      { "date": "2024-12-02", "value": 1560 },
      { "date": "2024-12-03", "value": 890 }
    ]
  }
}
```

---

## 数据模型说明

### User (用户)
```typescript
interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  phone?: string;
  createdAt: string;  // ISO 8601格式
  updatedAt: string;
}
```

### Subscription (订阅)
```typescript
interface Subscription {
  id: number;
  name: string;
  type: string;       // monthly, quarterly, yearly
  price: number;
  traffic: number;    // 字节
  duration: number;   // 天数
  status: string;     // active, expired, cancelled
  expireDate: string;
  subscribeUrl: string;
  createdAt: string;
}
```

### Node (节点)
```typescript
interface Node {
  id: number;
  name: string;
  location: string;   // 国家/地区代码
  country: string;
  protocol: string;   // vmess, trojan, shadowsocks等
  status: string;     // online, offline, maintenance
  latency: number;    // 延迟（毫秒）
  load: number;       // 负载百分比
  bandwidth: string;
  online: boolean;
  premium: boolean;
}
```

---

## 注意事项

1. **时间格式**: 所有时间字段均使用ISO 8601格式 (YYYY-MM-DDTHH:mm:ssZ)
2. **流量单位**: 所有流量数据以字节(bytes)为单位
3. **货币单位**: 默认使用人民币(CNY)
4. **分页**: 需要分页的接口应支持 `page` 和 `pageSize` 参数
5. **速率限制**: 建议对API调用实施速率限制，如每分钟60次请求
6. **CORS**: 生产环境需配置正确的CORS策略
7. **HTTPS**: 生产环境必须使用HTTPS协议

---

## 版本历史

- **v1.0.0** (2024-12-03): 初始版本，包含所有核心接口
