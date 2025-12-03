/**
 * VPS管理平台 - 工具函数库
 * 提供通用的辅助函数
 */

/**
 * 日期格式化
 * @param {Date|string|number} date - 日期对象或时间戳
 * @param {string} format - 格式字符串，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 格式化后的日期字符串
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
 * @param {Date|string|number} date - 目标日期
 * @returns {string} 人性化的时间描述
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
 * @param {number} bytes - 字节数
 * @param {number} decimals - 小数位数，默认2位
 * @returns {string} 格式化后的流量字符串
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
 * @param {number} amount - 金额
 * @param {string} currency - 货币符号，默认'CNY'
 * @param {number} decimals - 小数位数，默认2位
 * @returns {string} 格式化后的货币字符串
 */
export function formatCurrency(amount, currency = 'CNY', decimals = 2) {
  const symbols = {
    'CNY': '¥',
    'USD': '$',
    'EUR': '€'
  };

  const symbol = symbols[currency] || currency;

  // 添加千分位分隔符
  const parts = amount.toFixed(decimals).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return `${symbol}${parts.join('.')}`;
}

/**
 * 百分比格式化
 * @param {number} value - 值
 * @param {number} total - 总数
 * @param {number} decimals - 小数位数，默认1位
 * @returns {string} 百分比字符串
 */
export function formatPercentage(value, total, decimals = 1) {
  if (total === 0) return '0%';

  const percentage = (value / total) * 100;
  return `${percentage.toFixed(decimals)}%`;
}

/**
 * 获取流量状态
 * @param {number} used - 已使用流量
 * @param {number} total - 总流量
 * @returns {object} 状态对象 { level, color, warning }
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
 * @param {number} num - 数字
 * @returns {string} 格式化后的数字字符串
 */
export function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 本地存储封装
 */
export const storage = {
  /**
   * 设置存储项
   * @param {string} key - 键名
   * @param {any} value - 值（会自动序列化）
   */
  set(key, value) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error('存储失败:', error);
    }
  },

  /**
   * 获取存储项
   * @param {string} key - 键名
   * @param {any} defaultValue - 默认值
   * @returns {any} 解析后的值
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('读取失败:', error);
      return defaultValue;
    }
  },

  /**
   * 删除存储项
   * @param {string} key - 键名
   */
  remove(key) {
    localStorage.removeItem(key);
  },

  /**
   * 清空所有存储
   */
  clear() {
    localStorage.clear();
  }
};

/**
 * DOM操作辅助函数
 */
export const dom = {
  /**
   * 查询单个元素
   * @param {string} selector - 选择器
   * @param {Element} parent - 父元素，默认为document
   * @returns {Element|null}
   */
  $(selector, parent = document) {
    return parent.querySelector(selector);
  },

  /**
   * 查询多个元素
   * @param {string} selector - 选择器
   * @param {Element} parent - 父元素，默认为document
   * @returns {NodeList}
   */
  $$(selector, parent = document) {
    return parent.querySelectorAll(selector);
  },

  /**
   * 添加类名
   * @param {Element} element - 元素
   * @param {string} className - 类名
   */
  addClass(element, className) {
    element.classList.add(className);
  },

  /**
   * 移除类名
   * @param {Element} element - 元素
   * @param {string} className - 类名
   */
  removeClass(element, className) {
    element.classList.remove(className);
  },

  /**
   * 切换类名
   * @param {Element} element - 元素
   * @param {string} className - 类名
   */
  toggleClass(element, className) {
    element.classList.toggle(className);
  },

  /**
   * 判断是否包含类名
   * @param {Element} element - 元素
   * @param {string} className - 类名
   * @returns {boolean}
   */
  hasClass(element, className) {
    return element.classList.contains(className);
  },

  /**
   * 创建元素
   * @param {string} tag - 标签名
   * @param {object} attrs - 属性对象
   * @param {string|Element} content - 内容
   * @returns {Element}
   */
  create(tag, attrs = {}, content = '') {
    const element = document.createElement(tag);

    Object.keys(attrs).forEach(key => {
      if (key === 'className') {
        element.className = attrs[key];
      } else if (key === 'style' && typeof attrs[key] === 'object') {
        Object.assign(element.style, attrs[key]);
      } else {
        element.setAttribute(key, attrs[key]);
      }
    });

    if (typeof content === 'string') {
      element.innerHTML = content;
    } else if (content instanceof Element) {
      element.appendChild(content);
    }

    return element;
  }
};

/**
 * 防抖函数
 * @param {Function} func - 要执行的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function}
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
 * @param {Function} func - 要执行的函数
 * @param {number} limit - 时间间隔（毫秒）
 * @returns {Function}
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

/**
 * 深拷贝对象
 * @param {any} obj - 要拷贝的对象
 * @returns {any}
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }

  if (obj instanceof Object) {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
}

/**
 * URL参数解析
 * @param {string} url - URL字符串，默认为当前URL
 * @returns {object} 参数对象
 */
export function parseUrlParams(url = window.location.href) {
  const params = {};
  const urlObj = new URL(url);

  for (const [key, value] of urlObj.searchParams) {
    params[key] = value;
  }

  return params;
}

/**
 * 生成随机ID
 * @param {number} length - 长度，默认8位
 * @returns {string}
 */
export function generateId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

/**
 * 复制到剪贴板
 * @param {string} text - 要复制的文本
 * @returns {Promise<boolean>}
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
 * 显示提示消息
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型：success/error/warning/info
 * @param {number} duration - 显示时长（毫秒），默认3000
 */
export function showToast(message, type = 'info', duration = 3000) {
  // 移除旧的提示
  const oldToast = document.querySelector('.toast');
  if (oldToast) {
    oldToast.remove();
  }

  // 创建提示元素
  const toast = dom.create('div', {
    className: `toast toast-${type}`,
    style: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 24px',
      borderRadius: '8px',
      backgroundColor: type === 'success' ? '#10b981' :
        type === 'error' ? '#ef4444' :
          type === 'warning' ? '#f59e0b' : '#3b82f6',
      color: 'white',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      zIndex: '9999',
      animation: 'slideIn 0.3s ease-out',
      fontWeight: '500'
    }
  }, message);

  document.body.appendChild(toast);

  // 自动移除
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// 添加动画样式
if (!document.getElementById('toast-animations')) {
  const style = document.createElement('style');
  style.id = 'toast-animations';
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}
