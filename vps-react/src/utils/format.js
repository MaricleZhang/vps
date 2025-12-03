/**
 * 格式化工具函数
 */

/**
 * 日期格式化
 */
export function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
    const d = new Date(date);

    if (isNaN(d.getTime())) {
        return '无效日期';
    }

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
}

/**
 * 计算距离现在的时间差
 */
export function timeFromNow(date) {
    const d = new Date(date);
    const now = new Date();
    const diff = d.getTime() - now.getTime();

    if (diff < 0) {
        return '已过期';
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
        return `${days}天`;
    } else if (hours > 0) {
        return `${hours}小时`;
    } else {
        return '不足1小时';
    }
}

/**
 * 流量单位转换
 */
export function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * 货币格式化
 */
export function formatCurrency(amount, currency = 'CNY', decimals = 2) {
    const symbols = {
        'CNY': '¥',
        'USD': '$',
        'EUR': '€'
    };

    const symbol = symbols[currency] || currency;
    const parts = amount.toFixed(decimals).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return `${symbol}${parts.join('.')}`;
}

/**
 * 百分比格式化
 */
export function formatPercentage(value, total, decimals = 1) {
    if (total === 0) return '0%';

    const percentage = (value / total) * 100;
    return `${percentage.toFixed(decimals)}%`;
}

/**
 * 获取流量状态
 */
export function getTrafficStatus(used, total) {
    const percent = (used / total) * 100;

    if (percent >= 90) {
        return {
            level: 'critical',
            color: 'error',
            warning: true,
            message: '流量即将耗尽，请及时充值'
        };
    }

    if (percent >= 80) {
        return {
            level: 'warning',
            color: 'warning',
            warning: true,
            message: '流量使用已超过80%'
        };
    }

    return {
        level: 'normal',
        color: 'success',
        warning: false,
        message: ''
    };
}

/**
 * 数字格式化（千分位）
 */
export function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 复制到剪贴板
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('复制失败:', error);
        return false;
    }
}

/**
 * 防抖函数
 */
export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 节流函数
 */
export function throttle(func, limit = 300) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
