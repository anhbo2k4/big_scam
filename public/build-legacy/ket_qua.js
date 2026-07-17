function createStars() {
  var starsContainer = document.getElementById('bgStars');
  for (var i = 0; i < 80; i++) {
    var star = document.createElement('div');
    star.className = 'star';
    star.style.width = Math.random() * 3 + 1 + 'px';
    star.style.height = star.style.width;
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 3 + 's';
    starsContainer.appendChild(star);
  }
  var giftEmojis = ['🎁', '🎀', '⭐', '✨', '💫'];
  for (var _i = 0; _i < 6; _i++) {
    var gift = document.createElement('div');
    gift.className = 'floating-gift';
    gift.textContent = giftEmojis[Math.floor(Math.random() * giftEmojis.length)];
    gift.style.left = Math.random() * 100 + '%';
    gift.style.top = Math.random() * 100 + '%';
    gift.style.animationDelay = Math.random() * 8 + 's';
    starsContainer.appendChild(gift);
  }
}
function createConfetti() {
  var colors = ['#fbbf24', '#f59e0b', '#ef4444', '#ec4899', '#a855f7', '#3b82f6', '#10b981'];
  var confettiCount = 60;
  var _loop = function _loop() {
    var confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.width = Math.random() * 12 + 6 + 'px';
    confetti.style.height = confetti.style.width;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.top = '-20px';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    confetti.style.opacity = '1';
    confetti.style.animationDelay = Math.random() * 0.5 + 's';
    confetti.style.animationDuration = Math.random() * 2 + 2 + 's';
    document.body.appendChild(confetti);
    setTimeout(function () {
      confetti.remove();
    }, 3500);
  };
  for (var i = 0; i < confettiCount; i++) {
    _loop();
  }
}
var prizeData = {
  '1': {
    title: 'Voucher 500K',
    description: 'Phiếu quy đổi tiền mặt hoặc thanh toán lần sau',
    amount: '500.000 VND',
    value: 500000
  },
  '2': {
    title: 'Voucher 300K',
    description: 'Phiếu mua sắm hoặc thanh toán online',
    amount: '300.000 VND',
    value: 300000
  },
  '3': {
    title: 'Voucher 200K',
    description: 'Phiếu giảm giá cho lần mua tiếp theo',
    amount: '200.000 VND',
    value: 200000
  }
};
function getBoxNumber() {
  var urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('box') || '1';
}
function displayPrize() {
  var boxNumber = getBoxNumber();
  var prize = prizeData[boxNumber];
  if (prize) {
    document.getElementById('prizeTitle').textContent = prize.title;
    document.getElementById('prizeDescription').textContent = prize.description;
    document.getElementById('prizeAmount').textContent = prize.amount;
  }
}
function initButtons() {
  var convertBtn = document.getElementById('convertBtn');
  var declineBtn = document.getElementById('declineBtn');
  var captureBtn = document.getElementById('captureBtn');
  convertBtn.addEventListener('click', handleConvert);
  declineBtn.addEventListener('click', handleDecline);
  captureBtn.addEventListener('click', handleCapture);
}
function handleConvert() {
  var boxNumber = getBoxNumber();
  var prize = prizeData[boxNumber];
  showSuccessModal(prize);
  createConfetti();
}
function handleDecline() {
  if (confirm('Bạn có chắc chắn muốn từ chối phần thưởng này?')) {
    showNotification('Bạn đã từ chối phần thưởng', 'info');
    setTimeout(function () {
      window.location.href = 'index.html';
    }, 1500);
  }
}
function handleCapture() {
  showNotification('Đang chụp ảnh kết quả...', 'info');
  setTimeout(function () {
    showNotification('Đã lưu ảnh kết quả thành công!', 'success');
    createConfetti();
  }, 1000);
}
function showSuccessModal(prize) {
  var modal = document.getElementById('successModal');
  var modalMessage = modal.querySelector('.modal-message');
  if (prize) {
    modalMessage.textContent = "B\u1EA1n \u0111\xE3 quy \u0111\u1ED5i th\xE0nh c\xF4ng ".concat(prize.amount);
  }
  modal.classList.add('active');
}
function closeModal() {
  var modal = document.getElementById('successModal');
  modal.classList.remove('active');
  setTimeout(function () {
    window.location.href = 'index.html';
  }, 500);
}
function goBack() {
  window.location.href = 'index.html';
}
function showNotification(message) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'info';
  var notification = document.createElement('div');
  var icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️'
  };
  var colors = {
    success: '#10b981',
    error: '#ef4444',
    info: '#3b82f6',
    warning: '#f59e0b'
  };
  notification.style.cssText = "\n        position: fixed;\n        top: 2rem;\n        right: 2rem;\n        background: white;\n        padding: 1rem 1.5rem;\n        border-radius: 12px;\n        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);\n        z-index: 10000;\n        font-weight: 600;\n        color: #1f2937;\n        display: flex;\n        align-items: center;\n        gap: 0.75rem;\n        border-left: 4px solid ".concat(colors[type] || colors.info, ";\n        animation: slideIn 0.3s ease-out;\n    ");
  notification.innerHTML = "\n        <span style=\"font-size: 1.5rem;\">".concat(icons[type] || icons.info, "</span>\n        <span>").concat(message, "</span>\n    ");
  document.body.appendChild(notification);
  setTimeout(function () {
    notification.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(function () {
      return notification.remove();
    }, 300);
  }, 3000);
}
document.addEventListener('DOMContentLoaded', function () {
  createStars();
  displayPrize();
  initButtons();
  setTimeout(function () {
    createConfetti();
  }, 500);
});
document.getElementById('successModal').addEventListener('click', function (e) {
  if (e.target === this) {
    closeModal();
  }
});
var style = document.createElement('style');
style.textContent = "\n    @keyframes slideIn {\n        from {\n            transform: translateX(400px);\n            opacity: 0;\n        }\n        to {\n            transform: translateX(0);\n            opacity: 1;\n        }\n    }\n    \n    @keyframes slideOut {\n        from {\n            transform: translateX(0);\n            opacity: 1;\n        }\n        to {\n            transform: translateX(400px);\n            opacity: 0;\n        }\n    }\n";
document.head.appendChild(style);