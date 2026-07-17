#!/usr/bin/env node
/**
 * DEEP SYSTEM-WIDE translations batch #2
 * Covers all remaining Vietnamese text from:
 *   - Admin EJS views (sessions, withdrawals, gifts, conversions, customer-care,
 *     customization, analytics, users, tools, visits, files, activity-log, history)
 *   - Customer-facing EJS views (lucky-home, lucky-choose, lucky-wallet, lucky-inventory,
 *     lucky-exchange, lucky-search, lucky-opening, lucky-result-win, lucky-result-lose,
 *     lucky-personal-info, lucky-thank-you, lucky-withdraw-modal, lucky-claim-modal,
 *     lucky-navbar, chat, payment-qr, admin-qr-page, adminLogin)
 *   - Dynamic JS HTML generation (admin.js session detail/finance, pagination,
 *     approval workflows, status labels, admin-customer-care.js, game controllers)
 *
 * Run:  node tools/apply_deep_system_translations.js
 */
const fs = require('fs');
const path = require('path');

const templatePath = path.join(process.cwd(), 'config', 'i18n-manual-template.json');
if (!fs.existsSync(templatePath)) { console.error('Missing', templatePath); process.exit(1); }
const tpl = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
tpl.vi = tpl.vi && typeof tpl.vi === 'object' ? tpl.vi : {};
tpl.en = tpl.en && typeof tpl.en === 'object' ? tpl.en : {};
tpl.zh = tpl.zh && typeof tpl.zh === 'object' ? tpl.zh : {};

const map = {

// ═══════════════════════════════════════════════════════
// ADMIN LOGIN
// ═══════════════════════════════════════════════════════
'Quản lý hệ thống Gift Box': { en: 'Gift Box System Management', zh: '礼盒系统管理' },
'Tên đăng nhập': { en: 'Username', zh: '用户名' },
'Nhập tên đăng nhập...': { en: 'Enter username...', zh: '输入用户名...' },
'Mật khẩu': { en: 'Password', zh: '密码' },
'Nhập mật khẩu...': { en: 'Enter password...', zh: '输入密码...' },
'Ghi nhớ tôi': { en: 'Remember me', zh: '记住我' },
'Đăng Nhập': { en: 'Login', zh: '登录' },
'Đang đăng nhập...': { en: 'Logging in...', zh: '正在登录...' },

// ═══════════════════════════════════════════════════════
// ADMIN DASHBOARD NAV/HEADER
// ═══════════════════════════════════════════════════════
'Ngôn ngữ': { en: 'Language', zh: '语言' },
'Chuyển theme': { en: 'Switch theme', zh: '切换主题' },
'Tự động làm mới': { en: 'Auto refresh', zh: '自动刷新' },
'Đổi mật khẩu': { en: 'Change password', zh: '修改密码' },
'Menu điều hướng': { en: 'Navigation menu', zh: '导航菜单' },
'Bảng điều khiển': { en: 'Dashboard', zh: '控制面板' },
'Quản trị hệ thống': { en: 'System administration', zh: '系统管理' },
'🎮 Phiên chơi': { en: '🎮 Sessions', zh: '🎮 会话' },
'💰 Rút tiền': { en: '💰 Withdrawals', zh: '💰 提现' },
'⭐ Duyệt quà đặc biệt': { en: '⭐ Approve Special Gifts', zh: '⭐ 审核特殊礼品' },
'👥 Người dùng': { en: '👥 Users', zh: '👥 用户' },
'📁 Files': { en: '📁 Files', zh: '📁 文件' },
'💬 CSKH': { en: '💬 Support', zh: '💬 客服' },
'🎨 Tùy chỉnh': { en: '🎨 Customize', zh: '🎨 自定义' },
'⚡ Công cụ': { en: '⚡ Tools', zh: '⚡ 工具' },
'Admin workspace': { en: 'Admin workspace', zh: '管理后台' },
'Phiên chơi': { en: 'Sessions', zh: '会话' },
'Phê duyệt': { en: 'Approvals', zh: '审批' },
'Người dùng': { en: 'Users', zh: '用户' },
'Tùy chỉnh': { en: 'Customize', zh: '自定义' },
'Công cụ': { en: 'Tools', zh: '工具' },
'Cấu hình': { en: 'Configuration', zh: '配置' },

// ═══════════════════════════════════════════════════════
// SESSIONS TAB
// ═══════════════════════════════════════════════════════
'Quản lý phiên chơi': { en: 'Session Management', zh: '会话管理' },
'Tạo và quản lý các phiên chơi của bạn': { en: 'Create and manage your sessions', zh: '创建和管理您的会话' },
'Tạo phiên mới': { en: 'Create new session', zh: '创建新会话' },
'Bộ lọc & Tìm kiếm': { en: 'Filter & Search', zh: '筛选和搜索' },
'Trạng thái': { en: 'Status', zh: '状态' },
'Tất cả': { en: 'All', zh: '全部' },
'Hoạt động': { en: 'Active', zh: '活跃' },
'Không hoạt động': { en: 'Inactive', zh: '不活跃' },
'Mã phiên': { en: 'Session code', zh: '会话代码' },
'Nhập mã phiên...': { en: 'Enter session code...', zh: '输入会话代码...' },
'Chủ tài khoản': { en: 'Account holder', zh: '账户持有人' },
'Tên chủ tài khoản...': { en: 'Account holder name...', zh: '账户持有人姓名...' },
'Số tài khoản': { en: 'Account number', zh: '账号' },
'Từ ngày': { en: 'From date', zh: '从日期' },
'Đến ngày': { en: 'To date', zh: '到日期' },
'Áp dụng bộ lọc': { en: 'Apply filter', zh: '应用筛选' },
'Đặt lại': { en: 'Reset', zh: '重置' },
'Xóa tất cả': { en: 'Delete all', zh: '全部删除' },
'Hiển thị': { en: 'Showing', zh: '显示' },
'phiên chơi': { en: 'sessions', zh: '个会话' },
'Tổng cộng': { en: 'Total', zh: '共计' },
'kết quả': { en: 'results', zh: '个结果' },

// Session card dynamic strings
'Sao chép mã': { en: 'Copy code', zh: '复制代码' },
'Chỉnh sửa': { en: 'Edit', zh: '编辑' },
'Sửa': { en: 'Edit', zh: '编辑' },
'✅ Đã mở': { en: '✅ Opened', zh: '✅ 已打开' },
'📊 1 người chơi': { en: '📊 1 player', zh: '📊 1位玩家' },
'🎁 0 hoàn thành': { en: '🎁 0 completed', zh: '🎁 0已完成' },

// Session finance editing
'Sửa tài chính phiên': { en: 'Edit session finances', zh: '编辑会话财务信息' },

// Session pagination
'trong tổng số': { en: 'of total', zh: '总共' },
'phiên': { en: 'sessions', zh: '个会话' },
'Sau →': { en: 'Next →', zh: '下一页 →' },
'Trang': { en: 'Page', zh: '页' },

// ═══════════════════════════════════════════════════════
// WITHDRAWALS TAB
// ═══════════════════════════════════════════════════════
'Tổng lệnh': { en: 'Total orders', zh: '总订单' },
'Chờ duyệt': { en: 'Pending', zh: '待审核' },
'Đã duyệt': { en: 'Approved', zh: '已批准' },
'Tổng tiền đã duyệt': { en: 'Total approved amount', zh: '已批准总金额' },
'Tên phiên': { en: 'Session name', zh: '会话名称' },
'Tìm theo session code...': { en: 'Search by session code...', zh: '按会话代码搜索...' },
'Tên chủ tài khoản': { en: 'Account holder name', zh: '账户持有人姓名' },
'Tìm theo tên chủ TK...': { en: 'Search by holder name...', zh: '按持有人姓名搜索...' },
'Tìm theo số TK...': { en: 'Search by account no...', zh: '按账号搜索...' },
'Từ chối': { en: 'Rejected', zh: '已拒绝' },
'Phiên:': { en: 'Session:', zh: '会话：' },
'Ngân hàng:': { en: 'Bank:', zh: '银行：' },
'Số TK:': { en: 'Account No:', zh: '账号：' },
'Chủ TK:': { en: 'Holder:', zh: '持有人：' },
'Thời gian:': { en: 'Time:', zh: '时间：' },
'Duyệt bởi:': { en: 'Approved by:', zh: '审批人：' },
'Duyệt lúc:': { en: 'Approved at:', zh: '审批时间：' },
'Từ chối bởi:': { en: 'Rejected by:', zh: '拒绝人：' },
'Chi tiết': { en: 'Details', zh: '详情' },
'Không có lệnh rút tiền nào': { en: 'No withdrawal orders', zh: '没有提现订单' },
'Chưa có lệnh rút tiền nào trong hệ thống.': { en: 'No withdrawal orders in the system yet.', zh: '系统中暂无提现订单。' },
'Chưa có thông tin': { en: 'No information', zh: '暂无信息' },
'Sao chép': { en: 'Copy', zh: '复制' },
'❌ Chưa chọn': { en: '❌ Not selected', zh: '❌ 未选择' },
'Thời gian chọn': { en: 'Selection time', zh: '选择时间' },
'Phê duyệt': { en: 'Approve', zh: '审批' },

// ═══════════════════════════════════════════════════════
// GIFTS / SPECIAL APPROVAL TAB
// ═══════════════════════════════════════════════════════
'Duyệt quà đặc biệt': { en: 'Special Gift Approval', zh: '特殊礼品审核' },
'Phê duyệt quà đặc biệt': { en: 'Approve Special Gifts', zh: '审核特殊礼品' },
'⭐ Phê duyệt quà đặc biệt': { en: '⭐ Approve Special Gifts', zh: '⭐ 审核特殊礼品' },
'💱 Phê duyệt quy đổi tiền': { en: '💱 Approve Conversions', zh: '💱 审核兑换' },
'📜 Lịch sử phê duyệt': { en: '📜 Approval History', zh: '📜 审核历史' },
'Tổng quà đặc biệt': { en: 'Total special gifts', zh: '特殊礼品总数' },
'Tìm mã phiên...': { en: 'Search session code...', zh: '搜索会话代码...' },
'Đã quy đổi': { en: 'Converted', zh: '已兑换' },
'Người chơi từ chối': { en: 'Player rejected', zh: '玩家拒绝' },
'Admin từ chối': { en: 'Admin rejected', zh: '管理员拒绝' },
'KH từ chối': { en: 'Customer rejected', zh: '客户拒绝' },
'Tạo bởi:': { en: 'Created by:', zh: '创建者：' },
'Phần thưởng đặc biệt:': { en: 'Special prize:', zh: '特殊奖品：' },
'Người chơi:': { en: 'Player:', zh: '玩家：' },
'Mở lúc:': { en: 'Opened at:', zh: '打开时间：' },
'Cần duyệt:': { en: 'Needs approval:', zh: '待审核：' },
'Duyệt nhanh': { en: 'Quick approve', zh: '快速审核' },
'Không có quà đặc biệt': { en: 'No special gifts', zh: '没有特殊礼品' },
'Chưa có phiên chơi nào có quà đặc biệt cần duyệt': { en: 'No sessions with special gifts pending approval', zh: '没有需要审核特殊礼品的会话' },

// ═══════════════════════════════════════════════════════
// CONVERSIONS TAB
// ═══════════════════════════════════════════════════════
'Duyệt quy đổi tiền': { en: 'Approve Conversions', zh: '审核兑换' },
'Phê duyệt quy đổi tiền': { en: 'Approve Money Conversions', zh: '审核资金兑换' },
'Trung tâm phê duyệt quy đổi tiền': { en: 'Conversion Approval Center', zh: '兑换审核中心' },
'Theo dõi toàn bộ yêu cầu theo mã phiên': { en: 'Track all requests by session code', zh: '按会话代码跟踪所有请求' },
'Duyệt nhanh theo phiên': { en: 'Quick approve by session', zh: '按会话快速审核' },
'Yêu cầu quy đổi': { en: 'Conversion requests', zh: '兑换请求' },
'Đã xử lý': { en: 'Processed', zh: '已处理' },
'Tìm mã phiên, tên quà, người yêu cầu...': { en: 'Search session code, prize name, requester...', zh: '搜索会话代码、奖品名称、请求者...' },
'Hiển thị theo mã phiên, tối ưu thao tác hàng loạt': { en: 'Display by session code, optimized for batch operations', zh: '按会话代码显示，优化批量操作' },
'Tất cả trạng thái': { en: 'All statuses', zh: '所有状态' },
'Hộp:': { en: 'Box:', zh: '盒子：' },
'Phần thưởng:': { en: 'Prize:', zh: '奖品：' },
'Người gửi:': { en: 'Sender:', zh: '发送者：' },
'Tạo lúc:': { en: 'Created at:', zh: '创建时间：' },
'Duyệt': { en: 'Approve', zh: '审批' },
'Không có yêu cầu quy đổi': { en: 'No conversion requests', zh: '没有兑换请求' },
'Hiện chưa có yêu cầu quy đổi tiền nào': { en: 'No money conversion requests yet', zh: '暂无资金兑换请求' },
'Tổng yêu cầu': { en: 'Total requests', zh: '总请求' },
'Tổng giá trị': { en: 'Total value', zh: '总价值' },
'Mới nhất': { en: 'Most recent', zh: '最新' },
'Đã duyệt / Từ chối': { en: 'Approved / Rejected', zh: '已批准 / 已拒绝' },
'Chi tiết quy đổi theo phiên': { en: 'Session conversion details', zh: '会话兑换详情' },
'Hộp': { en: 'Box', zh: '盒子' },
'Tiền gốc': { en: 'Original amount', zh: '原始金额' },

// Lịch sử phê duyệt tab
'Lịch sử phê duyệt': { en: 'Approval History', zh: '审核历史' },
'Tìm mã phiên, người duyệt...': { en: 'Search session code, approver...', zh: '搜索会话代码、审核人...' },
'Tất cả nguồn': { en: 'All sources', zh: '所有来源' },
'Quà đặc biệt': { en: 'Special gifts', zh: '特殊礼品' },
'Quy đổi tiền': { en: 'Money conversion', zh: '资金兑换' },

// ═══════════════════════════════════════════════════════
// CUSTOMER CARE TAB
// ═══════════════════════════════════════════════════════
'Chăm sóc khách hàng': { en: 'Customer Care', zh: '客户服务' },
'Đang chờ': { en: 'Waiting', zh: '等待中' },
'Chưa đọc': { en: 'Unread', zh: '未读' },
'Cuộc hội thoại': { en: 'Conversations', zh: '对话' },
'Tìm theo tên / SĐT / email / mã chat...': { en: 'Search by name / phone / email / chat code...', zh: '按姓名/电话/邮箱/聊天代码搜索...' },
'Đang hoạt động': { en: 'Active', zh: '活跃' },
'Đã đóng': { en: 'Closed', zh: '已关闭' },
'Lưu trữ': { en: 'Archive', zh: '归档' },
'Chưa chọn hội thoại': { en: 'No conversation selected', zh: '未选择对话' },
'Phiên đang chơi': { en: 'Active session', zh: '进行中的会话' },
'Tìm tin nhắn': { en: 'Search messages', zh: '搜索消息' },
'Ưu tiên': { en: 'Priority', zh: '优先' },
'Xem phiên': { en: 'View session', zh: '查看会话' },
'Đã xong': { en: 'Done', zh: '已完成' },
'Thêm': { en: 'More', zh: '更多' },
'Xóa hội thoại': { en: 'Delete conversation', zh: '删除对话' },
'Tìm trong tin nhắn...': { en: 'Search in messages...', zh: '在消息中搜索...' },
'Khách hàng đang nhập tin nhắn...': { en: 'Customer is typing...', zh: '客户正在输入...' },
'Xin chào! Tôi có thể giúp gì cho bạn?': { en: 'Hello! How can I help you?', zh: '您好！有什么可以帮您？' },
'Cảm ơn bạn đã liên hệ!': { en: 'Thank you for contacting us!', zh: '感谢您的联系！' },
'Vui lòng chờ trong giây lát...': { en: 'Please wait a moment...', zh: '请稍等...' },
'Vấn đề đã được giải quyết...': { en: 'The issue has been resolved...', zh: '问题已解决...' },
'Vui lòng cung cấp thêm thông tin...': { en: 'Please provide more information...', zh: '请提供更多信息...' },
'Đính kèm file': { en: 'Attach file', zh: '附加文件' },
'Gửi ảnh': { en: 'Send image', zh: '发送图片' },
'Emoji': { en: 'Emoji', zh: '表情' },
'Nhập tin nhắn hỗ trợ...': { en: 'Type support message...', zh: '输入客服消息...' },
'Thông tin khách hàng': { en: 'Customer information', zh: '客户信息' },
'Tham gia': { en: 'Joined', zh: '加入' },
'Mã hội thoại': { en: 'Chat code', zh: '聊天代码' },
'Tổng tin nhắn': { en: 'Total messages', zh: '总消息数' },
'Độ hài lòng': { en: 'Satisfaction', zh: '满意度' },
'Thêm tag...': { en: 'Add tag...', zh: '添加标签...' },
'Ghi chú nội bộ admin': { en: 'Admin internal notes', zh: '管理员内部备注' },
'Thêm ghi chú chăm sóc...': { en: 'Add care notes...', zh: '添加备注...' },
'Lưu ghi chú': { en: 'Save notes', zh: '保存备注' },
'Chọn một cuộc hội thoại để bắt đầu hỗ trợ.': { en: 'Select a conversation to start support.', zh: '选择一个对话开始支持。' },
'Chưa có tin nhắn.': { en: 'No messages yet.', zh: '暂无消息。' },
'Không tải được dữ liệu': { en: 'Cannot load data', zh: '无法加载数据' },
'tin': { en: 'messages', zh: '条消息' },

// ═══════════════════════════════════════════════════════
// CUSTOMIZATION TAB (all sub-tabs)
// ═══════════════════════════════════════════════════════
'Tùy chỉnh Logo chi tiết': { en: 'Detailed Logo Customization', zh: '详细Logo自定义' },
'Nguồn Logo': { en: 'Logo Source', zh: 'Logo来源' },
'URL Logo': { en: 'Logo URL', zh: 'Logo网址' },
'Nhập URL logo...': { en: 'Enter logo URL...', zh: '输入Logo网址...' },
'Chiều cao': { en: 'Height', zh: '高度' },
'Chiều rộng tối đa': { en: 'Max width', zh: '最大宽度' },
'Căn chỉnh': { en: 'Alignment', zh: '对齐' },
'Giữa': { en: 'Center', zh: '居中' },
'Trái': { en: 'Left', zh: '左' },
'Phải': { en: 'Right', zh: '右' },
'Đổ bóng': { en: 'Shadow', zh: '阴影' },
'Không': { en: 'None', zh: '无' },
'Nhẹ': { en: 'Light', zh: '轻' },
'Trung bình': { en: 'Medium', zh: '中等' },
'Mạnh': { en: 'Strong', zh: '强' },
'Phát sáng xanh': { en: 'Blue glow', zh: '蓝色发光' },
'Phát sáng tím': { en: 'Purple glow', zh: '紫色发光' },
'Nền logo': { en: 'Logo background', zh: 'Logo背景' },
'Viền': { en: 'Border', zh: '边框' },
'Xem trước Logo': { en: 'Preview Logo', zh: '预览Logo' },
'Nền tối': { en: 'Dark background', zh: '深色背景' },
'Nền sáng': { en: 'Light background', zh: '浅色背景' },
'Lưu logo & Favicon': { en: 'Save logo & Favicon', zh: '保存Logo和图标' },
'Xóa logo': { en: 'Remove logo', zh: '删除Logo' },
'Cập nhật preview': { en: 'Update preview', zh: '更新预览' },

// Text sub-tab
'Nội dung văn bản': { en: 'Text Content', zh: '文本内容' },
'Trang chủ': { en: 'Homepage', zh: '首页' },
'Tên thương hiệu': { en: 'Brand name', zh: '品牌名称' },
'Tiêu đề chính': { en: 'Main title', zh: '主标题' },
'Mô tả chính': { en: 'Main description', zh: '主描述' },
'Trang Game': { en: 'Game Page', zh: '游戏页面' },
'Tiêu đề Hero': { en: 'Hero Title', zh: 'Hero标题' },
'Phụ đề Hero': { en: 'Hero Subtitle', zh: 'Hero副标题' },
'Đăng nhập': { en: 'Login', zh: '登录' },
'Kết quả': { en: 'Results', zh: '结果' },
'Popup trúng thưởng': { en: 'Win popup', zh: '中奖弹窗' },
'Popup không trúng': { en: 'Lose popup', zh: '未中奖弹窗' },

// Features sub-tab
'Rút tiền': { en: 'Withdrawal', zh: '提现' },
'Quà tặng': { en: 'Gifts', zh: '礼品' },
'Chat hỗ trợ': { en: 'Support chat', zh: '客服聊天' },
'Push Notification': { en: 'Push Notification', zh: '推送通知' },
'Floating Notification': { en: 'Floating Notification', zh: '浮动通知' },
'Trạng thái Online': { en: 'Online Status', zh: '在线状态' },
'Typing Indicator': { en: 'Typing Indicator', zh: '输入指示器' },
'Hiệu ứng âm thanh': { en: 'Sound Effects', zh: '音效' },
'Tự động trả lời': { en: 'Auto Reply', zh: '自动回复' },
'Chế độ bảo trì': { en: 'Maintenance Mode', zh: '维护模式' },
'Đăng ký người chơi': { en: 'Player Registration', zh: '玩家注册' },
'Giới hạn lượt chơi/ngày': { en: 'Daily play limit', zh: '每日游戏限制' },

// Game settings sub-tab
'Hiệu ứng game': { en: 'Game Effects', zh: '游戏效果' },
'Popup UNLUCKY': { en: 'UNLUCKY Popup', zh: 'UNLUCKY弹窗' },
'Xem lại popup kết quả': { en: 'Review result popup', zh: '回看结果弹窗' },
'Hiệu ứng chúc mừng': { en: 'Celebration effects', zh: '庆祝效果' },
'Hộp quà hiệu ứng động': { en: 'Animated gift box', zh: '动态礼盒效果' },
'Luật chơi': { en: 'Game rules', zh: '游戏规则' },
'Mở nhiều hộp/phiên': { en: 'Multiple boxes per session', zh: '每会话多个盒子' },
'Xem trước hộp quà': { en: 'Preview gift box', zh: '预览礼盒' },
'Gợi ý chọn hộp': { en: 'Box selection hints', zh: '盒子选择提示' },
'Tính năng nâng cao': { en: 'Advanced features', zh: '高级功能' },
'Streak Bonus': { en: 'Streak Bonus', zh: '连续奖励' },
'Giới thiệu bạn bè': { en: 'Refer friends', zh: '推荐好友' },
'Bảng xếp hạng': { en: 'Leaderboard', zh: '排行榜' },
'Thành tựu': { en: 'Achievements', zh: '成就' },
'Thử thách thời gian': { en: 'Time challenge', zh: '限时挑战' },

// Box settings sub-tab
'Cài đặt hộp quà': { en: 'Gift Box Settings', zh: '礼盒设置' },
'Số lượng hộp': { en: 'Number of boxes', zh: '盒子数量' },
'Kích thước': { en: 'Size', zh: '尺寸' },
'Nhỏ': { en: 'Small', zh: '小' },
'Lớn': { en: 'Large', zh: '大' },
'Thời gian mở': { en: 'Opening time', zh: '打开时间' },
'Hiệu ứng mở hộp': { en: 'Box opening effect', zh: '开盒效果' },
'Nổ tung': { en: 'Explode', zh: '爆炸' },
'Hiện số thứ tự hộp': { en: 'Show box number', zh: '显示盒子编号' },
'Nắp': { en: 'Lid', zh: '盖子' },
'Thân': { en: 'Body', zh: '主体' },
'Ribbon': { en: 'Ribbon', zh: '丝带' },
'Phần đang chọn': { en: 'Selected part', zh: '当前选择部分' },
'Áp dụng số': { en: 'Apply number', zh: '应用编号' },
'Preset tùy biến': { en: 'Custom preset', zh: '自定义预设' },
'Tên preset': { en: 'Preset name', zh: '预设名称' },

// ═══════════════════════════════════════════════════════
// ANALYTICS TAB
// ═══════════════════════════════════════════════════════
'Phiên chơi hôm nay': { en: 'Sessions today', zh: '今日会话' },
'↑ 12% từ hôm qua': { en: '↑ 12% from yesterday', zh: '↑ 比昨天增长12%' },
'Rút tiền chưa duyệt': { en: 'Pending withdrawals', zh: '待审核提现' },
'Cần xử lý': { en: 'Needs processing', zh: '需要处理' },
'Người dùng hoạt động': { en: 'Active users', zh: '活跃用户' },
'Hôm nay': { en: 'Today', zh: '今天' },
'Phiên chơi theo ngày (30 ngày)': { en: 'Sessions by day (30 days)', zh: '每日会话（30天）' },
'Rút tiền theo trạng thái': { en: 'Withdrawals by status', zh: '按状态提现' },
'Phân bổ giải thưởng': { en: 'Prize distribution', zh: '奖品分配' },

// ═══════════════════════════════════════════════════════
// USERS TAB
// ═══════════════════════════════════════════════════════
'Quản lý người dùng': { en: 'User Management', zh: '用户管理' },
'Thêm người dùng': { en: 'Add user', zh: '添加用户' },
'Tìm kiếm theo tên, email...': { en: 'Search by name, email...', zh: '按姓名、邮箱搜索...' },
'Đang tải danh sách người dùng...': { en: 'Loading user list...', zh: '正在加载用户列表...' },
'Khóa': { en: 'Lock', zh: '锁定' },
'Bị khóa': { en: 'Locked', zh: '已锁定' },
'Tạo:': { en: 'Created:', zh: '创建：' },
'Mật khẩu:': { en: 'Password:', zh: '密码：' },

// User pagination
'Hiển thị 5 / 9 người dùng': { en: 'Showing 5 / 9 users', zh: '显示 5 / 9 位用户' },
'người dùng': { en: 'users', zh: '位用户' },

// ═══════════════════════════════════════════════════════
// TOOLS TAB
// ═══════════════════════════════════════════════════════
'Công cụ hệ thống': { en: 'System Tools', zh: '系统工具' },
'Tự động xóa phiên chơi cũ': { en: 'Auto delete old sessions', zh: '自动删除旧会话' },
'Đang hoạt động': { en: 'Active', zh: '活跃' },
'Tự động xóa phiên sau 15 ngày': { en: 'Auto delete sessions after 15 days', zh: '15天后自动删除会话' },
'BẬT': { en: 'ON', zh: '开启' },
'Bật tự động xóa': { en: 'Enable auto delete', zh: '启用自动删除' },
'Tự động xóa các phiên chơi cũ theo lịch trình': { en: 'Auto delete old sessions on schedule', zh: '按计划自动删除旧会话' },
'Số ngày giữ lại': { en: 'Days to keep', zh: '保留天数' },
'ngày': { en: 'days', zh: '天' },
'Phiên chơi sẽ bị xóa sau 15 ngày kể từ ngày tạo': { en: 'Sessions will be deleted 15 days after creation', zh: '会话将在创建15天后删除' },
'Lần cuối chạy:': { en: 'Last run:', zh: '上次运行：' },
'Lần tiếp theo:': { en: 'Next run:', zh: '下次运行：' },
'Chạy cleanup thủ công': { en: 'Manual cleanup', zh: '手动清理' },
'Xóa ngay các phiên chơi cũ theo cấu hình hiện tại': { en: 'Delete old sessions per current config', zh: '按当前配置删除旧会话' },
'Chạy ngay': { en: 'Run now', zh: '立即运行' },
'Cách thức hoạt động:': { en: 'How it works:', zh: '工作原理：' },
'Sao lưu và khôi phục': { en: 'Backup and Restore', zh: '备份和恢复' },
'Tải sao lưu': { en: 'Download backup', zh: '下载备份' },
'Tải xuống tệp sao lưu chứa cấu hình hiện tại': { en: 'Download backup file with current config', zh: '下载包含当前配置的备份文件' },
'Tải xuống': { en: 'Download', zh: '下载' },
'Khôi phục': { en: 'Restore', zh: '恢复' },
'Tải lên tệp sao lưu để khôi phục cấu hình': { en: 'Upload backup file to restore config', zh: '上传备份文件恢复配置' },
'Chọn tệp': { en: 'Choose file', zh: '选择文件' },
'Lưu ý:': { en: 'Note:', zh: '注意：' },
'Cleanup hoàn tất! Đã xóa 0 phiên cũ.': { en: 'Cleanup complete! Deleted 0 old sessions.', zh: '清理完成！已删除0个旧会话。' },

// ═══════════════════════════════════════════════════════
// FILES TAB
// ═══════════════════════════════════════════════════════
'Quản lý tệp': { en: 'File Management', zh: '文件管理' },
'Quản lý hình ảnh và tệp tải lên': { en: 'Manage uploaded images and files', zh: '管理上传的图片和文件' },
'Tìm kiếm tệp...': { en: 'Search files...', zh: '搜索文件...' },
'Tải lên tệp': { en: 'Upload file', zh: '上传文件' },
'Tổng số tệp': { en: 'Total files', zh: '文件总数' },
'Hình ảnh': { en: 'Images', zh: '图片' },
'Kích thước tổng': { en: 'Total size', zh: '总大小' },
'Tên tệp': { en: 'File name', zh: '文件名' },
'Loại': { en: 'Type', zh: '类型' },
'Kích thước': { en: 'Size', zh: '大小' },
'Ngày tải': { en: 'Upload date', zh: '上传日期' },
'Hành động': { en: 'Actions', zh: '操作' },
'Chưa có tệp nào. Nhấn "Tải lên tệp" để thêm.': { en: 'No files yet. Click "Upload file" to add.', zh: '暂无文件。点击"上传文件"添加。' },
'Xem': { en: 'View', zh: '查看' },
'Tải về': { en: 'Download', zh: '下载' },
'Tải lên tệp tin đầu tiên bằng nút "Tải lên tệp"': { en: 'Upload your first file using "Upload file" button', zh: '使用"上传文件"按钮上传第一个文件' },
'Dung lượng:': { en: 'Size:', zh: '大小：' },
'Loại:': { en: 'Type:', zh: '类型：' },

// ═══════════════════════════════════════════════════════
// VISITS TAB
// ═══════════════════════════════════════════════════════
'Theo dõi IP truy cập website': { en: 'Track Website IP Visits', zh: '跟踪网站IP访问' },
'Tổng lượt ghi nhận': { en: 'Total records', zh: '总记录数' },
'IP duy nhất': { en: 'Unique IPs', zh: '唯一IP' },
'Lượt truy cập hôm nay': { en: 'Visits today', zh: '今日访问' },
'Tìm IP, user-agent, session code...': { en: 'Search IP, user-agent, session code...', zh: '搜索IP、用户代理、会话代码...' },
'Thời gian': { en: 'Time', zh: '时间' },
'IP': { en: 'IP', zh: 'IP' },
'Session': { en: 'Session', zh: '会话' },
'Path': { en: 'Path', zh: '路径' },
'User-Agent': { en: 'User-Agent', zh: '用户代理' },
'Chưa có dữ liệu IP truy cập': { en: 'No IP visit data yet', zh: '暂无IP访问数据' },
'Hệ thống sẽ tự động lưu khi có máy truy cập website.': { en: 'System will auto-save when visitors access the website.', zh: '系统将在访问者访问网站时自动记录。' },

// ═══════════════════════════════════════════════════════
// ACTIVITY LOG
// ═══════════════════════════════════════════════════════
'Nhật Ký Hoạt Động': { en: 'Activity Log', zh: '活动日志' },
'Tất cả hoạt động': { en: 'All activities', zh: '所有活动' },
'Mở hộp': { en: 'Open box', zh: '打开盒子' },
'Nhận quà': { en: 'Claim gift', zh: '领取礼物' },
'Yêu cầu rút': { en: 'Withdrawal request', zh: '提现请求' },
'Duyệt rút': { en: 'Approve withdrawal', zh: '审批提现' },
'Tạo phiên': { en: 'Create session', zh: '创建会话' },
'Tạo user': { en: 'Create user', zh: '创建用户' },
'Thay đổi cài đặt': { en: 'Change settings', zh: '更改设置' },
'Xuất': { en: 'Export', zh: '导出' },
'Tổng hoạt động': { en: 'Total activities', zh: '活动总数' },
'Hoạt động gần nhất': { en: 'Recent activity', zh: '最近活动' },
'Trước': { en: 'Previous', zh: '上一页' },
'Sau': { en: 'Next', zh: '下一页' },
'Không thể tải nhật ký hoạt động. Vui lòng thử lại.': { en: 'Cannot load activity log. Please try again.', zh: '无法加载活动日志。请重试。' },

// ═══════════════════════════════════════════════════════
// HISTORY COMPONENT
// ═══════════════════════════════════════════════════════
'Lịch Sử Hoạt Động': { en: 'Activity History', zh: '活动历史' },
'Tất Cả': { en: 'All', zh: '全部' },
'Mở Hộp': { en: 'Open Box', zh: '打开盒子' },
'Nhận Quà': { en: 'Claim Gift', zh: '领取礼物' },
'Rút Quà': { en: 'Withdraw Gift', zh: '提取礼物' },
'Xuất CSV': { en: 'Export CSV', zh: '导出CSV' },
'Tìm kiếm hành động...': { en: 'Search actions...', zh: '搜索操作...' },

// ═══════════════════════════════════════════════════════
// PLAYER-FACING CHAT
// ═══════════════════════════════════════════════════════
'Đang kết nối lại...': { en: 'Reconnecting...', zh: '正在重新连接...' },
'Thu nhỏ': { en: 'Minimize', zh: '最小化' },
'Đóng chat': { en: 'Close chat', zh: '关闭聊天' },
'Xin chào, tôi cần hỗ trợ': { en: 'Hello, I need support', zh: '你好，我需要帮助' },
'Tôi muốn hỏi về giải thưởng': { en: 'I want to ask about prizes', zh: '我想咨询奖品' },
'Tôi gặp lỗi khi chơi': { en: 'I encountered an error while playing', zh: '我在玩游戏时遇到错误' },
'Cảm ơn bạn!': { en: 'Thank you!', zh: '谢谢！' },
'Sticker': { en: 'Sticker', zh: '贴纸' },

// ═══════════════════════════════════════════════════════
// LUCKY HOME
// ═══════════════════════════════════════════════════════
'Nhập mã phiên chơi của bạn để bắt đầu': { en: 'Enter your session code to start', zh: '输入您的会话代码开始' },
'khám phá những phần quà bí ẩn hấp dẫn': { en: 'discover exciting mystery gifts', zh: '发现精彩的神秘礼物' },
'Mã phiên chơi': { en: 'Session code', zh: '会话代码' },
'Nhập mã phiên (VD: ABC123)': { en: 'Enter code (e.g. ABC123)', zh: '输入代码（如：ABC123）' },
'Tham gia': { en: 'Join', zh: '参加' },
'Hộp Quà Bí Ẩn': { en: 'Mystery Gift Box', zh: '神秘礼盒' },
'Chọn 1 trong 3 hộp quà ngẫu nhiên': { en: 'Choose 1 of 3 random gift boxes', zh: '选择3个随机礼盒中的1个' },
'Đổi Sang Tiền': { en: 'Convert to Cash', zh: '兑换现金' },
'Quy đổi phần thưởng thành tiền mặt': { en: 'Convert prizes to cash', zh: '将奖品兑换为现金' },
'Kho Vật Phẩm': { en: 'Inventory', zh: '物品库' },
'Lưu trữ và quản lý phần thưởng': { en: 'Store and manage prizes', zh: '存储和管理奖品' },
'người đang truy cập': { en: 'visitors online', zh: '位访问者在线' },

// ═══════════════════════════════════════════════════════
// LUCKY CHOOSE
// ═══════════════════════════════════════════════════════
'Chọn Hộp Quà Của Bạn': { en: 'Choose Your Gift Box', zh: '选择您的礼盒' },
'Mỗi hộp chứa một phần quà bí mật. Chọn một và khám phá điều bất ngờ!': { en: 'Each box contains a secret gift. Choose one and discover the surprise!', zh: '每个盒子都包含一个秘密礼物。选一个发现惊喜！' },
'Mở được': { en: 'Can open', zh: '可打开' },
'Còn lại': { en: 'Remaining', zh: '剩余' },
'Hiện điểm tín nhiệm': { en: 'Show trust score', zh: '显示信任积分' },
'Chú ý: Bắt buộc mở theo thứ tự 1 → 2 → 3...': { en: 'Note: Must open in order 1 → 2 → 3...', zh: '注意：必须按顺序1 → 2 → 3打开...' },
'Hộp #1': { en: 'Box #1', zh: '盒子 #1' },
'Hộp #2': { en: 'Box #2', zh: '盒子 #2' },
'Hộp #3': { en: 'Box #3', zh: '盒子 #3' },
'Mẹo: Các phần quà sẽ được hiển thị sau khi bạn mở hộp...': { en: 'Tip: Prizes will be displayed after you open the box...', zh: '提示：奖品将在您打开盒子后显示...' },
'Kho vật phẩm': { en: 'Inventory', zh: '物品库' },
'Ví tiền': { en: 'Wallet', zh: '钱包' },
'Đổi quà': { en: 'Exchange gift', zh: '兑换礼物' },

// ═══════════════════════════════════════════════════════
// LUCKY NAVBAR
// ═══════════════════════════════════════════════════════
'Phiên:': { en: 'Session:', zh: '会话：' },
'Quay lại phiên chơi': { en: 'Back to session', zh: '返回会话' },
'Chế độ sáng': { en: 'Light mode', zh: '浅色模式' },

// ═══════════════════════════════════════════════════════
// LUCKY WALLET
// ═══════════════════════════════════════════════════════
'← Quay lại': { en: '← Back', zh: '← 返回' },
'Ví phiên này': { en: 'Session Wallet', zh: '会话钱包' },
'Mời nhập phiên chơi ở trang chủ': { en: 'Enter session code on homepage', zh: '请在首页输入会话代码' },
'Số dư hiện tại': { en: 'Current balance', zh: '当前余额' },
'0 đ': { en: '0₫', zh: '0₫' },
'Tổng đã rút': { en: 'Total withdrawn', zh: '已提取总额' },
'↘ Rút về tài khoản': { en: '↘ Withdraw to account', zh: '↘ 提现到账户' },
'Lịch sử giao dịch': { en: 'Transaction history', zh: '交易历史' },
'Thắng': { en: 'Won', zh: '赢' },
'Chưa có giao dịch nào': { en: 'No transactions yet', zh: '暂无交易' },
'Mở hộp quà để bắt đầu!': { en: 'Open gift boxes to start!', zh: '打开礼盒开始！' },

// ═══════════════════════════════════════════════════════
// LUCKY INVENTORY
// ═══════════════════════════════════════════════════════
'Kho vật phẩm trống': { en: 'Inventory is empty', zh: '物品库为空' },
'Bạn chưa có vật phẩm nào. Hãy mở hộp quà để nhận phần thưởng!': { en: 'You have no items. Open gift boxes to win prizes!', zh: '您没有物品。打开礼盒赢取奖品！' },

// ═══════════════════════════════════════════════════════
// LUCKY EXCHANGE
// ═══════════════════════════════════════════════════════
'Đổi Quà Của Bạn': { en: 'Exchange Your Gifts', zh: '兑换您的礼物' },
'Chưa có quà để đổi': { en: 'No gifts to exchange', zh: '没有可兑换的礼物' },
'Hãy mở hộp quà trước để nhận phần thưởng!': { en: 'Open gift boxes first to win prizes!', zh: '先打开礼盒获取奖品！' },

// ═══════════════════════════════════════════════════════
// LUCKY SEARCH
// ═══════════════════════════════════════════════════════
'Nhập mã phiên để tra cứu': { en: 'Enter session code to search', zh: '输入会话代码查询' },
'Bạn có thể xem lại thông tin và lịch sử của các phiên chơi trước đây': { en: 'You can review info and history of previous sessions', zh: '您可以查看之前会话的信息和历史' },

// ═══════════════════════════════════════════════════════
// LUCKY OPENING
// ═══════════════════════════════════════════════════════
'🎁 Hộp quà bí ẩn': { en: '🎁 Mystery Gift Box', zh: '🎁 神秘礼盒' },
'Đang mở hộp quà...': { en: 'Opening gift box...', zh: '正在打开礼盒...' },

// ═══════════════════════════════════════════════════════
// LUCKY RESULT WIN / LOSE
// ═══════════════════════════════════════════════════════
'🎉 Chúc Mừng!': { en: '🎉 Congratulations!', zh: '🎉 恭喜！' },
'Bạn đã nhận được': { en: 'You received', zh: '您获得了' },
'Giá trị:': { en: 'Value:', zh: '价值：' },
'🎁 Nhận vật phẩm': { en: '🎁 Claim item', zh: '🎁 领取物品' },
'💰 Đổi sang tiền': { en: '💰 Convert to cash', zh: '💰 兑换现金' },
'😢 Rất tiếc!': { en: '😢 Sorry!', zh: '😢 很遗憾！' },
'Chúc bạn may mắn lần sau': { en: 'Better luck next time', zh: '祝您下次好运' },
'Không có phần quà lần này': { en: 'No prize this time', zh: '本次没有奖品' },
'Hãy thử lại ở phiên tiếp theo!': { en: 'Try again in the next session!', zh: '下次会话再试！' },
'😢 Đóng': { en: '😢 Close', zh: '😢 关闭' },

// ═══════════════════════════════════════════════════════
// LUCKY PERSONAL INFO
// ═══════════════════════════════════════════════════════
'🎁 Bắt đầu trải nghiệm mở hộp quà': { en: '🎁 Start gift box experience', zh: '🎁 开始礼盒体验' },
'Thông tin của bạn chỉ được yêu cầu khi xác nhận nhận quà hoặc rút tiền': { en: 'Your info is only required when confirming gift receipt or withdrawal', zh: '仅在确认领取礼物或提现时需要您的信息' },
'Thao tác nhanh gọn – không cần nhập lại thông tin nhiều lần': { en: 'Quick process – no need to re-enter info multiple times', zh: '快捷操作 – 无需多次重新输入信息' },
'Thông tin nhận quà sẽ được lưu khi bạn xác nhận phần thưởng': { en: 'Gift info saved when you confirm your prize', zh: '确认奖品时将保存领取信息' },
'Thông tin thanh toán chỉ lưu khi bạn gửi yêu cầu rút tiền': { en: 'Payment info saved only when you submit withdrawal', zh: '仅在提交提现请求时保存付款信息' },
'Tiếp tục chọn hộp quà': { en: 'Continue choosing gift box', zh: '继续选择礼盒' },
'🔒 Chúng tôi cam kết bảo mật dữ liệu người dùng và không chia sẻ cho bên thứ ba.': { en: '🔒 We are committed to data privacy and do not share with third parties.', zh: '🔒 我们承诺保护用户数据隐私，不与第三方共享。' },

// ═══════════════════════════════════════════════════════
// LUCKY THANK YOU
// ═══════════════════════════════════════════════════════
'Yêu cầu của bạn đã được ghi nhận ✨': { en: 'Your request has been recorded ✨', zh: '您的请求已记录 ✨' },
'Mã xác nhận:': { en: 'Confirmation code:', zh: '确认码：' },
'📦 KẾT QUẢ QUAY SỐ': { en: '📦 DRAW RESULT', zh: '📦 抽奖结果' },
'👤 THÔNG TIN CÁ NHÂN': { en: '👤 PERSONAL INFO', zh: '👤 个人信息' },
'Họ tên:': { en: 'Full name:', zh: '姓名：' },
'Số ĐT:': { en: 'Phone:', zh: '电话：' },
'Email:': { en: 'Email:', zh: '邮箱：' },
'💼 HÌNH THỨC NHẬN PHẦN THƯỞNG': { en: '💼 PRIZE CLAIM METHOD', zh: '💼 领奖方式' },
'Phương thức:': { en: 'Method:', zh: '方式：' },
'Số TK (ẩn):': { en: 'Account (hidden):', zh: '账号（隐藏）：' },
'Địa chỉ giao:': { en: 'Delivery address:', zh: '送货地址：' },
'Quá trình xử lý': { en: 'Processing progress', zh: '处理进度' },
'Hàng sẽ sớm được giao đến bạn!!': { en: 'Delivery will arrive soon!!', zh: '商品将很快送达！！' },
'Vui lòng nhắn cho nhân viên hỗ trợ để cập nhật đơn hàng!': { en: 'Please message support to update your order!', zh: '请联系客服更新您的订单！' },
'📲 Chia sẻ kết quả': { en: '📲 Share results', zh: '📲 分享结果' },
'🎮 Quay lại phiên chơi': { en: '🎮 Back to session', zh: '🎮 返回会话' },
'🏠 Quay về trang chủ': { en: '🏠 Back to homepage', zh: '🏠 返回首页' },

// ═══════════════════════════════════════════════════════
// LUCKY WITHDRAW MODAL
// ═══════════════════════════════════════════════════════
'Số dư khả dụng:': { en: 'Available balance:', zh: '可用余额：' },
'Họ và tên liên hệ': { en: 'Contact full name', zh: '联系人全名' },
'Số điện thoại liên hệ': { en: 'Contact phone', zh: '联系电话' },
'Email liên hệ': { en: 'Contact email', zh: '联系邮箱' },
'-- Đang tải danh sách ngân hàng --': { en: '-- Loading bank list --', zh: '-- 正在加载银行列表 --' },
'⏳ Đang tải...': { en: '⏳ Loading...', zh: '⏳ 加载中...' },
'Nhập số tài khoản': { en: 'Enter account number', zh: '输入账号' },
'Tên tài khoản': { en: 'Account name', zh: '账户名称' },
'Nhập số tiền (VD: 1,000,000)': { en: 'Enter amount (e.g. 1,000,000)', zh: '输入金额（例：1,000,000）' },
'Số tiền tối thiểu: 10,000 VND': { en: 'Minimum amount: 10,000 VND', zh: '最低金额：10,000 VND' },
'⚠️ Yêu cầu rút tiền sẽ được xử lý trong vòng 12 giờ. Vui lòng kiểm tra thông tin tài khoản trước khi xác nhận.': { en: '⚠️ Withdrawal will be processed within 12 hours. Please verify account info before confirming.', zh: '⚠️ 提现将在12小时内处理。请在确认前核实账户信息。' },
'Xác nhận rút tiền': { en: 'Confirm withdrawal', zh: '确认提现' },

// ═══════════════════════════════════════════════════════
// LUCKY CLAIM MODAL
// ═══════════════════════════════════════════════════════
'🎁 Thông tin nhận quà': { en: '🎁 Gift claim information', zh: '🎁 领取礼物信息' },
'Họ và tên người nhận': { en: 'Recipient full name', zh: '收件人全名' },
'Số nhà, đường, phường/xã...': { en: 'House number, street, ward...', zh: '门牌号、街道、区...' },
'Tỉnh / Thành phố': { en: 'Province / City', zh: '省 / 市' },
'Chọn tỉnh / thành phố': { en: 'Select province / city', zh: '选择省/市' },
'Ghi chú (tuỳ chọn)': { en: 'Notes (optional)', zh: '备注（可选）' },
'Ghi chú (tùy chọn)': { en: 'Notes (optional)', zh: '备注（可选）' },
'Giao giờ hành chính, gọi trước khi giao...': { en: 'Deliver during business hours, call before delivery...', zh: '营业时间内送货，送货前致电...' },
'📦 Hàng sẽ được giao sau khi xác nhận thông tin. Đội ngũ sẽ liên hệ qua số điện thoại để xác nhận trước khi giao.': { en: '📦 Delivery after info confirmation. Team will call to confirm before delivery.', zh: '📦 确认信息后发货。团队将在发货前致电确认。' },
'🎁 Xác nhận nhận quà': { en: '🎁 Confirm gift claim', zh: '🎁 确认领取礼物' },

// Province names (all 63)
'An Giang': { en: 'An Giang', zh: '安江' },
'Bà Rịa - Vũng Tàu': { en: 'Ba Ria - Vung Tau', zh: '巴地头顿' },
'Bắc Giang': { en: 'Bac Giang', zh: '北江' },
'Bắc Kạn': { en: 'Bac Kan', zh: '北𣴓' },
'Bạc Liêu': { en: 'Bac Lieu', zh: '薄辽' },
'Bắc Ninh': { en: 'Bac Ninh', zh: '北宁' },
'Bến Tre': { en: 'Ben Tre', zh: '槟椥' },
'Bình Định': { en: 'Binh Dinh', zh: '平定' },
'Bình Dương': { en: 'Binh Duong', zh: '平阳' },
'Bình Phước': { en: 'Binh Phuoc', zh: '平福' },
'Bình Thuận': { en: 'Binh Thuan', zh: '平顺' },
'Cà Mau': { en: 'Ca Mau', zh: '金瓯' },
'Cần Thơ': { en: 'Can Tho', zh: '芹苴' },
'Cao Bằng': { en: 'Cao Bang', zh: '高平' },
'Đà Nẵng': { en: 'Da Nang', zh: '岘港' },
'Đắk Lắk': { en: 'Dak Lak', zh: '多乐' },
'Đắk Nông': { en: 'Dak Nong', zh: '多农' },
'Điện Biên': { en: 'Dien Bien', zh: '奠边' },
'Đồng Nai': { en: 'Dong Nai', zh: '同奈' },
'Đồng Tháp': { en: 'Dong Thap', zh: '同塔' },
'Gia Lai': { en: 'Gia Lai', zh: '嘉莱' },
'Hà Giang': { en: 'Ha Giang', zh: '河江' },
'Hà Nam': { en: 'Ha Nam', zh: '河南' },
'Hà Nội': { en: 'Hanoi', zh: '河内' },
'Hà Tĩnh': { en: 'Ha Tinh', zh: '河静' },
'Hải Dương': { en: 'Hai Duong', zh: '海阳' },
'Hải Phòng': { en: 'Hai Phong', zh: '海防' },
'Hậu Giang': { en: 'Hau Giang', zh: '后江' },
'Hòa Bình': { en: 'Hoa Binh', zh: '和平' },
'Hưng Yên': { en: 'Hung Yen', zh: '兴安' },
'Khánh Hòa': { en: 'Khanh Hoa', zh: '庆和' },
'Kiên Giang': { en: 'Kien Giang', zh: '坚江' },
'Kon Tum': { en: 'Kon Tum', zh: '昆嵩' },
'Lai Châu': { en: 'Lai Chau', zh: '莱州' },
'Lâm Đồng': { en: 'Lam Dong', zh: '林同' },
'Lạng Sơn': { en: 'Lang Son', zh: '谅山' },
'Lào Cai': { en: 'Lao Cai', zh: '老街' },
'Long An': { en: 'Long An', zh: '隆安' },
'Nam Định': { en: 'Nam Dinh', zh: '南定' },
'Nghệ An': { en: 'Nghe An', zh: '乂安' },
'Ninh Bình': { en: 'Ninh Binh', zh: '宁平' },
'Ninh Thuận': { en: 'Ninh Thuan', zh: '宁顺' },
'Phú Thọ': { en: 'Phu Tho', zh: '富寿' },
'Phú Yên': { en: 'Phu Yen', zh: '富安' },
'Quảng Bình': { en: 'Quang Binh', zh: '广平' },
'Quảng Nam': { en: 'Quang Nam', zh: '广南' },
'Quảng Ngãi': { en: 'Quang Ngai', zh: '广义' },
'Quảng Ninh': { en: 'Quang Ninh', zh: '广宁' },
'Quảng Trị': { en: 'Quang Tri', zh: '广治' },
'Sóc Trăng': { en: 'Soc Trang', zh: '朔庄' },
'Sơn La': { en: 'Son La', zh: '山罗' },
'Tây Ninh': { en: 'Tay Ninh', zh: '西宁' },
'Thái Bình': { en: 'Thai Binh', zh: '太平' },
'Thái Nguyên': { en: 'Thai Nguyen', zh: '太原' },
'Thanh Hóa': { en: 'Thanh Hoa', zh: '清化' },
'Thừa Thiên Huế': { en: 'Thua Thien Hue', zh: '承天顺化' },
'Tiền Giang': { en: 'Tien Giang', zh: '前江' },
'TP. Hồ Chí Minh': { en: 'Ho Chi Minh City', zh: '胡志明市' },
'Trà Vinh': { en: 'Tra Vinh', zh: '茶荣' },
'Tuyên Quang': { en: 'Tuyen Quang', zh: '宣光' },
'Vĩnh Long': { en: 'Vinh Long', zh: '永隆' },
'Vĩnh Phúc': { en: 'Vinh Phuc', zh: '永福' },
'Yên Bái': { en: 'Yen Bai', zh: '安沛' },

// ═══════════════════════════════════════════════════════
// PAYMENT QR
// ═══════════════════════════════════════════════════════
'💳 Tạo Mã QR Thanh Toán': { en: '💳 Create Payment QR Code', zh: '💳 创建付款二维码' },
'💳 Tạo QR': { en: '💳 Create QR', zh: '💳 创建二维码' },
'🏦 Chọn Ngân Hàng': { en: '🏦 Select Bank', zh: '🏦 选择银行' },
'💰 Số Tài Khoản': { en: '💰 Account Number', zh: '💰 账号' },
'👤 Tên Chủ Tài Khoản': { en: '👤 Account Holder Name', zh: '👤 账户持有人姓名' },
'VD: NGUYEN VAN A': { en: 'e.g. NGUYEN VAN A', zh: '例：NGUYEN VAN A' },
'💵 Số Tiền': { en: '💵 Amount', zh: '💵 金额' },
'Nhập số tiền (VND)': { en: 'Enter amount (VND)', zh: '输入金额（VND）' },
'📝 Nội Dung Chuyển Khoản': { en: '📝 Transfer Content', zh: '📝 转账内容' },
'VD: Rút tiền phiên ABC123': { en: 'e.g. Withdrawal session ABC123', zh: '例：提现会话ABC123' },
'Tạo Mã QR': { en: 'Create QR Code', zh: '创建二维码' },
'✅ Mã QR Thanh Toán': { en: '✅ Payment QR Code', zh: '✅ 付款二维码' },
'🏦 Ngân hàng:': { en: '🏦 Bank:', zh: '🏦 银行：' },
'💰 Số TK:': { en: '💰 Account:', zh: '💰 账号：' },
'💵 Số tiền:': { en: '💵 Amount:', zh: '💵 金额：' },
'📝 Nội dung:': { en: '📝 Content:', zh: '📝 内容：' },
'Sao Chép Link QR': { en: 'Copy QR Link', zh: '复制二维码链接' },
'Tải Ảnh': { en: 'Download Image', zh: '下载图片' },
'Tạo Mã Khác': { en: 'Create Another', zh: '创建另一个' },
'⚠️ Tính năng này chỉ dành cho quản trị viên': { en: '⚠️ This feature is for CSKH Manh Lams only', zh: '⚠️ 此功能仅供管理员使用' },

// ═══════════════════════════════════════════════════════
// ADMIN.JS - Additional dynamic strings not in batch #1
// ═══════════════════════════════════════════════════════
'giờ trước': { en: 'hours ago', zh: '小时前' },
'ngày trước': { en: 'days ago', zh: '天前' },
'phút trước': { en: 'minutes ago', zh: '分钟前' },
'Đã đọc': { en: 'Read', zh: '已读' },
'Đang xuất dữ liệu phiên chơi...': { en: 'Exporting session data...', zh: '正在导出会话数据...' },
'Đang xóa tất cả phiên...': { en: 'Deleting all sessions...', zh: '正在删除所有会话...' },
'Chào mừng trở lại, admin999!': { en: 'Welcome back, admin999!', zh: '欢迎回来，admin999！' },
'Không tìm thấy yêu cầu rút tiền phù hợp': { en: 'No matching withdrawal requests found', zh: '未找到匹配的提现请求' },
'Loa Bluetooth': { en: 'Bluetooth Speaker', zh: '蓝牙音箱' },
'Tai nghe chống ồn': { en: 'Noise-cancelling headphones', zh: '降噪耳机' },
'Tai nghe premium': { en: 'Premium headphones', zh: '高端耳机' },
'Người dùng:': { en: 'User:', zh: '用户：' },
'Số tiền:': { en: 'Amount:', zh: '金额：' },
'Số tài khoản:': { en: 'Account number:', zh: '账号：' },
'Tên chủ:': { en: 'Holder:', zh: '持有人：' },

// Session detail in admin
'Ngày tạo': { en: 'Created date', zh: '创建日期' },
'Tổng hộp': { en: 'Total boxes', zh: '总盒子数' },
'Hộp mở': { en: 'Boxes opened', zh: '已开盒子' },
'🏆 Phần quà': { en: '🏆 Prizes', zh: '🏆 奖品' },
'📝 Ghi chú': { en: '📝 Notes', zh: '📝 备注' },
'📍 Chọn lúc:': { en: '📍 Selected at:', zh: '📍 选择时间：' },
'Xem chi tiết': { en: 'View details', zh: '查看详情' },

// Game session controller - finance editing
'Tiền hộp': { en: 'Box amount', zh: '盒子金额' },
'UNLUCKY': { en: 'UNLUCKY', zh: 'UNLUCKY' },
'Đã nhận thưởng': { en: 'Prize claimed', zh: '已领奖' },

// ═══════════════════════════════════════════════════════
// LUCKY V2 - Additional dynamic strings
// ═══════════════════════════════════════════════════════
'Giao diện 1': { en: 'Theme 1', zh: '界面 1' },
'Giao diện 2': { en: 'Theme 2', zh: '界面 2' },
'Giao diện 3': { en: 'Theme 3', zh: '界面 3' },
'Giao diện 4': { en: 'Theme 4', zh: '界面 4' },
'Giao diện 5': { en: 'Theme 5', zh: '界面 5' },
'Giao diện 6': { en: 'Theme 6', zh: '界面 6' },
'Giao diện 7': { en: 'Theme 7', zh: '界面 7' },
'Giao diện 8': { en: 'Theme 8', zh: '界面 8' },
'Giao diện 9': { en: 'Theme 9', zh: '界面 9' },
'Đang dùng': { en: 'In use', zh: '使用中' },
'Không thể đổi giao diện': { en: 'Cannot change theme', zh: '无法更改界面' },
'Không thể khởi tạo homepage': { en: 'Cannot initialize homepage', zh: '无法初始化首页' },
'Đã mở - Unlucky': { en: 'Opened - Unlucky', zh: '已开 - 未中奖' },
'Kết quả UNLUCKY - hộp quà không có phần thưởng khả dụng': { en: 'UNLUCKY result - box has no available prize', zh: 'UNLUCKY结果 - 盒子没有可用奖品' },
'⏰ Phiên đã hết hạn, vui lòng nhập lại mã phiên': { en: '⏰ Session expired, please re-enter session code', zh: '⏰ 会话已过期，请重新输入会话代码' },
'Đã tải xong 100%': { en: 'Loading complete 100%', zh: '加载完成100%' },
'USD/NDT đang duyệt, sẽ tự cộng': { en: 'USD/CNY pending approval, will auto-add', zh: 'USD/CNY待审核，将自动添加' },
'❌ Số dư không đủ để rút': { en: '❌ Insufficient balance for withdrawal', zh: '❌ 余额不足，无法提现' },
'Đang chờ duyệt quy đổi thêm': { en: 'Pending additional conversion approval', zh: '等待额外兑换审核' },
'Đã từ chối quy đổi': { en: 'Conversion rejected', zh: '兑换已拒绝' },
'Chưa hoàn tất': { en: 'Not completed', zh: '未完成' },
'⚠️ Hệ thống chưa nhận được quyết định duyệt từ admin trong thời gian chờ.': { en: '⚠️ System has not received admin decision during waiting time.', zh: '⚠️ 系统在等待期间未收到管理员决定。' },
'💬 Vui lòng liên hệ bộ phận chăm sóc khách hàng để được xử lý ngay.': { en: '💬 Please contact customer care for immediate processing.', zh: '💬 请联系客服进行立即处理。' },
'Không khả dụng': { en: 'Not available', zh: '不可用' },
'Hộp quà': { en: 'Gift box', zh: '礼盒' },
'Yêu cầu đã được hệ thống ghi nhận': { en: 'Request recorded by system', zh: '请求已被系统记录' },
'Không định giá': { en: 'No price', zh: '未定价' },
'Lỗi quy đổi': { en: 'Conversion error', zh: '兑换错误' },
'Tài khoản: ****': { en: 'Account: ****', zh: '账号：****' },
'Đang xử lý yêu cầu': { en: 'Processing request', zh: '正在处理请求' },
'Đang xác thực phiên chơi...': { en: 'Authenticating session...', zh: '正在验证会话...' },
'Đang gửi thông tin quy đổi...': { en: 'Sending conversion info...', zh: '正在发送兑换信息...' },
'🎉 Sắp công bố phần thưởng...': { en: '🎉 Prize about to be revealed...', zh: '🎉 即将公布奖品...' },
'🎊 Kết nối kho quà bí ẩn...': { en: '🎊 Connecting to mystery gift store...', zh: '🎊 连接神秘礼品库...' },
'🔮 Xác thực phần thưởng...': { en: '🔮 Verifying prize...', zh: '🔮 验证奖品...' },
'❌ Lỗi form. Vui lòng tải lại trang.': { en: '❌ Form error. Please reload page.', zh: '❌ 表单错误。请重新加载页面。' },
'❌ Lỗi hiển thị form nhận quà. Vui lòng tải lại trang.': { en: '❌ Error displaying gift form. Please reload page.', zh: '❌ 显示礼物表单错误。请重新加载页面。' },
'❌ Lỗi hiển thị kết quả thua. Vui lòng tải lại trang.': { en: '❌ Error displaying loss result. Please reload page.', zh: '❌ 显示失败结果错误。请重新加载页面。' },
'❌ Lỗi tải phần quà:': { en: '❌ Error loading prize:', zh: '❌ 加载奖品错误：' },
'📷 Đã copy mô tả kết quả, bạn có thể dán kèm ảnh chụp.': { en: '📷 Result description copied, you can paste with screenshot.', zh: '📷 结果描述已复制，您可以粘贴截图。' },
'📷 Vui lòng dùng nút chụp màn hình của thiết bị!': { en: '📷 Please use your device\'s screenshot button!', zh: '📷 请使用设备的截图按钮！' },
'Không tìm thấy ô nhập mã phiên': { en: 'Session code input not found', zh: '未找到会话代码输入框' },
'Gọi điện': { en: 'Call', zh: '拨打电话' },
'Đang tải dữ liệu phiên và ảnh phần thưởng...': { en: 'Loading session data and prize images...', zh: '正在加载会话数据和奖品图片...' },
'Đang tải toàn bộ thông tin hộp quà, ví và giao dịch...': { en: 'Loading all gift box, wallet and transaction data...', zh: '正在加载所有礼盒、钱包和交易数据...' },
'Đang tải dữ liệu phiên...': { en: 'Loading session data...', zh: '正在加载会话数据...' },
'Lịch sử giao dịch phiên': { en: 'Session transaction history', zh: '会话交易历史' },
'Tổng hợp đầy đủ hộp quà, trạng thái xử lý, ví và lịch sử giao dịch theo phiên.': { en: 'Complete summary of gift boxes, processing status, wallet and transaction history by session.', zh: '按会话汇总礼盒、处理状态、钱包和交易历史。' },
'Kết quả hộp quà': { en: 'Gift box result', zh: '礼盒结果' },
'Các quà của bạn đang chờ xử lý hoặc đã được xác nhận!': { en: 'Your gifts are pending or confirmed!', zh: '您的礼物正在处理中或已确认！' },
'Quà quý': { en: 'Precious gift', zh: '珍贵礼物' },
'💎 Phần Quà Đã Mở': { en: '💎 Opened Prizes', zh: '💎 已开奖品' },
'🏆 Phần Quà Đã Mở': { en: '🏆 Opened Prizes', zh: '🏆 已开奖品' },
'Hộp mở': { en: 'Box opened', zh: '盒子已打开' },
'Chi tiết phần quà': { en: 'Prize details', zh: '奖品详情' },
'Phần quà từ hộp quà bí mật': { en: 'Prize from mystery gift box', zh: '来自神秘礼盒的奖品' },

// Fake names for ticker
'Nguyễn Văn Hùng': { en: 'Nguyen Van Hung', zh: '阮文雄' },
'Trần Thị Mai': { en: 'Tran Thi Mai', zh: '陈氏梅' },
'Lê Văn Tùng': { en: 'Le Van Tung', zh: '黎文松' },
'Phạm Thị Hoa': { en: 'Pham Thi Hoa', zh: '范氏花' },
'Hoàng Minh Tuấn': { en: 'Hoang Minh Tuan', zh: '黄明俊' },
'Vũ Văn Nam': { en: 'Vu Van Nam', zh: '武文南' },
'Đỗ Thị Lan': { en: 'Do Thi Lan', zh: '杜氏兰' },
'Bùi Thị Thu': { en: 'Bui Thi Thu', zh: '裴氏秋' },
'Ngô Văn Đức': { en: 'Ngo Van Duc', zh: '吴文德' },
'Dương Thị Hằng': { en: 'Duong Thi Hang', zh: '杨氏恒' },

// Session controller dynamic messages
'Bỏ qua hộp UNLUCKY': { en: 'Skipped UNLUCKY boxes', zh: '跳过UNLUCKY盒子' },

// ═══════════════════════════════════════════════════════
// ADMIN.JS - Session detail view (dynamic HTML)
// ═══════════════════════════════════════════════════════
'✅ Đã xử lý': { en: '✅ Processed', zh: '✅ 已处理' },
'Chi tiết 3 yêu cầu gần nhất:': { en: 'Details of 3 most recent requests:', zh: '最近3个请求详情：' },
'Nền giao diện người chơi': { en: 'Player interface background', zh: '玩家界面背景' },
'Mạnh Lâm TaoBao': { en: 'Manh Lam TaoBao', zh: '明林淘宝' },

// Missing misc strings
'Đang chơi': { en: 'Playing', zh: '正在游戏' },
'Đã hoàn tất': { en: 'Completed', zh: '已完成' },
'Chưa cập nhật': { en: 'Not updated', zh: '未更新' },
'Không xác định': { en: 'Unknown', zh: '未知' },
'🔍 Xác thực': { en: '🔍 Verifying', zh: '🔍 验证中' },
'➡️ Tiếp tục mở hộp': { en: '➡️ Continue opening boxes', zh: '➡️ 继续打开盒子' },

};

let updatedEn = 0;
let updatedZh = 0;
let newKeys = 0;

for (const [vi, trans] of Object.entries(map)) {
  if (!(vi in tpl.vi)) {
    tpl.vi[vi] = vi;
    newKeys++;
  }
  if (trans.en && String(tpl.en[vi] || '').trim() !== trans.en) {
    tpl.en[vi] = trans.en;
    updatedEn++;
  }
  if (trans.zh && String(tpl.zh[vi] || '').trim() !== trans.zh) {
    tpl.zh[vi] = trans.zh;
    updatedZh++;
  }
}

fs.writeFileSync(templatePath, JSON.stringify(tpl, null, 2));
console.log(JSON.stringify({
  mappingSize: Object.keys(map).length,
  updatedEn,
  updatedZh,
  newKeys,
  totalViKeys: Object.keys(tpl.vi).length,
  totalEnKeys: Object.keys(tpl.en).length,
  totalZhKeys: Object.keys(tpl.zh).length,
}, null, 2));
