#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const manualPath = path.join(root, 'config', 'i18n-manual-template.json');
const priorityPath = path.join(root, 'config', 'i18n-admin-dashboard-translation-priority.generated.json');

if (!fs.existsSync(manualPath) || !fs.existsSync(priorityPath)) {
  console.error('Missing required files. Run admin extraction first.');
  process.exit(1);
}

const manual = JSON.parse(fs.readFileSync(manualPath, 'utf8'));
manual.vi = manual.vi && typeof manual.vi === 'object' ? manual.vi : {};
manual.en = manual.en && typeof manual.en === 'object' ? manual.en : {};
manual.zh = manual.zh && typeof manual.zh === 'object' ? manual.zh : {};

const priority = JSON.parse(fs.readFileSync(priorityPath, 'utf8'));
const top = Array.isArray(priority?.top100?.en) ? priority.top100.en : [];

const mapping = {
  'none': { en: 'None', zh: '无' },
  'div': { en: 'div', zh: 'div' },
  'active': { en: 'Active', zh: '启用' },
  'approved': { en: 'Approved', zh: '已批准' },
  'input': { en: 'Input', zh: '输入' },
  'pending': { en: 'Pending', zh: '待处理' },
  'rejected': { en: 'Rejected', zh: '已拒绝' },
  'users': { en: 'Users', zh: '用户' },
  'Content-Type': { en: 'Content-Type', zh: 'Content-Type' },
  'admin': { en: 'CSKH Manh Lam', zh: '管理员' },
  'application/json': { en: 'application/json', zh: 'application/json' },
  'click': { en: 'Click', zh: '点击' },
  'DOMContentLoaded': { en: 'DOMContentLoaded', zh: 'DOMContentLoaded' },
  'vi-VN': { en: 'vi-VN', zh: 'vi-VN' },
  'px': { en: 'px', zh: 'px' },
  'block': { en: 'Block', zh: '块' },
  'style': { en: 'Style', zh: '样式' },
  'withdrawals': { en: 'Withdrawals', zh: '提现' },
  '#fbbf24': { en: '#fbbf24', zh: '#fbbf24' },
  'info': { en: 'Information', zh: '信息' },
  'object': { en: 'Object', zh: '对象' },
  'success': { en: 'Success', zh: '成功' },
  'text': { en: 'Text', zh: '文本' },
  'flex': { en: 'Flex', zh: '弹性布局' },
  'loading': { en: 'Loading', zh: '加载中' },
  '#3b82f6': { en: '#3b82f6', zh: '#3b82f6' },
  'prize_': { en: 'prize_', zh: 'prize_' },
  'center': { en: 'Center', zh: '居中' },
  'pending_approval': { en: 'Pending approval', zh: '待审核' },
  'prize_ _cash_amount': { en: 'prize_ _cash_amount', zh: 'prize_ _cash_amount' },
  'N/A': { en: 'N/A', zh: '不适用' },
  'prize_ _icon': { en: 'prize_ _icon', zh: 'prize_ _icon' },
  'prize_ _image_url': { en: 'prize_ _image_url', zh: 'prize_ _image_url' },
  '#10b981': { en: '#10b981', zh: '#10b981' },
  'all': { en: 'All', zh: '全部' },
  'auto': { en: 'Auto', zh: '自动' },
  'button': { en: 'Button', zh: '按钮' },
  'error': { en: 'Error', zh: '错误' },
  'file': { en: 'File', zh: '文件' },
  'prize_ _description': { en: 'prize_ _description', zh: 'prize_ _description' },
  'prize_ _is_special': { en: 'prize_ _is_special', zh: 'prize_ _is_special' },
  'show': { en: 'Show', zh: '显示' },
  'vi': { en: 'Vietnamese', zh: '越南语' },
  'normal': { en: 'Normal', zh: '普通' },
  'user': { en: 'User', zh: '用户' },
  'closed': { en: 'Closed', zh: '已关闭' },
  'confirmed': { en: 'Confirmed', zh: '已确认' },
  'image': { en: 'Image', zh: '图片' },
  'new_homepage.html': { en: 'new_homepage.html', zh: 'new_homepage.html' },
  'prize_ _cash': { en: 'prize_ _cash', zh: 'prize_ _cash' },
  'prize_ _status': { en: 'prize_ _status', zh: 'prize_ _status' },
  'background (1).html': { en: 'background (1).html', zh: 'background (1).html' },
  'background_upgraded.html': { en: 'background_upgraded.html', zh: 'background_upgraded.html' },
  'background-alt.html': { en: 'background-alt.html', zh: 'background-alt.html' },
  'background.html': { en: 'background.html', zh: 'background.html' },
  'card_v3_purple.html': { en: 'card_v3_purple.html', zh: 'card_v3_purple.html' },
  'card_v4_cyber (1).html': { en: 'card_v4_cyber (1).html', zh: 'card_v4_cyber (1).html' },
  'card_v4_cyber.html': { en: 'card_v4_cyber.html', zh: 'card_v4_cyber.html' },
  'card_v5_baroque.html': { en: 'card_v5_baroque.html', zh: 'card_v5_baroque.html' },
  'en': { en: 'English', zh: '英语' },
  'left': { en: 'Left', zh: '左' },
  'medium': { en: 'Medium', zh: '中等' },
  'shake': { en: 'Shake', zh: '摇动' },
  'zh': { en: 'Chinese', zh: '中文' },
  'Delete': { en: 'Delete', zh: '删除' },
  'deleteLogoBtn': { en: 'deleteLogoBtn', zh: 'deleteLogoBtn' },
  'Duyệt thất bại yêu cầu #': { en: 'Approval failed for request #', zh: '审批请求失败 #' },
  'editCash': { en: 'editCash', zh: 'editCash' },
  'editCashInput': { en: 'editCashInput', zh: 'editCashInput' },
  'editImageUrl': { en: 'editImageUrl', zh: 'editImageUrl' },
  'editPrizeDesc': { en: 'editPrizeDesc', zh: 'editPrizeDesc' },
  'editPrizeLevel': { en: 'editPrizeLevel', zh: 'editPrizeLevel' },
  'editPrizeName': { en: 'editPrizeName', zh: 'editPrizeName' },
  'editSpecial': { en: 'editSpecial', zh: 'editSpecial' },
  'exportTemplateName': { en: 'exportTemplateName', zh: 'exportTemplateName' },
  'importTemplateFile': { en: 'importTemplateFile', zh: 'importTemplateFile' },
  'importTemplateJson': { en: 'importTemplateJson', zh: 'importTemplateJson' },
  'Lưu thất bại': { en: 'Save failed', zh: '保存失败' },
  'Lưu thay đổi': { en: 'Save changes', zh: '保存更改' },
  'Nhập đầy đủ thông tin preset': { en: 'Enter complete preset information', zh: '请输入完整预设信息' },
  'Nhập giá trị...': { en: 'Enter value...', zh: '输入值...' },
  'Nhập key và giá trị': { en: 'Enter key and value', zh: '输入键和值' },
  'Nhập lý do từ chối cho phiên <strong> </strong>:': { en: 'Enter rejection reason for session <strong> </strong>:', zh: '输入会话 <strong> </strong> 的拒绝原因：' },
  'Nhập mô tả chi tiết...': { en: 'Enter detailed description...', zh: '输入详细描述...' },
  'Nhập tên phần thưởng...': { en: 'Enter prize name...', zh: '输入奖品名称...' },
  'Sửa phiên chơi': { en: 'Edit session', zh: '编辑会话' },
  'Tạo': { en: 'Create', zh: '创建' },
  'Tạo mã ngẫu nhiên': { en: 'Generate random code', zh: '生成随机代码' },
  'Tạo phiên chơi mới': { en: 'Create new session', zh: '创建新会话' },
  'Từ chối thất bại yêu cầu #': { en: 'Rejection failed for request #', zh: '拒绝请求失败 #' },
  '#7c3aed': { en: '#7c3aed', zh: '#7c3aed' },
  'Từ chối': { en: 'Reject', zh: '拒绝' },
  '&lt;': { en: '&lt;', zh: '&lt;' },
  '💰 Rút tiền': { en: '💰 Withdraw money', zh: '💰 提现' },
  'Giao diện 1': { en: 'Layout 1', zh: '界面 1' },
  'Giao diện 2': { en: 'Layout 2', zh: '界面 2' },
  'Giao diện 3': { en: 'Layout 3', zh: '界面 3' },
  'Giao diện 4': { en: 'Layout 4', zh: '界面 4' },
  'Giao diện 5': { en: 'Layout 5', zh: '界面 5' },
  'Giao diện 6': { en: 'Layout 6', zh: '界面 6' },
};

let updatedEn = 0;
let updatedZh = 0;
let missingInMap = 0;

for (const item of top) {
  const text = String(item?.text || '').trim();
  if (!text) continue;

  if (!(text in manual.vi)) {
    manual.vi[text] = text;
  }

  const m = mapping[text];
  if (!m) {
    missingInMap += 1;
    continue;
  }

  if (m.en && String(manual.en[text] || '').trim() !== m.en) {
    manual.en[text] = m.en;
    updatedEn += 1;
  }
  if (m.zh && String(manual.zh[text] || '').trim() !== m.zh) {
    manual.zh[text] = m.zh;
    updatedZh += 1;
  }
}

fs.writeFileSync(manualPath, JSON.stringify(manual, null, 2));
console.log(JSON.stringify({ topCount: top.length, updatedEn, updatedZh, missingInMap }, null, 2));
