function createStars() {
  var starsContainer = document.getElementById('bgStars');
  for (var i = 0; i < 100; i++) {
    var star = document.createElement('div');
    star.className = 'star';
    star.style.width = Math.random() * 3 + 1 + 'px';
    star.style.height = star.style.width;
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 3 + 's';
    starsContainer.appendChild(star);
  }
  var giftEmojis = ['🎁', '🎀', '⭐', '✨'];
  for (var _i = 0; _i < 8; _i++) {
    var gift = document.createElement('div');
    gift.className = 'floating-gift';
    gift.textContent = giftEmojis[Math.floor(Math.random() * giftEmojis.length)];
    gift.style.left = Math.random() * 100 + '%';
    gift.style.top = Math.random() * 100 + '%';
    gift.style.animationDelay = Math.random() * 6 + 's';
    starsContainer.appendChild(gift);
  }
}
var openedBoxes = new Set(['1']);
function initGiftBoxes() {
  var giftBoxes = document.querySelectorAll('.gift-box');
  giftBoxes.forEach(function (box) {
    var boxNumber = box.dataset.box;
    if (boxNumber === '1') {
      box.classList.add('opened');
    }
    box.addEventListener('click', function () {
      return handleBoxClick(boxNumber);
    });
  });
}
function handleBoxClick(boxNumber) {
  if (openedBoxes.has(boxNumber)) {
    window.location.href = "result.html?box=".concat(boxNumber);
  } else {
    openBox(boxNumber);
  }
}
function openBox(boxNumber) {
  var box = document.getElementById("box".concat(boxNumber));
  if (!box) return;
  openedBoxes.add(boxNumber);
  box.classList.add('opened');
  var statusElement = box.querySelector('.gift-status');
  if (statusElement) {
    statusElement.innerHTML = "\n            <span>\u2705</span>\n            <span>\u0110\xE3 m\u1EDF</span>\n        ";
    statusElement.classList.remove('waiting');
  }
  createConfetti();
  setTimeout(function () {
    window.location.href = "result.html?box=".concat(boxNumber);
  }, 1500);
}
function createConfetti() {
  var colors = ['#fbbf24', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981'];
  var confettiCount = 50;
  var _loop = function _loop() {
    var confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = Math.random() * 10 + 5 + 'px';
    confetti.style.height = confetti.style.width;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.top = '-20px';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    confetti.style.opacity = '1';
    confetti.style.zIndex = '9999';
    confetti.style.pointerEvents = 'none';
    document.body.appendChild(confetti);
    var duration = Math.random() * 2 + 2;
    var xMovement = (Math.random() - 0.5) * 200;
    var rotation = Math.random() * 720;
    confetti.animate([{
      transform: 'translate(0, 0) rotate(0deg)',
      opacity: 1
    }, {
      transform: "translate(".concat(xMovement, "px, ").concat(window.innerHeight + 50, "px) rotate(").concat(rotation, "deg)"),
      opacity: 0
    }], {
      duration: duration * 1000,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });
    setTimeout(function () {
      confetti.remove();
    }, duration * 1000);
  };
  for (var i = 0; i < confettiCount; i++) {
    _loop();
  }
}
document.addEventListener('DOMContentLoaded', function () {
  createStars();
  initGiftBoxes();
});
function showNotification(message) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'info';
  var notification = document.createElement('div');
  notification.style.cssText = "\n        position: fixed;\n        top: 2rem;\n        right: 2rem;\n        background: white;\n        padding: 1rem 1.5rem;\n        border-radius: 12px;\n        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);\n        z-index: 10000;\n        font-weight: 600;\n        color: #1f2937;\n        animation: slideIn 0.3s ease-out;\n    ";
  var icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️'
  };
  notification.innerHTML = "\n        <span style=\"margin-right: 0.5rem;\">".concat(icons[type] || icons.info, "</span>\n        <span>").concat(message, "</span>\n    ");
  document.body.appendChild(notification);
  setTimeout(function () {
    notification.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(function () {
      return notification.remove();
    }, 300);
  }, 3000);
}
var style = document.createElement('style');
style.textContent = "\n    @keyframes slideIn {\n        from {\n            transform: translateX(400px);\n            opacity: 0;\n        }\n        to {\n            transform: translateX(0);\n            opacity: 1;\n        }\n    }\n    \n    @keyframes slideOut {\n        from {\n            transform: translateX(0);\n            opacity: 1;\n        }\n        to {\n            transform: translateX(400px);\n            opacity: 0;\n        }\n    }\n";
document.head.appendChild(style);