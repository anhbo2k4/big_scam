const db = require('../models');

// Stubs for legacy chatbot logic to keep imports from breaking
async function generateBotResponse(sessionCode, customerMessage, customerName = 'Bạn') {
    return { success: true, data: null };
}

function getQuickReplies() {
    return [];
}

async function sendSatisfactionSurvey(sessionCode, customerName) {
    return { success: true, data: null };
}

async function handleSatisfactionRating(sessionCode, rating, feedback) {
    return { success: true };
}

function matchFAQ(userMessage) {
    return { matched: false, response: null, confidence: 0, type: null };
}

async function downloadImagesZip(req, res) {
    try {
        const session = req.session;
        const user = session ? session.user : null;
        const role = String(user ? user.role : '').trim().toLowerCase();
        if (role !== 'admin') {
            return res.status(403).send('Chỉ tài khoản admin mới được quyền tải.');
        }

        const { execSync } = require('child_process');
        const fs = require('fs');
        const path = require('path');

        const rootDir = path.join(__dirname, '..');
        const uploadsDir = path.join(rootDir, 'public/uploads');
        const imagesDir = path.join(rootDir, 'public/images');
        const destZip = path.join(rootDir, 'public/images.zip');

        // Xóa file zip cũ nếu có
        if (fs.existsSync(destZip)) {
            try { fs.unlinkSync(destZip); } catch (e) {}
        }

        let success = false;

        // Thử sử dụng lệnh 'zip' có sẵn trên Linux
        try {
            execSync(`zip -r "${destZip}" public/uploads public/images`, { cwd: rootDir, stdio: 'ignore' });
            if (fs.existsSync(destZip)) success = true;
        } catch (e) {}

        // Thử sử dụng lệnh 'tar' (hỗ trợ Windows và Linux đời mới)
        if (!success) {
            try {
                execSync(`tar -a -c -f "${destZip}" public/uploads public/images`, { cwd: rootDir, stdio: 'ignore' });
                if (fs.existsSync(destZip)) success = true;
            } catch (e) {}
        }

        // Thử nén bằng thư viện adm-zip (đã cài đặt sẵn)
        if (!success) {
            try {
                const AdmZip = require('adm-zip');
                const zip = new AdmZip();
                if (fs.existsSync(uploadsDir)) zip.addLocalFolder(uploadsDir, 'public/uploads');
                if (fs.existsSync(imagesDir)) zip.addLocalFolder(imagesDir, 'public/images');
                zip.writeZip(destZip);
                if (fs.existsSync(destZip)) success = true;
            } catch (e) {}
        }

        if (!success) {
            return res.status(500).send('Không thể nén tệp ảnh trên hosting.');
        }
        if (!fs.existsSync(destZip)) {
            return res.status(500).send('Không thể nén tệp ảnh trên hosting.');
        }

        // Gửi file nén về trình duyệt và xóa ngay sau khi gửi thành công/thất bại
        res.download(destZip, 'images.zip', function (err) {
            try {
                if (fs.existsSync(destZip)) fs.unlinkSync(destZip);
            } catch (e) {}
        });
    } catch (err) {
        res.status(500).send('Lỗi hệ thống: ' + err.message);
    }
}

module.exports = {
    generateBotResponse,
    getQuickReplies,
    sendSatisfactionSurvey,
    handleSatisfactionRating,
    matchFAQ,
    downloadImagesZip
};
