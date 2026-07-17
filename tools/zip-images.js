// tools/zip-images.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const uploadsDir = path.join(rootDir, 'public/uploads');
const imagesDir = path.join(rootDir, 'public/images');
const destZip = path.join(rootDir, 'public/images.zip');

console.log('--- Khởi động nén toàn bộ ảnh ---');

// Kiểm tra xem các thư mục có tồn tại không
if (!fs.existsSync(uploadsDir) && !fs.existsSync(imagesDir)) {
    console.error('Không tìm thấy thư mục public/uploads hoặc public/images!');
    process.exit(1);
}

// Xóa file zip cũ nếu có
if (fs.existsSync(destZip)) {
    try {
        fs.unlinkSync(destZip);
    } catch (_) {}
}

let success = false;

// Cách 1: Thử sử dụng lệnh 'zip' có sẵn trên Linux hosting
try {
    console.log('Thử nén bằng lệnh zip...');
    execSync(`zip -r "${destZip}" public/uploads public/images`, { cwd: rootDir, stdio: 'ignore' });
    if (fs.existsSync(destZip)) {
        console.log('=> Thành công nén bằng lệnh zip!');
        success = true;
    }
} catch (e) {
    console.log('Không thể dùng lệnh zip.');
}

// Cách 2: Thử sử dụng lệnh 'tar' (hỗ trợ cả Windows và Linux đời mới)
if (!success) {
    try {
        console.log('Thử nén bằng lệnh tar...');
        execSync(`tar -a -c -f "${destZip}" public/uploads public/images`, { cwd: rootDir, stdio: 'ignore' });
        if (fs.existsSync(destZip)) {
            console.log('=> Thành công nén bằng lệnh tar!');
            success = true;
        }
    } catch (e) {
        console.log('Không thể dùng lệnh tar.');
    }
}

// Cách 3: Nếu cả 2 cách trên thất bại, tự cài đặt thư viện 'adm-zip' tạm thời để nén
if (!success) {
    try {
        console.log('Đang cài đặt thư viện adm-zip tạm thời để nén...');
        execSync('npm install adm-zip --no-save', { cwd: rootDir, stdio: 'inherit' });
        const AdmZip = require('adm-zip');
        const zip = new AdmZip();
        
        if (fs.existsSync(uploadsDir)) {
            console.log('Thêm thư mục public/uploads vào file nén...');
            zip.addLocalFolder(uploadsDir, 'public/uploads');
        }
        if (fs.existsSync(imagesDir)) {
            console.log('Thêm thư mục public/images vào file nén...');
            zip.addLocalFolder(imagesDir, 'public/images');
        }
        
        console.log('Đang ghi file nén public/images.zip...');
        zip.writeZip(destZip);
        if (fs.existsSync(destZip)) {
            console.log('=> Thành công nén bằng adm-zip!');
            success = true;
        }
    } catch (e) {
        console.error('Lỗi khi nén bằng adm-zip:', e.message);
    }
}

if (success) {
    const stats = fs.statSync(destZip);
    const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);
    console.log('\n=============================================');
    console.log(`✅ Nén thành công!`);
    console.log(`📂 File lưu tại: public/images.zip`);
    console.log(`📏 Kích thước: ${sizeMb} MB`);
    console.log(`🌐 Đường dẫn tải trực tiếp: https://manhlamstore.shop/images.zip`);
    console.log('=============================================');
} else {
    console.error('\n❌ Thất bại: Không thể nén ảnh bằng bất kì cách nào.');
}
