/**
 * Internationalization (i18n) utility
 * Supports: Vietnamese (vi), English (en), Chinese (zh)
 */

const fs = require('fs');
const path = require('path');

const translations = {
  vi: {
    // Navigation
    navHome: 'Về trang chủ',
    // Game hero
    heroTitle: 'Mở Hộp Quà Bí Ẩn',
    heroSubtitle: 'Chọn một hộp quà bên dưới để thử vận may!',
    // Login
    loginTitle: 'Nhập mã phiên chơi',
    loginPlaceholder: 'Nhập mã phiên...',
    loginButton: 'Bắt đầu chơi',
    // Wallet
    walletTotal: 'Tổng tiền',
    walletWithdrawHint: 'Hãy liên hệ CSKH để được giúp đỡ.',
    walletTrust: 'Tín nhiệm',
    walletOpenSession: 'Mở ví phiên',
    walletWithdraw: 'Rút tiền',
    walletBalance: 'Số dư ví',
    walletReady: 'Sẵn sàng',
    walletEmpty: 'Ví trống',
    // Win popup
    winCongrats: '✨ CHÚC MỪNG!',
    winPrizeName: 'Tên giải thưởng',
    winLucky: '🎁 GIẢI THƯỞNG MAY MẮN!',
    winShare: '🚀 Chia sẻ nhanh',
    winDownload: '🖼️ Tải ảnh phần quà',
    winCapture: '📷 Chụp ảnh kết quả',
    winThanks: 'Cảm ơn Quý khách đã tham gia trò chơi!',
    winSessionCode: 'Mã phiên',
    // Lose popup
    loseTitleDefault: '😢 Chúc bạn may mắn lần sau!',
    // Withdrawal
    withTitle: 'Quản lý rút tiền',
    withTabHistory: 'Lịch sử rút tiền',
    withTabCreate: 'Tạo lệnh mới',
    withBalance: 'Số dư khả dụng',
    withTrustScore: 'Điểm tín nhiệm',
    withAmount: 'Số tiền rút',
    withBank: 'Tên ngân hàng',
    withAccNo: 'Số tài khoản',
    withAccName: 'Tên chủ tài khoản',
    withName: 'Họ và tên nhận',
    withPhone: 'Số điện thoại',
    withEmail: 'Email',
    withNote: 'Ghi chú',
    withSubmit: 'Tạo lệnh rút tiền',
    withClose: 'Đóng',
    withAll: 'Tất cả',
    withNoHistory: 'Chưa có lệnh rút tiền nào',
    withConfirm: 'Tôi xác nhận thông tin trên là chính xác',
    // Approval wait screen
    approvalProcessing: 'Đang xử lý',
    approvalTitle: 'Chờ admin phê duyệt',
    approvalTimeLeft: '⏱ Thời gian còn lại',
    approvalKeepOpen: 'Giữ trang mở để nhận thông báo',
    approvalPrizeTag: 'Phần thưởng VIP',
    approvalSpecialBadge: '⭐ PHẦN THƯỞNG ĐẶC BIỆT',
    approvalProgress: 'Tiến trình xử lý',
    approvalBotName: 'AI Nhắc nhở',
    approvalReminder: 'NHẮC NHỞ',
    approvalBotText: 'Mình đang theo dõi trạng thái duyệt cho bạn theo thời gian thực.',
    approvalMsg1: '🎁 <strong>Phần thưởng đặc biệt</strong> của bạn đang được admin xem xét',
    approvalMsg2: '⚡ Vui lòng <span class="aws-hl">không tắt trang</span> và chờ thông báo',
    approvalMsg3: '✨ Bạn sẽ sớm nhận được kết quả!',
    approvalConnected: 'Kết nối thành công · Đang chờ phản hồi từ admin',
    approvalSupport: '💬 Liên hệ CSKH',
    approvalAccept: '💰 Quy đổi tiền',
    approvalDecline: '❌ Từ chối',
    approvalNote: 'Đang chờ phản hồi từ admin... (thường < 5 phút) · Kết quả minh bạch · Không lưu thông tin cá nhân',
    // Celebrate
    celebrateReward: 'LUCKY REWARD',
    celebratePrize: 'Phần thưởng',
    celebrateValue: 'Quà hiện vật đặc biệt',
    celebrateHint: 'Nhấn vào màn hình để đóng',
    // Thank you
    thankYouTitle: 'Cảm ơn bạn!',
    thankYouSub: 'Yêu cầu của bạn đã được ghi nhận',
    thankYouMethod: 'Phương thức',
    thankYouRecipient: 'Người nhận',
    thankYouPhone: 'Điện thoại',
    thankYouDetail: 'Chi tiết',
    thankYouClose: 'Đóng',
    thankYouViewTx: 'Xem giao dịch',
    // Chat
    chatTitle: 'Hỗ trợ trực tuyến',
    chatSubtitle: 'Chúng tôi sẵn sàng giúp bạn',
    chatPlaceholder: 'Nhập tin nhắn...',
    chatOffline: 'Hiện tại không có nhân viên trực.',
    chatWelcome: 'Xin chào! Bạn cần hỗ trợ gì?',
    // Hub
    hubTitle: 'Quản lý phiên',
    hubSubtitle: 'Các chức năng đầy đủ theo mã phiên',
    hubSessionCode: 'Mã phiên',
    hubWalletBalance: 'Số dư ví',
    hubPendingConversion: 'Đang chờ duyệt quy đổi',
    hubTrustScore: 'Điểm tín nhiệm',
    hubRefresh: 'Làm mới',
    hubSearch: 'Tra cứu',
    hubSearchPlaceholder: 'Nhập mã phiên cần tra cứu...',
    // Session detail
    sessionDetailTitle: 'Chi tiết phiên chơi',
    sessionDetailSub: 'Tổng hợp đầy đủ hộp quà, ví, giao dịch và trạng thái xử lý',
    sessionDetailLoading: 'Đang tải dữ liệu phiên...',
    // Claim modal
    claimName: 'Họ và tên',
    claimPhone: 'Số điện thoại',
    claimEmail: 'Email',
    claimAddress: 'Địa chỉ',
    claimCity: 'Tỉnh/Thành phố',
    claimNote: 'Ghi chú',
    claimSubmit: 'Nhận quà',
    // General
    loading: 'Đang tải...',
    close: 'Đóng',
    save: 'Lưu',
    cancel: 'Hủy',
    confirm: 'Xác nhận',
    // Brand
    brandName: 'Manh Lam Store',
    footerText: '© 2024 - Manh Lam Store. All rights reserved.',
    // Maintenance
    maintenanceTitle: 'Hệ thống đang bảo trì',
    maintenanceMsg: 'Hệ thống đang bảo trì, vui lòng quay lại sau.',
    // Game features
    boxPreviewLabel: 'Xem trước',
    hintLabel: 'Gợi ý',
    streakBonusLabel: 'Streak Bonus!',
    referralLabel: 'Mời bạn bè',
    leaderboardTitle: 'Bảng xếp hạng',
    achievementsTitle: 'Thành tựu',
    timerLabel: 'Thời gian còn lại',
    dailyLimitReached: 'Bạn đã hết lượt chơi hôm nay!',
    soundOn: 'Âm thanh: BẬT',
    soundOff: 'Âm thanh: TẮT',
    langSwitch: 'Ngôn ngữ',
    // Admin editor extensions
    adminModalEditorTitle: 'Chỉnh sửa Modal',
    adminModalPreviewCurrent: 'Preview modal đang chọn',
    adminModalPreviewAll: 'Preview tất cả modal',
    adminModalPreviewClose: 'Đóng',
    adminCanvasTitle: 'Canvas kéo-thả cấu trúc hộp 3D',
    adminCanvasPresetClassic: 'Classic',
    adminCanvasPresetTall: 'Tall Box',
    adminCanvasPresetFlat: 'Flat Box',
    adminCanvasPresetRibbonHeavy: 'Ribbon Heavy',
    adminTemplateOnly: 'Template-only',
    adminTemplateWithModalSkin: 'Template + Modal Skin',
    adminPresetCustom: 'Preset tùy biến',
    adminPresetName: 'Tên preset',
    adminPresetExport: 'Export',
    adminPresetImport: 'Import',
    adminExportSuccessTemplateOnly: 'Đã xuất template-only thành công',
    adminExportSuccessTemplateWithSkin: 'Đã xuất template kèm modal skin thành công',
    adminImportTemplateInvalid: 'Template không hợp lệ',
    adminBoxPartLid: 'Nắp',
    adminBoxPartBody: 'Thân',
    adminBoxPartRibbon: 'Ribbon'
  },
  en: {
    navHome: 'Back to Home',
    heroTitle: 'Mystery Gift Box',
    heroSubtitle: 'Choose a gift box below to try your luck!',
    loginTitle: 'Enter Session Code',
    loginPlaceholder: 'Enter code...',
    loginButton: 'Start Playing',
    walletTotal: 'Total Balance',
    walletWithdrawHint: 'Withdraw to domestic banks.',
    walletTrust: 'Trust Score',
    walletOpenSession: 'Open Session Wallet',
    walletWithdraw: 'Withdraw',
    walletBalance: 'Wallet Balance',
    walletReady: 'Ready',
    walletEmpty: 'Empty',
    winCongrats: '✨ CONGRATULATIONS!',
    winPrizeName: 'Prize Name',
    winLucky: '🎁 LUCKY PRIZE!',
    winShare: '🚀 Quick Share',
    winDownload: '🖼️ Download Prize Image',
    winCapture: '📷 Capture Result',
    winThanks: 'Thank you for participating in the game!',
    winSessionCode: 'Session Code',
    loseTitleDefault: '😢 Better luck next time!',
    withTitle: 'Withdrawal Management',
    withTabHistory: 'Withdrawal History',
    withTabCreate: 'Create New',
    withBalance: 'Available Balance',
    withTrustScore: 'Trust Score',
    withAmount: 'Withdrawal Amount',
    withBank: 'Bank Name',
    withAccNo: 'Account Number',
    withAccName: 'Account Holder Name',
    withName: 'Full Name',
    withPhone: 'Phone Number',
    withEmail: 'Email',
    withNote: 'Note',
    withSubmit: 'Submit Withdrawal',
    withClose: 'Close',
    withAll: 'All',
    withNoHistory: 'No withdrawal history',
    withConfirm: 'I confirm the above information is correct',
    approvalProcessing: 'Processing',
    approvalTitle: 'Waiting for Admin Approval',
    approvalTimeLeft: '⏱ Time Remaining',
    approvalKeepOpen: 'Keep this page open to receive notifications',
    approvalPrizeTag: 'VIP Prize',
    approvalSpecialBadge: '⭐ SPECIAL PRIZE',
    approvalProgress: 'Processing Progress',
    approvalBotName: 'AI Reminder',
    approvalReminder: 'REMINDER',
    approvalBotText: 'I am monitoring the approval status for you in real-time.',
    approvalMsg1: '🎁 Your <strong>special prize</strong> is being reviewed by admin',
    approvalMsg2: '⚡ Please <span class="aws-hl">do not close the page</span> and wait for notification',
    approvalMsg3: '✨ You will receive the result soon!',
    approvalConnected: 'Connected · Waiting for admin response',
    approvalSupport: '💬 Contact Support',
    approvalAccept: '💰 Convert to Cash',
    approvalDecline: '❌ Decline',
    approvalNote: 'Waiting for admin response... (usually < 5 min) · Transparent results · No personal data stored',
    celebrateReward: 'LUCKY REWARD',
    celebratePrize: 'Prize',
    celebrateValue: 'Special physical gift',
    celebrateHint: 'Tap to close',
    thankYouTitle: 'Thank You!',
    thankYouSub: 'Your request has been recorded',
    thankYouMethod: 'Method',
    thankYouRecipient: 'Recipient',
    thankYouPhone: 'Phone',
    thankYouDetail: 'Details',
    thankYouClose: 'Close',
    thankYouViewTx: 'View Transaction',
    chatTitle: 'Online Support',
    chatSubtitle: 'We are ready to help you',
    chatPlaceholder: 'Type a message...',
    chatOffline: 'No agents available at the moment.',
    chatWelcome: 'Hello! How can we help you?',
    hubTitle: 'Session Management',
    hubSubtitle: 'Full features by session code',
    hubSessionCode: 'Session Code',
    hubWalletBalance: 'Wallet Balance',
    hubPendingConversion: 'Pending Conversion',
    hubTrustScore: 'Trust Score',
    hubRefresh: 'Refresh',
    hubSearch: 'Search',
    hubSearchPlaceholder: 'Enter session code to search...',
    sessionDetailTitle: 'Session Details',
    sessionDetailSub: 'Complete overview of boxes, wallet, transactions and processing status',
    sessionDetailLoading: 'Loading session data...',
    claimName: 'Full Name',
    claimPhone: 'Phone Number',
    claimEmail: 'Email',
    claimAddress: 'Address',
    claimCity: 'Province/City',
    claimNote: 'Note',
    claimSubmit: 'Claim Prize',
    loading: 'Loading...',
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    brandName: 'Lucky Gift Box',
    footerText: '© 2024 - Lucky Gift Box. All rights reserved.',
    maintenanceTitle: 'System Maintenance',
    maintenanceMsg: 'The system is under maintenance, please come back later.',
    boxPreviewLabel: 'Preview',
    hintLabel: 'Hint',
    streakBonusLabel: 'Streak Bonus!',
    referralLabel: 'Invite Friends',
    leaderboardTitle: 'Leaderboard',
    achievementsTitle: 'Achievements',
    timerLabel: 'Time Remaining',
    dailyLimitReached: 'You have used all your plays for today!',
    soundOn: 'Sound: ON',
    soundOff: 'Sound: OFF',
    langSwitch: 'Language',
    adminModalEditorTitle: 'Modal Editor',
    adminModalPreviewCurrent: 'Preview active modal',
    adminModalPreviewAll: 'Preview all modals',
    adminModalPreviewClose: 'Close',
    adminCanvasTitle: '3D Box Structure Drag Canvas',
    adminCanvasPresetClassic: 'Classic',
    adminCanvasPresetTall: 'Tall Box',
    adminCanvasPresetFlat: 'Flat Box',
    adminCanvasPresetRibbonHeavy: 'Ribbon Heavy',
    adminTemplateOnly: 'Template-only',
    adminTemplateWithModalSkin: 'Template + Modal Skin',
    adminPresetCustom: 'Custom Presets',
    adminPresetName: 'Preset name',
    adminPresetExport: 'Export',
    adminPresetImport: 'Import',
    adminExportSuccessTemplateOnly: 'Template-only exported successfully',
    adminExportSuccessTemplateWithSkin: 'Template with modal skin exported successfully',
    adminImportTemplateInvalid: 'Invalid template',
    adminBoxPartLid: 'Lid',
    adminBoxPartBody: 'Body',
    adminBoxPartRibbon: 'Ribbon'
  },
  zh: {
    navHome: '返回首页',
    heroTitle: '神秘礼盒',
    heroSubtitle: '选择下方一个礼盒试试你的运气！',
    loginTitle: '输入会话代码',
    loginPlaceholder: '输入代码...',
    loginButton: '开始游戏',
    walletTotal: '总余额',
    walletWithdrawHint: '提现到国内银行。',
    walletTrust: '信用分',
    walletOpenSession: '打开会话钱包',
    walletWithdraw: '提现',
    walletBalance: '钱包余额',
    walletReady: '就绪',
    walletEmpty: '空的',
    winCongrats: '✨ 恭喜您！',
    winPrizeName: '奖品名称',
    winLucky: '🎁 幸运大奖！',
    winShare: '🚀 快速分享',
    winDownload: '🖼️ 下载奖品图片',
    winCapture: '📷 截图结果',
    winThanks: '感谢您参与游戏！',
    winSessionCode: '会话代码',
    loseTitleDefault: '😢 祝您下次好运！',
    withTitle: '提现管理',
    withTabHistory: '提现记录',
    withTabCreate: '新建提现',
    withBalance: '可用余额',
    withTrustScore: '信用分',
    withAmount: '提现金额',
    withBank: '银行名称',
    withAccNo: '账号',
    withAccName: '账户持有人',
    withName: '姓名',
    withPhone: '电话',
    withEmail: '邮箱',
    withNote: '备注',
    withSubmit: '提交提现',
    withClose: '关闭',
    withAll: '全部',
    withNoHistory: '暂无提现记录',
    withConfirm: '我确认以上信息正确',
    approvalProcessing: '处理中',
    approvalTitle: '等待管理员审批',
    approvalTimeLeft: '⏱ 剩余时间',
    approvalKeepOpen: '请保持页面打开以接收通知',
    approvalPrizeTag: 'VIP奖品',
    approvalSpecialBadge: '⭐ 特殊奖品',
    approvalProgress: '处理进度',
    approvalBotName: 'AI提醒',
    approvalReminder: '提醒',
    approvalBotText: '我正在实时监控审批状态。',
    approvalMsg1: '🎁 您的<strong>特殊奖品</strong>正在被管理员审核',
    approvalMsg2: '⚡ 请<span class="aws-hl">不要关闭页面</span>并等待通知',
    approvalMsg3: '✨ 您很快就会收到结果！',
    approvalConnected: '已连接 · 等待管理员回复',
    approvalSupport: '💬 联系客服',
    approvalAccept: '💰 兑换现金',
    approvalDecline: '❌ 拒绝',
    approvalNote: '等待管理员回复... (通常 < 5 分钟) · 结果透明 · 不保存个人信息',
    celebrateReward: '幸运奖励',
    celebratePrize: '奖品',
    celebrateValue: '特殊实物礼品',
    celebrateHint: '点击关闭',
    thankYouTitle: '谢谢您！',
    thankYouSub: '您的请求已记录',
    thankYouMethod: '方式',
    thankYouRecipient: '收件人',
    thankYouPhone: '电话',
    thankYouDetail: '详情',
    thankYouClose: '关闭',
    thankYouViewTx: '查看交易',
    chatTitle: '在线客服',
    chatSubtitle: '我们随时为您服务',
    chatPlaceholder: '输入消息...',
    chatOffline: '暂无客服在线。',
    chatWelcome: '您好！有什么可以帮您？',
    hubTitle: '会话管理',
    hubSubtitle: '按会话代码的完整功能',
    hubSessionCode: '会话代码',
    hubWalletBalance: '钱包余额',
    hubPendingConversion: '待审核兑换',
    hubTrustScore: '信用分',
    hubRefresh: '刷新',
    hubSearch: '搜索',
    hubSearchPlaceholder: '输入会话代码搜索...',
    sessionDetailTitle: '会话详情',
    sessionDetailSub: '礼盒、钱包、交易和处理状态的完整概览',
    sessionDetailLoading: '正在加载会话数据...',
    claimName: '姓名',
    claimPhone: '电话',
    claimEmail: '邮箱',
    claimAddress: '地址',
    claimCity: '省/市',
    claimNote: '备注',
    claimSubmit: '领取奖品',
    loading: '加载中...',
    close: '关闭',
    save: '保存',
    cancel: '取消',
    confirm: '确认',
    brandName: '幸运礼盒',
    footerText: '© 2024 - 幸运礼盒。版权所有。',
    maintenanceTitle: '系统维护中',
    maintenanceMsg: '系统正在维护，请稍后再来。',
    boxPreviewLabel: '预览',
    hintLabel: '提示',
    streakBonusLabel: '连胜奖励！',
    referralLabel: '邀请好友',
    leaderboardTitle: '排行榜',
    achievementsTitle: '成就',
    timerLabel: '剩余时间',
    dailyLimitReached: '您今天的游戏次数已用完！',
    soundOn: '声音: 开',
    soundOff: '声音: 关',
    langSwitch: '语言',
    adminModalEditorTitle: '弹窗编辑器',
    adminModalPreviewCurrent: '预览当前弹窗',
    adminModalPreviewAll: '预览全部弹窗',
    adminModalPreviewClose: '关闭',
    adminCanvasTitle: '3D礼盒结构拖拽画布',
    adminCanvasPresetClassic: '经典',
    adminCanvasPresetTall: '高盒',
    adminCanvasPresetFlat: '扁盒',
    adminCanvasPresetRibbonHeavy: '重丝带',
    adminTemplateOnly: '仅模板',
    adminTemplateWithModalSkin: '模板 + 弹窗皮肤',
    adminPresetCustom: '自定义预设',
    adminPresetName: '预设名称',
    adminPresetExport: '导出',
    adminPresetImport: '导入',
    adminExportSuccessTemplateOnly: '仅模板导出成功',
    adminExportSuccessTemplateWithSkin: '模板与弹窗皮肤导出成功',
    adminImportTemplateInvalid: '模板无效',
    adminBoxPartLid: '盒盖',
    adminBoxPartBody: '盒身',
    adminBoxPartRibbon: '丝带'
  }
};

const SUPPORTED_LANGS = ['vi', 'en', 'zh'];
const DEFAULT_LANG = 'vi';

function loadManualTemplate() {
  const toLangObj = (json, lang) => {
    const src = json && typeof json[lang] === 'object' && !Array.isArray(json[lang]) ? json[lang] : {};
    const out = {};
    Object.keys(src).forEach((k) => {
      out[String(k)] = String(src[k] || '').trim();
    });
    return out;
  };

  const readJson = (filePath) => {
    try {
      if (!fs.existsSync(filePath)) return null;
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (_) {
      return null;
    }
  };

  const mergeTemplates = (base, extra) => {
    const keys = new Set([
      ...Object.keys(base.vi || {}),
      ...Object.keys(extra.vi || {})
    ]);
    const vi = {};
    const en = {};
    const zh = {};

    keys.forEach((k) => {
      vi[k] = (base.vi && base.vi[k]) || (extra.vi && extra.vi[k]) || k;
      en[k] = (base.en && base.en[k]) || (extra.en && extra.en[k]) || '';
      zh[k] = (base.zh && base.zh[k]) || (extra.zh && extra.zh[k]) || '';
    });

    return { vi, en, zh };
  };

  try {
    const activePath = path.join(__dirname, '..', 'config', 'i18n-manual-template.json');
    const generatedPath = path.join(__dirname, '..', 'config', 'i18n-manual-template.generated.json');
    const activeRaw = readJson(activePath) || {};
    const generatedRaw = readJson(generatedPath) || {};

    const active = {
      vi: toLangObj(activeRaw, 'vi'),
      en: toLangObj(activeRaw, 'en'),
      zh: toLangObj(activeRaw, 'zh')
    };
    const generated = {
      vi: toLangObj(generatedRaw, 'vi'),
      en: toLangObj(generatedRaw, 'en'),
      zh: toLangObj(generatedRaw, 'zh')
    };

    return mergeTemplates(active, generated);
  } catch (_) {
    return { vi: {}, en: {}, zh: {} };
  }
}

const manualTemplate = loadManualTemplate();

function getManualTextMap(lang) {
  const src = manualTemplate.vi || {};
  const target = manualTemplate[lang] || {};
  const out = {};
  Object.keys(src).forEach((k) => {
    if (lang === 'vi') {
      out[k] = k;
      return;
    }
    const v = String(target[k] || '').trim();
    if (v) {
      out[k] = v;
      return;
    }

    const fallback = translateFreeText(lang, k);
    if (fallback && fallback !== k) {
      out[k] = fallback;
    }
  });
  return out;
}

function normalizeText(input) {
  return String(input || '')
    .replace(/\s+/g, ' ')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim();
}

function buildReverseIndex() {
  const byLang = { vi: new Map(), en: new Map(), zh: new Map() };
  Object.keys(translations.vi || {}).forEach((key) => {
    SUPPORTED_LANGS.forEach((lang) => {
      const val = normalizeText(translations[lang]?.[key]);
      if (val) byLang[lang].set(val, key);
    });
  });
  return byLang;
}

const reverseIndex = buildReverseIndex();

function resolveKeyFromAnyLanguage(text) {
  const n = normalizeText(text);
  if (!n) return null;
  for (const lang of SUPPORTED_LANGS) {
    const key = reverseIndex[lang].get(n);
    if (key) return key;
  }
  return null;
}

function translateFreeText(lang, text) {
  const key = resolveKeyFromAnyLanguage(text);
  if (!key) return text;
  return t(lang, key);
}

function translateBatch(lang, texts) {
  const out = {};
  (Array.isArray(texts) ? texts : []).forEach((item) => {
    const src = String(item || '');
    out[src] = translateFreeText(lang, src);
  });
  return out;
}

/**
 * Detect language from request
 * Priority: 1) query param ?lang= 2) cookie 3) Accept-Language header 4) default
 */
function detectLanguage(req) {
  // 1. Query param
  if (req.query && req.query.lang && SUPPORTED_LANGS.includes(req.query.lang)) {
    return req.query.lang;
  }

  // 2. Cookie
  if (req.cookies && req.cookies.lang && SUPPORTED_LANGS.includes(req.cookies.lang)) {
    return req.cookies.lang;
  }

  // 3. Accept-Language header
  const acceptLang = req.headers && req.headers['accept-language'];
  if (acceptLang) {
    const lower = acceptLang.toLowerCase();
    if (lower.startsWith('zh') || lower.includes('zh-cn') || lower.includes('zh-tw')) return 'zh';
    if (lower.startsWith('en') || lower.includes('en-us') || lower.includes('en-gb')) return 'en';
    if (lower.startsWith('vi') || lower.includes('vi-vn')) return 'vi';
  }

  return DEFAULT_LANG;
}

/**
 * Get translation for a key in a specific language
 */
function t(lang, key) {
  const dict = translations[lang] || translations[DEFAULT_LANG];
  return dict[key] || translations[DEFAULT_LANG][key] || key;
}

/**
 * Get all translations for a language
 */
function getTranslations(lang) {
  return {
    ...(translations[DEFAULT_LANG] || {}),
    ...(translations[lang] || {}),
    ...getManualTextMap(lang)
  };
}

module.exports = {
  translations,
  detectLanguage,
  t,
  getTranslations,
  getManualTextMap,
  translateFreeText,
  translateBatch,
  SUPPORTED_LANGS,
  DEFAULT_LANG
};
