/**
 * 用户中心模块
 * 处理个人中心页面的渲染和交互
 */

import { dom } from './utils.js';

const userManager = {
    /**
     * 初始化用户中心页面
     */
    async init() {
        console.log('👤 初始化用户中心...');
        this.render();
        this.bindEvents();
    },

    /**
     * 渲染页面内容
     */
    render() {
        const content = dom.$('.content');
        if (!content) return;

        // 模拟用户数据
        const user = {
            username: 'ME',
            email: 'user@example.com',
            avatar: 'M',
            joinDate: '2023-12-01',
            balance: 0.00,
            currency: 'CNY',
            group: 'VIP用户'
        };

        content.innerHTML = `
            <div class="grid grid-cols-1 gap-lg">
                <!-- 个人资料卡片 -->
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">个人资料</h2>
                        <button class="btn btn-secondary btn-sm">
                            <i class="fas fa-edit"></i> 编辑资料
                        </button>
                    </div>
                    <div class="flex items-center gap-xl">
                        <div class="user-avatar-large" style="width: 80px; height: 80px; background: var(--gradient-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; color: white; font-weight: bold;">
                            ${user.avatar}
                        </div>
                        <div class="flex-1">
                            <div class="flex items-center gap-md mb-xs">
                                <h3 class="text-xl font-bold">${user.username}</h3>
                                <span class="badge badge-purple">${user.group}</span>
                            </div>
                            <p class="text-secondary mb-sm">${user.email}</p>
                            <p class="text-tertiary text-sm">注册时间: ${user.joinDate}</p>
                        </div>
                    </div>
                </div>

                <!-- 账户余额卡片 -->
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">账户余额</h2>
                        <button class="btn btn-primary btn-sm">
                            <i class="fas fa-plus"></i> 充值
                        </button>
                    </div>
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-tertiary mb-xs">当前余额</div>
                            <div class="text-3xl font-bold text-primary">
                                ${user.balance.toFixed(2)} <span class="text-lg text-secondary">${user.currency}</span>
                            </div>
                        </div>
                        <div class="flex gap-md">
                            <button class="btn btn-secondary">
                                <i class="fas fa-history"></i> 交易记录
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 安全设置 -->
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">安全设置</h2>
                    </div>
                    <div class="flex flex-col gap-md">
                        <div class="flex items-center justify-between p-md border rounded-lg" style="border-color: var(--border-color);">
                            <div class="flex items-center gap-md">
                                <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500" style="background: rgba(59, 130, 246, 0.1); color: var(--color-info);">
                                    <i class="fas fa-key"></i>
                                </div>
                                <div>
                                    <div class="font-medium">登录密码</div>
                                    <div class="text-sm text-tertiary">定期修改密码可以保护账户安全</div>
                                </div>
                            </div>
                            <button class="btn btn-secondary btn-sm js-change-password-btn">修改</button>
                        </div>

                        <div class="flex items-center justify-between p-md border rounded-lg" style="border-color: var(--border-color);">
                            <div class="flex items-center gap-md">
                                <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500" style="background: rgba(16, 185, 129, 0.1); color: var(--color-success);">
                                    <i class="fas fa-shield-alt"></i>
                                </div>
                                <div>
                                    <div class="font-medium">二步验证</div>
                                    <div class="text-sm text-tertiary">为您的账户提供额外的安全保障</div>
                                </div>
                            </div>
                            <button class="btn btn-secondary btn-sm">启用</button>
                        </div>
                    </div>
                </div>

                <!-- 退出登录 -->
                <div class="card">
                    <button class="btn btn-secondary w-full" style="color: var(--color-error); border-color: rgba(239, 68, 68, 0.3);">
                        <i class="fas fa-sign-out-alt"></i> 退出登录
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * 绑定事件
     */
    bindEvents() {
        // 绑定修改密码按钮事件
        const changePwdBtn = dom.$('.js-change-password-btn');
        if (changePwdBtn) {
            changePwdBtn.addEventListener('click', () => {
                this.renderChangePasswordModal();
            });
        }
    },

    /**
     * 渲染修改密码模态框
     */
    renderChangePasswordModal() {
        const modalHtml = `
            <div class="modal-overlay active" id="change-password-modal">
                <div class="modal">
                    <div class="modal-header">
                        <h3 class="modal-title">修改登录密码</h3>
                        <div class="modal-close">
                            <i class="fas fa-times"></i>
                        </div>
                    </div>
                    <div class="modal-body">
                        <form id="change-password-form">
                            <div class="form-group">
                                <label class="form-label">当前密码</label>
                                <input type="password" name="oldPassword" class="form-input" placeholder="请输入当前使用的密码" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">新密码</label>
                                <input type="password" name="newPassword" class="form-input" placeholder="请输入新密码（至少8位）" required minlength="8">
                                <div class="form-hint">密码长度至少8位，建议包含字母和数字</div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">确认新密码</label>
                                <input type="password" name="confirmPassword" class="form-input" placeholder="请再次输入新密码" required minlength="8">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" id="cancel-change-password">取消</button>
                        <button class="btn btn-primary" id="submit-change-password">确认修改</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modal = document.getElementById('change-password-modal');

        // 绑定模态框事件
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = document.getElementById('cancel-change-password');
        const submitBtn = document.getElementById('submit-change-password');
        const form = document.getElementById('change-password-form');

        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        };

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);

        // 点击遮罩层关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // 提交表单
        submitBtn.addEventListener('click', async () => {
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const formData = new FormData(form);
            const oldPassword = formData.get('oldPassword');
            const newPassword = formData.get('newPassword');
            const confirmPassword = formData.get('confirmPassword');

            if (newPassword !== confirmPassword) {
                alert('两次输入的密码不一致');
                return;
            }

            if (oldPassword === newPassword) {
                alert('新密码不能与旧密码相同');
                return;
            }

            try {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 处理中...';

                // 调用API修改密码
                // await api.user.changePassword(oldPassword, newPassword);

                // 模拟API调用延迟
                await new Promise(resolve => setTimeout(resolve, 1000));

                // 模拟成功
                alert('密码修改成功，请重新登录');
                closeModal();

                // 实际项目中可能需要跳转到登录页
                // window.location.href = '/login.html';
            } catch (error) {
                alert(error.message || '修改失败，请重试');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '确认修改';
            }
        });
    }
};

export default userManager;
