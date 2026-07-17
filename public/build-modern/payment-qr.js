/**
 * Payment QR Code Generator
 * Tạo mã QR thanh toán từ VietQR API
 */

let qrCurrentData = {};
let qrInitialized = false; // Guard flag to prevent double initialization

/**
 * Initialize QR Payment Module
 */
function initPaymentQR() {
  // Prevent double initialization
  if (qrInitialized) {
    return;
  }
  
  qrInitialized = true;
  
  // Load banks on first interaction instead of page load
  const bankSelect = document.getElementById('bankSelect');
  if (bankSelect) {
    bankSelect.addEventListener('click', loadBanksOnce, { once: true });
  }
}

/**
 * Load banks once on first interaction
 */
async function loadBanksOnce() {
  if (!qrCurrentData.banksLoaded) {
    await loadBanksList();
    qrCurrentData.banksLoaded = true;
  }
}

/**
 * Load danh sách ngân hàng từ API
 */
async function loadBanksList() {
  const bankSelect = document.getElementById('bankSelect');
  const spinner = document.getElementById('bankLoadingSpinner');
  
  try {
    spinner.style.display = 'block';
    
    const response = await fetch('/api/banks', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      // If rate limited (429) or error, use fallback immediately
      populateBankDropdown(getQRFallbackBanks());
      spinner.style.display = 'none';
      return;
    }

    const result = await response.json();
    const banks = result.data || [];

    if (!banks.length) {
      populateBankDropdown(getQRFallbackBanks());
      spinner.style.display = 'none';
      return;
    }

    // Clear existing options
    bankSelect.innerHTML = '<option value="">-- Chọn ngân hàng --</option>';

    // Add bank options
    banks.forEach(bank => {
      const option = document.createElement('option');
      option.value = bank.bin; // Use BIN as value
      option.textContent = `${bank.shortName} - ${bank.name}`;
      option.dataset.name = bank.shortName;
      option.dataset.bin = bank.bin;
      bankSelect.appendChild(option);
    });

  } catch (error) {
    // Use fallback on any error
    populateBankDropdown(getQRFallbackBanks());
  } finally {
    spinner.style.display = 'none';
  }
}

/**
 * Populate bank dropdown with bank options
 */
function populateBankDropdown(banks) {
  const bankSelect = document.getElementById('bankSelect');
  if (!bankSelect) return;
  
  bankSelect.innerHTML = '<option value="">-- Chọn ngân hàng --</option>';
  
  banks.forEach(bank => {
    const option = document.createElement('option');
    option.value = bank.bin;
    option.textContent = `${bank.shortName} - ${bank.name}`;
    option.dataset.name = bank.shortName;
    option.dataset.bin = bank.bin;
    bankSelect.appendChild(option);
  });
}

/**
 * Fallback Vietnamese banks list for QR payment
 */
function getQRFallbackBanks() {
  return [
    { name: 'Ngân hàng TMCP Ngoại thương Việt Nam', shortName: 'Vietcombank', bin: '970436' },
    { name: 'Ngân hàng TMCP Công thương Việt Nam', shortName: 'CTG', bin: '970010' },
    { name: 'Ngân hàng Techcombank', shortName: 'TCB', bin: '970407' },
    { name: 'Ngân hàng TMCP Á Châu', shortName: 'ACB', bin: '970005' },
    { name: 'Ngân hàng TMCP Quân Đội', shortName: 'MBB', bin: '970422' },
    { name: 'Ngân hàng TMCP Nông nghiệp', shortName: 'AGR', bin: '970012' }
  ];
}

/**
 * Generate QR Code
 */
function generateQR(event) {
  event.preventDefault();

  // Get form values
  const bankSelect = document.getElementById('bankSelect');
  const accountNumber = document.getElementById('accountNumber').value.trim();
  const accountName = document.getElementById('accountName').value.trim().toUpperCase();
  const amount = document.getElementById('amount').value.trim();
  const content = document.getElementById('content').value.trim().toUpperCase();

  // Validate
  const errors = [];
  
  if (!bankSelect.value) errors.push('Vui lòng chọn ngân hàng');
  if (!accountNumber) errors.push('Vui lòng nhập số tài khoản');
  if (!accountName) errors.push('Vui lòng nhập tên chủ tài khoản');
  if (!amount || amount < 1000) errors.push('Số tiền phải >= 1000 VND');
  if (!content) errors.push('Vui lòng nhập nội dung chuyển khoản');

  if (errors.length > 0) {
    showQRError(errors.join('\n'));
    return false;
  }

  // Get selected bank info
  const selectedOption = bankSelect.options[bankSelect.selectedIndex];
  const bin = selectedOption.value;
  const bankName = selectedOption.dataset.name;

  // Build VietQR URL
  const encodedContent = encodeURIComponent(content);
  const encodedName = encodeURIComponent(accountName);
  
  const qrUrl = `https://img.vietqr.io/image/${bin}-${accountNumber}-compact2.png?amount=${amount}&addInfo=${encodedContent}&accountName=${encodedName}`;

  // Store data for later use
  qrCurrentData = {
    bankName,
    accountNumber,
    accountName,
    amount,
    content,
    qrUrl
  };

  // Display QR
  displayQR(qrUrl);
  hideQRError();

  return false;
}

/**
 * Display QR Image
 */
function displayQR(qrUrl) {
  const display = document.getElementById('qrDisplay');
  const qrImage = document.getElementById('qrImage');
  const qrBankName = document.getElementById('qrBankName');
  const qrAccountNumber = document.getElementById('qrAccountNumber');
  const qrAmount = document.getElementById('qrAmount');
  const qrContent = document.getElementById('qrContent');

  qrImage.src = qrUrl;
  qrImage.onerror = () => {
    showQRError('Không thể tạo mã QR. Vui lòng kiểm tra lại thông tin');
  };

  qrBankName.textContent = qrCurrentData.bankName;
  qrAccountNumber.textContent = qrCurrentData.accountNumber;
  qrAmount.textContent = qrCurrentData.amount.toLocaleString('vi-VN') + ' đ';
  qrContent.textContent = qrCurrentData.content;

  display.style.display = 'block';
  
  // Scroll to QR
  setTimeout(() => {
    display.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

/**
 * Copy QR URL to Clipboard
 */
function copyQRUrl() {
  if (!qrCurrentData.qrUrl) {
    alert('Vui lòng tạo mã QR trước');
    return;
  }

  navigator.clipboard.writeText(qrCurrentData.qrUrl).then(() => {
    showQRToast('✅ Đã sao chép link QR', 'success');
  }).catch(() => {
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = qrCurrentData.qrUrl;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showQRToast('✅ Đã sao chép link QR', 'success');
  });
}

/**
 * Download QR Image
 */
function downloadQR() {
  if (!qrCurrentData.qrUrl) {
    alert('Vui lòng tạo mã QR trước');
    return;
  }

  const link = document.createElement('a');
  link.href = qrCurrentData.qrUrl;
  link.download = `QR_${qrCurrentData.accountNumber}_${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showQRToast('✅ Đang tải mã QR', 'success');
}

/**
 * Reset QR Form
 */
function resetQRForm() {
  document.getElementById('qrForm').reset();
  document.getElementById('qrDisplay').style.display = 'none';
  qrCurrentData = {};
  hideQRError();
}

/**
 * Show Error Message
 */
function showQRError(message) {
  const errorDiv = document.getElementById('qrError');
  const errorMsg = document.getElementById('qrErrorMessage');
  
  errorMsg.textContent = message;
  errorDiv.style.display = 'flex';
}

/**
 * Hide Error Message
 */
function hideQRError() {
  const errorDiv = document.getElementById('qrError');
  errorDiv.style.display = 'none';
}

/**
 * QR toast helper (local scope, does not override global dashboard toast)
 */
function showQRToast(message, type = 'info') {
  // Prefer the dashboard/global toast renderer when available
  if (typeof window.showToast === 'function') {
    window.showToast(message, type);
    return;
  }

  // Fallback for pages that expose toast object API
  if (typeof window.toast !== 'undefined' && window.toast && typeof window.toast.show === 'function') {
    window.toast.show(message, type);
    return;
  }

  // Fallback: create simple alert
  const toastEl = document.createElement('div');
  toastEl.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 20px;
    background: ${type === 'success' ? '#22c55e' : '#6366f1'};
    color: white;
    border-radius: 6px;
    font-size: 14px;
    z-index: 999999;
    animation: slideInRight 0.3s ease-out;
  `;
  toastEl.textContent = message;
  document.body.appendChild(toastEl);

  setTimeout(() => {
    toastEl.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => toastEl.remove(), 300);
  }, 3000);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('bankSelect')) {
    initPaymentQR();
  }
});

// Allow external initialization
window.initPaymentQR = initPaymentQR;
