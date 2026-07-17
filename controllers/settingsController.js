const fs = require('fs');
const path = require('path');
const { isLocalPC } = require('../utils/envSetup');

const SETTINGS_FILE = path.join(__dirname, '../config/settings.json');
const SETTINGS_CACHE_TTL_MS = Math.max(1000, Number(process.env.SETTINGS_CACHE_TTL_MS || 10000));
const SETTINGS_DB_QUERY_TIMEOUT_MS = Math.max(500, Number(process.env.SETTINGS_DB_QUERY_TIMEOUT_MS || 1200));
let settingsCache = null;
let settingsCacheAt = 0;
let settingsCachePromise = null;

const cloneSettings = (settings) => JSON.parse(JSON.stringify(settings));

const withTimeout = async (promise, timeoutMs, fallbackValue = null) => {
    let timer = null;
    try {
        const timeoutPromise = new Promise((resolve) => {
            timer = setTimeout(() => resolve(fallbackValue), timeoutMs);
        });
        return await Promise.race([promise, timeoutPromise]);
    } finally {
        if (timer) clearTimeout(timer);
    }
};

const invalidateSettingsCache = () => {
    settingsCache = null;
    settingsCacheAt = 0;
    settingsCachePromise = null;
};

const getDefaultSettings = () => ({
    content: {
        mainTitle: 'Manh Lam Store',
        mainDescription: 'Tham gia chơi game nhận quà tặng hấp dẫn',
        bannerText: '',
        bannerVisible: false,
        footerText: '© 2024 - Manh Lam Store. All rights reserved.',
        customText: '',
        brandName: 'Mạnh Lâm TaoBao',
        headTitle: 'Mạnh Lâm TaoBao - Mở Hộp Quà Bí Ẩn',
        heroTitle: 'Mở Hộp Quà Bí Ẩn',
        heroSubtitle: 'Chọn một hộp quà bên dưới để thử vận may!',
        loginTitle: 'Nhập mã phiên chơi',
        loginPlaceholder: 'Nhập mã phiên...',
        loginButton: 'Bắt đầu chơi',
        winPopupTitle: '🎉 Chúc mừng bạn!',
        losePopupTitle: '😢 Chúc bạn may mắn lần sau!',
        thankyouTitle: 'Cảm ơn bạn!',
        thankyouMessage: 'Cảm ơn bạn đã tham gia. Chúng tôi sẽ liên hệ sớm nhất!',
        advancedTexts: {}
    },
    features: {
        history: true,
        chat: true,
        twoFA: false,
        withdraw: true,
        gifts: true,
        enableWithdraw: true,
        enableGift: true,
        enableChat: true,
        showUnluckyPopup: false,
        allowReopenPopup: true,
        showCelebrationEffects: true,
        enablePushNotification: true,
        enableFloatingNotification: true,
        enableOnlineStatus: true,
        enableTypingIndicator: true,
        enableSoundEffects: true,
        enableAutoReply: true,
        enableMaintenanceMode: isLocalPC ? false : true,
        enablePlayerRegistration: true,
        enableEmailNotification: false,
        enableDailyLimit: false,
        dailyPlayLimit: 10,
        enableWallet: true,
        enableInventory: true,
        enableThemePicker: true,
        enableVisitorCounter: true,
        enableShareButton: false,
        enableCountdown: true,
        enableTrustScore: true,
        enableAnimatedBoxes: true,
        enableMultipleBoxOpen: false,
        maxBoxesPerSession: 1,
        enableBoxPreview: false,
        enableHintSystem: false,
        enableStreakBonus: false,
        streakBonusThreshold: 3,
        enableReferral: false,
        referralReward: '',
        enableLeaderboard: false,
        leaderboardSize: 10,
        enableAchievements: false,
        enableTimerChallenge: false,
        timerDuration: 30
    },
    scripts: {
        css: '',
        js: ''
    },
    logo: {
        url: '',
        height: 160,
        maxWidth: 100,
        padding: 0,
        alignment: 'center',
        borderRadius: 50,
        shadow: 'none',
        bgColor: 'transparent',
        border: 'none',
        altText: 'Logo',
        linkUrl: '/'
    },
    autoDeleteDays: 15,
    floatingNotification: {
        enabled: true,
        alwaysOn: true,
        position: 'left',
        showRecipientName: true,
        showPrizeName: true,
        displayDuration: 6000,
        maxVisible: 3,
        minIntervalMs: 1800,
        maxIntervalMs: 3200,
        customMessages: [],
        bgColor: 'rgba(30,27,56,0.95)',
        textColor: '#e8e6ff',
        borderColor: 'rgba(124,58,237,0.3)',
        showAvatar: true,
        animationType: 'slideIn',
        showTimestamp: false,
        soundUrl: '',
        template: '🎁 {name} vừa nhận được {prize}!',
        customImageUrl: '/uploads/1773584675707-photo_2026-03-03_15-00-03.jpg',
        prizePool: [
            'Lì xì trị giá 88,888 NDT',
            'Lì xì trị giá 3,888 USD',
            'Lì xì trị giá 50,000,000 VND',
            '1 cây vàng SJC 9999',
            'Ô tô hạng sang',
            'Ô tô điện cao cấp',
            'Ô tô điện hạng sang phiên bản giới hạn',
            'Ô tô BMW 5 Series',
            'Ô tô Mercedes C300',
            'Ô tô Lexus RX',
            'Xe máy SH',
            'Điện thoại iPhone 17 Pro Max',
            'Điện thoại iPhone 17 Ultra',
            'Điện thoại Samsung Galaxy S26 Ultra',
            'Điện thoại Vertu Signature',
            'Voucher mua sắm 20,000,000 VND',
            'Đồng hồ thông minh',
            '5 cây vàng SJC 9999',
            '10 cây vàng SJC 9999',
            '1kg bạc 999',
            '5kg bạc 999',
            'Nhẫn kim cương VVS1',
            'Dây chuyền vàng 24K cao cấp',
            'Lắc tay vàng trắng đính kim cương',
            'Bộ vali Rimowa phiên bản giới hạn',
            'Set nước hoa niche cao cấp',
            'Laptop gaming RTX 5090',
            'Bộ sofa da Ý cao cấp',
            'Thẻ thành viên golf VIP 1 năm',
            'Du thuyền trải nghiệm 2 ngày 1 đêm',
            'Bộ camera full-frame chuyên nghiệp',
            'Xe điện hạng sang',
            'Kim cương 1 carat chứng nhận GIA',
            'Voucher nghỉ dưỡng 7 ngày 6 đêm Maldives',
            'Combo nội thất thông minh toàn nhà'
        ]
    },
    pushNotification: {
        enabled: true,
        title: 'Manh Lam Store',
        icon: '',
        defaultMessage: 'Bạn có thông báo mới!',
        soundEnabled: true,
        badge: '',
        requireInteraction: false,
        vibrate: true
    },
    userNotification: {
        enabled: true,
        welcomeMessage: 'Chào mừng bạn đến với Manh Lam Store!',
        winMessage: 'Chúc mừng {name}! Bạn đã nhận được {prize}!',
        withdrawMessage: 'Yêu cầu rút tiền của bạn đang được xử lý.',
        customMessages: []
    },
    appearance: {
        primaryColor: '#3b82f6',
        accentColor: '#10b981',
        navIconBoxColor: '#7c3aed',
        darkMode: false,
        homepageTheme: 'new_homepage.html',
        homepageThemeLabels: {
            'new_homepage.html': 'Giao diện 1',
            'background_upgraded.html': 'Giao diện 2',
            'background.html': 'Giao diện 3',
            'background-alt.html': 'Giao diện 4',
            'background (1).html': 'Giao diện 5',
            'card_v3_purple.html': 'Giao diện 6',
            'card_v4_cyber.html': 'Giao diện 7',
            'card_v4_cyber (1).html': 'Giao diện 8',
            'card_v5_baroque.html': 'Giao diện 9'
        },
        animationSpeed: 'normal',
        borderRadius: 12,
        fontSize: 14,
        fontFamily: 'Poppins',
        bgType: 'aurora',
        bgColor1: '#0f0c29',
        bgColor2: '#302b63',
        bgColor3: '#24243e',
        bgImage: '',
        bgOverlayOpacity: 40,
        cardBg: 'rgba(255,255,255,0.08)',
        cardBorderColor: 'rgba(255,255,255,0.12)',
        navStyle: 'glass',
        buttonStyle: 'gradient',
        boxStyle: 'default',
        boxGlowColor: '#fbbf24',
        popupStyle: 'glass',
        playerCustomCss: '',
        playerCustomJs: ''
    },
    chat: {
        headerTitle: 'CSKH Mạnh Lâm TaoBao',
        headerSubtitle: 'Chúng tôi sẵn sàng giúp bạn',
        placeholder: 'Nhập tin nhắn...',
        welcomeText: 'Xin chào! Bạn cần hỗ trợ gì?',
        offlineText: 'Hiện tại không có nhân viên trực. Vui lòng để lại tin nhắn.',
        position: 'right',
        bubbleColor: '#3b82f6',
        bubbleIcon: '💬',
        autoGreeting: true,
        autoGreetingDelay: 3000,
        adminAvatar: '',
        adminName: 'CSKH Mạnh Lâm TaoBao',
        headerBgColor: '',
        headerTextColor: '',
        enableFileUpload: true,
        enableImageUpload: true,
        enableEmoji: true,
        maxFileSize: 5,
        enableReadReceipts: true,
        enableQuickReplies: true,
        quickReplies: [],
        iconLibrary: ['💬', '🎧', '🛟', '📞', '🧑‍💻', '🤝', '📨', '🧠', '✨', '🎁'],
        adminToastGroupEnabled: true,
        adminToastGroupWindowMs: 2000,
        adminToastSwipeDismissEnabled: true
    },
    seo: {
        pageTitle: 'Mở Hộp Quà Bí Ẩn - Nhận Thưởng Hấp Dẫn',
        metaDescription: 'Tham gia mở hộp quà bí ẩn để nhận những phần thưởng hấp dẫn. Thử vận may ngay!',
        favicon: '/favicon.ico',
        ogImage: '',
        keywords: 'hộp quà, trúng thưởng, may mắn, game'
    },
    popup: {
        showConfetti: true,
        confettiDuration: 3000,
        showPrizeImage: true,
        autoClose: false,
        autoCloseDelay: 10000,
        showClaimButton: true,
        showShareButton: false,
        customWinHtml: '',
        customLoseHtml: ''
    },
    boxSettings: {
        totalBoxes: 3,
        boxSize: 'medium',
        boxOpenAnimation: 'shake',
        boxOpenDuration: 2000,
        showBoxNumber: false,
        boxColors: ['#fbbf24', '#f472b6', '#34d399'],
        boxIcon: '🎁',
        openedBoxIcon: '📦',
        boxGlowColor: '#fbbf24',
        enable3d: false,
        enableDragDrop: false,
        templateHtml: '',
        templateCss: '',
        templateJs: '',
        partLayout: {
            lid: { x: 0, y: 0, rotate: 0, scale: 1 },
            body: { x: 0, y: 0, rotate: 0, scale: 1 },
            ribbon: { x: 0, y: 0, rotate: 0, scale: 1 }
        },
        partPresetLibrary: [],
        extraAnimations: ['shake', 'flip', 'bounce', 'explode', 'fade']
    },
    security: {
        maxLoginAttempts: 5,
        lockoutDuration: 15,
        sessionTimeout: 60,
        minTrustScoreForWithdrawal: 100,
        enableCaptcha: false,
        enableRateLimit: true,
        rateLimit: 100,
        rateLimitWindow: 15,
        enableIPBlock: false,
        blockedIPs: [],
        allowedOrigins: ['*']
    },
    exchangeRates: {
        USD: 26000,
        NDT: 3800
    },
    email: {
        enabled: false,
        smtpHost: '',
        smtpPort: 587,
        smtpUser: '',
        smtpPass: '',
        fromName: 'Manh Lam Store',
        fromEmail: '',
        winTemplate: '',
        withdrawTemplate: ''
    },
    social: {
        facebook: '',
        zalo: '',
        telegram: '',
        phone: '',
        email: '',
        website: '',
        showInFooter: true,
        showInChat: false
    },
    watermark: {
        enabled: false,
        text: '',
        imageUrl: '',
        type: 'text',
        position: 'bottom-right',
        opacity: 30,
        fontSize: 12,
        imageSize: 60,
        imageOpacity: 30
    },
    maintenance: {
        enabled: isLocalPC ? false : true,
        message: 'Hiện tại web này không còn hoạt động nữa mà đã được chuyển giao sang : manhlamstore.shop',
        estimatedTime: '',
        allowAdmin: true
    },
    modalEditor: {
        winPopup: { bgGradient: '', badgeText: '', thanksText: '', customCss: '', customHtml: '' },
        celebrate: { customCss: '', customHtml: '' },
        withdrawal: { customCss: '', customHtml: '' },
        approvalWait: { customCss: '', customHtml: '' },
        thankYou: { customCss: '', customHtml: '' },
        hub: { customCss: '', customHtml: '' },
        sessionDetail: { customCss: '', customHtml: '' },
        claimModal: { customCss: '', customHtml: '' },
        chatPreForm: { customCss: '', customHtml: '' },
        lightbox: { customCss: '', customHtml: '' }
    },
    i18n: {
        defaultLang: 'vi',
        enableAutoDetect: true,
        enableLangSwitcher: true,
        customTranslations: {}
    },
    animationPresets: {
        presets: [
            { name: 'shake', label: 'Rung lắc', duration: 600, css: '' },
            { name: 'flip', label: 'Lật', duration: 800, css: '' },
            { name: 'bounce', label: 'Nhảy', duration: 700, css: '' },
            { name: 'explode', label: 'Nổ', duration: 1000, css: '' },
            { name: 'fade', label: 'Mờ dần', duration: 600, css: '' },
            { name: 'spin3d', label: 'Xoay 3D', duration: 900, css: '' },
            { name: 'warp', label: 'Biến dạng', duration: 800, css: '' }
        ]
    },
    boxTemplateLibrary: []
});

const normalizeVietnameseText = (value, fallback) => {
    const raw = String(value || '').trim();
    if (!raw) return fallback;
    const lower = raw.toLowerCase();

    // Hosting/database charset issues may degrade Vietnamese to '?'.
    const looksBroken =
        lower.includes('nh?p') ||
        lower.includes('phi?n') ||
        lower.includes('m?') ||
        lower.includes('ch?i');

    return looksBroken ? fallback : raw;
};

const normalizeSettings = (settings) => {
    const defaults = getDefaultSettings();
    const merged = { ...defaults, ...(settings || {}) };

    merged.content = { ...(defaults.content || {}), ...(merged.content || {}) };
    merged.logo = { ...(defaults.logo || {}), ...(merged.logo || {}) };
    merged.seo = { ...(defaults.seo || {}), ...(merged.seo || {}) };

    merged.content.loginTitle = normalizeVietnameseText(
        merged.content.loginTitle,
        defaults.content.loginTitle
    );
    merged.content.loginPlaceholder = normalizeVietnameseText(
        merged.content.loginPlaceholder,
        defaults.content.loginPlaceholder
    );

    merged.chat = { ...(defaults.chat || {}), ...(merged.chat || {}) };
    const legacyChatNames = new Set([
        '',
        'manhlamstore',
        'cs support',
        'hỗ trợ viên',
        'ho tro vien',
        'cskh mạnh lâm store',
        'cskh manh lam store'
    ]);
    const normalizedHeaderTitle = String(merged.chat.headerTitle || '').trim().toLowerCase();
    const normalizedAdminName = String(merged.chat.adminName || '').trim().toLowerCase();
    if (legacyChatNames.has(normalizedHeaderTitle) || normalizedHeaderTitle === 'chăm sóc khách hàng 24/7' || normalizedHeaderTitle === 'hỗ trợ trực tuyến') {
        merged.chat.headerTitle = defaults.chat.headerTitle;
    }
    if (legacyChatNames.has(normalizedAdminName)) {
        merged.chat.adminName = defaults.chat.adminName;
    }

    if (!merged.content.advancedTexts || typeof merged.content.advancedTexts !== 'object' || Array.isArray(merged.content.advancedTexts)) {
        merged.content.advancedTexts = {};
    }

    // Keep favicon in sync with logo when favicon is empty.
    if (merged.logo.url && (!merged.seo.favicon || merged.seo.favicon === '/favicon.ico')) {
        merged.seo.favicon = merged.logo.url;
    }

    return merged;
};

// ===== DB-backed settings with file fallback =====
let _db = null;
const getDB = () => {
    if (!_db) {
        try { _db = require('../models'); } catch (e) { /* models not ready yet */ }
    }
    return _db;
};

// Read all settings from DB, fall back to file
const readSettingsFromDB = async () => {
    const now = Date.now();
    if (settingsCache && (now - settingsCacheAt) < SETTINGS_CACHE_TTL_MS) {
        return cloneSettings(settingsCache);
    }

    if (settingsCachePromise) {
        const shared = await settingsCachePromise;
        return cloneSettings(shared);
    }

    const db = getDB();
    settingsCachePromise = (async () => {
        if (db && db.SiteSettings) {
            try {
                const rows = await withTimeout(
                    db.SiteSettings.findAll({ raw: true }),
                    SETTINGS_DB_QUERY_TIMEOUT_MS,
                    null
                );
                if (Array.isArray(rows) && rows.length > 0) {
                    const merged = getDefaultSettings();
                    for (const row of rows) {
                        try { merged[row.key] = JSON.parse(row.value); } catch (_) { merged[row.key] = row.value; }
                    }
                    settingsCache = normalizeSettings(merged);
                    settingsCacheAt = Date.now();
                    return settingsCache;
                }
            } catch (_) { /* table might not exist yet */ }
        }
        // Fallback to file
        settingsCache = normalizeSettings(readSettingsFromFile());
        settingsCacheAt = Date.now();
        return settingsCache;
    })();

    try {
        const fresh = await settingsCachePromise;
        return cloneSettings(fresh);
    } finally {
        settingsCachePromise = null;
    }
};

const readSettingsFromFile = () => {
    try {
        if (fs.existsSync(SETTINGS_FILE)) {
            return normalizeSettings(JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8')));
        }
    } catch (_) {}
    return normalizeSettings(getDefaultSettings());
};

// Write settings to both DB and file (file as backup)
const writeSettingsToDB = async (settings) => {
    const normalized = normalizeSettings(settings);
    invalidateSettingsCache();

    // Write file as best-effort backup (hosting may not allow writes here).
    try {
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(normalized, null, 2), 'utf8');
    } catch (e) {
        console.error('[Settings] File backup write skipped:', e.message);
    }

    const db = getDB();
    if (db && db.SiteSettings) {
        try {
            const promises = Object.keys(normalized).map(key => {
                const val = typeof normalized[key] === 'object' ? JSON.stringify(normalized[key]) : String(normalized[key]);
                return db.SiteSettings.upsert({ key, value: val });
            });
            await Promise.all(promises);
        } catch (e) {
            console.error('DB write fallback to file only:', e.message);
        }
    }
    settingsCache = cloneSettings(normalized);
    settingsCacheAt = Date.now();
};

const getSettings = async (req, res) => {
    try {
        const settings = await readSettingsFromDB();
        res.json({
            success: true,
            data: settings,
            message: 'Settings retrieved successfully'
        });
    } catch (error) {
        console.error('Error reading settings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve settings',
            error: error.message
        });
    }
};

const initSettingsFile = () => {
    try {
        if (!fs.existsSync(SETTINGS_FILE)) {
            const defaults = getDefaultSettings();
            fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaults, null, 2), 'utf8');
        }
    } catch (e) {
        console.error('Failed to initialize settings file:', e);
    }
};

const updateSettings = async (req, res) => {
    try {
        const settings = normalizeSettings(await readSettingsFromDB());

        const mergeSections = ['content', 'features', 'scripts', 'logo', 'floatingNotification', 'pushNotification', 'userNotification', 'appearance', 'maintenance', 'chat', 'seo', 'popup', 'boxSettings', 'security', 'exchangeRates', 'email', 'social', 'watermark', 'modalEditor', 'i18n', 'animationPresets'];
        for (const section of mergeSections) {
            if (req.body[section]) {
                settings[section] = { ...(settings[section] || {}), ...req.body[section] };
            }
        }

        // If logo is updated from admin, persist favicon together.
        if (req.body.logo && Object.prototype.hasOwnProperty.call(req.body.logo, 'url')) {
            settings.seo = settings.seo || {};
            settings.seo.favicon = req.body.logo.url || '/favicon.ico';
        }

        if (req.body.autoDeleteDays !== undefined) {
            settings.autoDeleteDays = parseInt(req.body.autoDeleteDays, 10) || settings.autoDeleteDays || 15;
        }

        // Handle boxTemplateLibrary array replacement
        if (req.body.boxTemplateLibrary !== undefined) {
            settings.boxTemplateLibrary = Array.isArray(req.body.boxTemplateLibrary) ? req.body.boxTemplateLibrary : [];
        }

        const normalized = normalizeSettings(settings);
        await writeSettingsToDB(normalized);

        res.json({
            success: true,
            data: normalized,
            message: 'Settings updated successfully'
        });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update settings',
            error: error.message
        });
    }
};

const resetSettings = async (req, res) => {
    try {
        const defaultSettings = getDefaultSettings();
        await writeSettingsToDB(defaultSettings);

        res.json({
            success: true,
            data: defaultSettings,
            message: 'Settings reset to defaults'
        });
    } catch (error) {
        console.error('Error resetting settings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reset settings',
            error: error.message
        });
    }
};

module.exports = {
    getSettings,
    updateSettings,
    resetSettings,
    initSettingsFile,
    getDefaultSettings,
    readSettingsFromDB
};
