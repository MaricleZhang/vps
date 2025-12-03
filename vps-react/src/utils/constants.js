/**
 * 常量定义
 */

// API 基础配置
export const API_CONFIG = {
    baseURL: '/api',
    timeout: 10000,
};

// 本地存储键名
export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'access_token',
    USER_INFO: 'user_info',
    THEME: 'theme',
};

// 订阅套餐数据
export const SUBSCRIPTION_PLANS = [
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

// 客户端平台列表
export const CLIENT_PLATFORMS = [
    {
        id: 'windows',
        name: 'Windows',
        icon: 'fa-windows',
        downloadUrl: 'https://example.com/windows-client.exe'
    },
    {
        id: 'macos',
        name: 'macOS',
        icon: 'fa-apple',
        downloadUrl: 'https://example.com/macos-client.dmg'
    },
    {
        id: 'ios',
        name: 'iOS',
        icon: 'fa-app-store-ios',
        downloadUrl: 'https://apps.apple.com/app/shadowrocket/id932747118'
    },
    {
        id: 'android',
        name: 'Android',
        icon: 'fa-android',
        downloadUrl: 'https://example.com/android-client.apk'
    },
    {
        id: 'linux',
        name: 'Linux',
        icon: 'fa-linux',
        downloadUrl: 'https://example.com/linux-client.tar.gz'
    },
    {
        id: 'openwrt',
        name: 'OpenWrt',
        icon: 'fa-router',
        downloadUrl: 'https://example.com/openwrt-client.ipk'
    }
];
