var _document$querySelect;
var chatMessages = [];
var isTyping = false;
function toggleChat() {
  var chatBox = document.getElementById('chatBox');
  var chatIcon = document.getElementById('chatFloatIcon');
  var badge = document.getElementById('notificationBadge');
  if (chatBox.classList.contains('active')) {
    chatBox.classList.remove('active');
    chatIcon.style.transform = 'scale(1)';
  } else {
    chatBox.classList.add('active');
    chatIcon.style.transform = 'scale(0.9)';
    if (badge) {
      badge.style.display = 'none';
    }
    setTimeout(function () {
      var messagesContainer = document.getElementById('chatMessages');
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
  }
}
function sendMessage() {
  var input = document.getElementById('chatInput');
  var message = input.value.trim();
  if (message === '') return;
  addMessage(message, 'sent');
  input.value = '';
  showTypingIndicator();
  setTimeout(function () {
    hideTypingIndicator();
    addBotResponse(message);
  }, 1500 + Math.random() * 1000);
}
function addMessage(text) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'received';
  var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Bạn';
  var avatar = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var messagesContainer = document.getElementById('chatMessages');
  var messageDiv = document.createElement('div');
  messageDiv.className = "message ".concat(type);
  var time = getCurrentTime();
  if (type === 'sent') {
    messageDiv.innerHTML = "\n            <div class=\"message-content\">\n                <div class=\"message-name\">".concat(name, "</div>\n                <div class=\"message-bubble\">").concat(escapeHtml(text), "</div>\n                <div class=\"message-time\">\n                    ").concat(time, "\n                    <span class=\"message-status\">\u0110\xE3 g\u1EEDi</span>\n                </div>\n            </div>\n        ");
  } else {
    var avatarUrl = avatar || 'https://i.pravatar.cc/40?img=5';
    messageDiv.innerHTML = "\n            <div class=\"message-avatar\">\n                <img src=\"".concat(avatarUrl, "\" alt=\"").concat(name, "\">\n            </div>\n            <div class=\"message-content\">\n                <div class=\"message-name\">").concat(name, "</div>\n                <div class=\"message-bubble\">").concat(escapeHtml(text), "</div>\n                <div class=\"message-time\">\n                    ").concat(time, "\n                    <span class=\"message-status\">\u0110\xE3 xem</span>\n                </div>\n            </div>\n        ");
  }
  messagesContainer.appendChild(messageDiv);
  setTimeout(function () {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, 50);
  chatMessages.push({
    text: text,
    type: type,
    time: time,
    name: name
  });
}
function showTypingIndicator() {
  var typingDiv = document.getElementById('chatTyping');
  if (typingDiv) {
    typingDiv.style.display = 'flex';
    isTyping = true;
  }
}
function hideTypingIndicator() {
  var typingDiv = document.getElementById('chatTyping');
  if (typingDiv) {
    typingDiv.style.display = 'none';
    isTyping = false;
  }
}
function addBotResponse(userMessage) {
  var responses = getSmartResponse(userMessage);
  var randomResponse = responses[Math.floor(Math.random() * responses.length)];
  addMessage(randomResponse, 'received', 'Hồng Ngọc');
}
function getSmartResponse(message) {
  var msg = message.toLowerCase();
  if (msg.match(/^(xin chào|chào|hello|hi|hey)/i)) {
    return ['Xin chào! Rất vui được hỗ trợ bạn hôm nay. Bạn cần giúp đỡ gì nhé? 😊', 'Chào bạn! Tôi có thể giúp gì cho bạn? ✨', 'Hi! Chào mừng bạn đến với dịch vụ hỗ trợ của chúng tôi! 👋'];
  }
  if (msg.match(/(giúp|hỗ trợ|support|help)/i)) {
    return ['Tôi sẵn sàng hỗ trợ bạn! Bạn đang gặp vấn đề gì? 🤝', 'Đừng lo, tôi ở đây để giúp bạn! Hãy cho tôi biết chi tiết nhé.', 'Tôi luôn sẵn sàng! Bạn cần hỗ trợ về vấn đề nào? 💪'];
  }
  if (msg.match(/(game|chơi|phiên|mã)/i)) {
    return ['Về trò chơi, bạn đã có mã phiên chơi chưa? Hãy nhập mã để bắt đầu nhé! 🎮', 'Để tham gia, bạn cần nhập mã phiên chơi ở ô bên trên. Bạn đã có mã chưa? 🎁', 'Hệ thống đang hoạt động tốt! Bạn có thể nhập mã và chọn hộp quà của mình! ✨'];
  }
  if (msg.match(/(quà|thưởng|prize|gift|nhận)/i)) {
    return ['Các phần thưởng bao gồm VIP, Lucky và nhiều ưu đãi khác! Hãy thử vận may của bạn! 🎁', 'Bạn có cơ hội nhận được nhiều phần quà hấp dẫn! Chọn hộp quà yêu thích nhé! 🎉', 'Mỗi hộp quà đều chứa phần thưởng đặc biệt! Chúc bạn may mắn! 🍀'];
  }
  if (msg.match(/(cảm ơn|thank|cám ơn|thanks)/i)) {
    return ['Không có gì! Rất vui được hỗ trợ bạn! 😊', 'Luôn sẵn lòng giúp đỡ! Chúc bạn một ngày tốt lành! ✨', 'Hân hạnh được phục vụ! Nếu cần gì cứ nhắn nhé! 🌟'];
  }
  if (msg.match(/(khỏe|thế nào|how are you|ok|ổn)/i)) {
    return ['Tôi rất khỏe, cảm ơn bạn! Bạn thì sao? 😊', 'Tuyệt vời! Tôi luôn sẵn sàng hỗ trợ bạn! 💫', 'Tôi vẫn ổn! Cảm ơn bạn đã hỏi thăm! 🌸'];
  }
  return ['Cảm ơn bạn đã liên hệ! Tôi đã ghi nhận yêu cầu của bạn. 📝', 'Để tôi kiểm tra thông tin cho bạn nhé! Vui lòng đợi trong giây lát. ⏳', 'Tôi hiểu rồi! Bạn có thể cung cấp thêm thông tin chi tiết không? 🔍', 'Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7! Bạn cần gì khác không? 💬', 'Rất vui được trò chuyện với bạn! Có gì thắc mắc cứ hỏi nhé! 😊'];
}
function handleKeyPress(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}
function handleInputChange() {
  var input = document.getElementById('chatInput');
  var sendButton = document.getElementById('sendButton');
  if (input.value.trim() !== '') {
    sendButton.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
  } else {
    sendButton.style.background = 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)';
  }
}
function handleAttachment() {
  showNotification('📎', 'Tính năng đính kèm file sẽ sớm có!', '#3b82f6');
}
function handleImage() {
  showNotification('🖼️', 'Tính năng gửi hình ảnh sẽ sớm có!', '#ec4899');
}
function handleEmoji() {
  var emojis = ['😊', '❤️', '👍', '🎉', '😂', '🔥', '✨', '🎁'];
  var randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  var input = document.getElementById('chatInput');
  input.value += randomEmoji;
  input.focus();
}
function handleSticker() {
  showNotification('✨', 'Tính năng sticker sẽ sớm có!', '#8b5cf6');
}
function getCurrentTime() {
  var now = new Date();
  var hours = String(now.getHours()).padStart(2, '0');
  var minutes = String(now.getMinutes()).padStart(2, '0');
  return "".concat(hours, ":").concat(minutes);
}
function escapeHtml(text) {
  var div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
function startGame() {
  var versionCode = document.getElementById('version-code').value.trim();
  if (versionCode === '') {
    showNotification('⚠️', 'Vui lòng nhập mã phiên chơi!', '#f59e0b');
    return;
  }
  var button = document.querySelector('.start-button');
  button.style.transform = 'scale(0.95)';
  setTimeout(function () {
    button.style.transform = 'scale(1)';
  }, 200);
  showNotification('✅', 'Trò chơi đã bắt đầu! Hãy chọn một hộp quà.', '#10b981');
}
function selectGift(type) {
  var gifts = {
    vip: {
      icon: '👑',
      title: 'Chúc mừng! Bạn đã nhận VIP!',
      message: 'Bạn đã trúng phần thưởng VIP đặc biệt!'
    },
    lucky: {
      icon: '🍀',
      title: 'May mắn!',
      message: 'Bạn đã nhận được phần thưởng may mắn!'
    },
    again: {
      icon: '🔄',
      title: 'Thử lại nhé!',
      message: 'Chúc bạn may mắn lần sau!'
    }
  };
  var selectedGift = gifts[type];
  var giftOptions = document.querySelectorAll('.gift-option');
  giftOptions.forEach(function (option) {
    option.style.transform = 'scale(0.95)';
    option.style.opacity = '0.5';
  });
  setTimeout(function () {
    showResult(selectedGift.icon, selectedGift.title, selectedGift.message);
    giftOptions.forEach(function (option) {
      option.style.transform = 'scale(1)';
      option.style.opacity = '1';
    });
  }, 500);
}
function showResult(icon, title, message) {
  var modal = document.getElementById('resultModal');
  var resultIcon = document.getElementById('resultIcon');
  var resultTitle = document.getElementById('resultTitle');
  var resultMessage = document.getElementById('resultMessage');
  resultIcon.textContent = icon;
  resultTitle.textContent = title;
  resultMessage.textContent = message;
  modal.classList.add('active');
  createConfetti();
}
function closeResult() {
  var modal = document.getElementById('resultModal');
  modal.classList.remove('active');
}
function createConfetti() {
  var colors = ['#7c3aed', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];
  var confettiCount = 50;
  var _loop = function _loop() {
    var confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.top = '-10px';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    confetti.style.opacity = '1';
    confetti.style.zIndex = '9999';
    confetti.style.pointerEvents = 'none';
    document.body.appendChild(confetti);
    var duration = Math.random() * 3 + 2;
    var xMovement = (Math.random() - 0.5) * 200;
    confetti.animate([{
      transform: "translate(0, 0) rotate(0deg)",
      opacity: 1
    }, {
      transform: "translate(".concat(xMovement, "px, ").concat(window.innerHeight, "px) rotate(").concat(Math.random() * 720, "deg)"),
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
function showNotification(icon, message, color) {
  var notification = document.createElement('div');
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '20px';
  notification.style.background = 'white';
  notification.style.padding = '16px 24px';
  notification.style.borderRadius = '12px';
  notification.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
  notification.style.display = 'flex';
  notification.style.alignItems = 'center';
  notification.style.gap = '12px';
  notification.style.zIndex = '10000';
  notification.style.animation = 'slideInRight 0.3s ease-out';
  notification.style.borderLeft = "4px solid ".concat(color);
  notification.innerHTML = "\n        <span style=\"font-size: 1.5rem;\">".concat(icon, "</span>\n        <span style=\"color: #1f2937; font-weight: 600;\">").concat(message, "</span>\n    ");
  if (!document.querySelector('#notification-styles')) {
    var style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = "\n            @keyframes slideInRight {\n                from {\n                    transform: translateX(400px);\n                    opacity: 0;\n                }\n                to {\n                    transform: translateX(0);\n                    opacity: 1;\n                }\n            }\n            @keyframes slideOutRight {\n                from {\n                    transform: translateX(0);\n                    opacity: 1;\n                }\n                to {\n                    transform: translateX(400px);\n                    opacity: 0;\n                }\n            }\n        ";
    document.head.appendChild(style);
  }
  document.body.appendChild(notification);
  setTimeout(function () {
    notification.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(function () {
      notification.remove();
    }, 300);
  }, 3000);
}
function toggleAdventure() {
  showNotification('🎮', 'Cuộc phiêu lưu sắp bắt đầu!', '#7c3aed');
}
document.addEventListener('click', function (e) {
  var modal = document.getElementById('resultModal');
  if (e.target === modal) {
    closeResult();
  }
});
window.addEventListener('load', function () {
  var giftModal = document.querySelector('.gift-modal');
  giftModal.style.opacity = '0';
  giftModal.style.transform = 'translateY(30px) scale(0.9)';
  setTimeout(function () {
    giftModal.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    giftModal.style.opacity = '1';
    giftModal.style.transform = 'translateY(0) scale(1)';
  }, 100);
  var giftOptions = document.querySelectorAll('.gift-option');
  giftOptions.forEach(function (option) {
    option.addEventListener('mouseenter', function () {
      option.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
  });
});
var titleClickCount = 0;
(_document$querySelect = document.querySelector('.title')) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.addEventListener('click', function () {
  titleClickCount++;
  if (titleClickCount === 5) {
    createConfetti();
    showNotification('🎉', 'Bạn đã tìm thấy easter egg!', '#ec4899');
    titleClickCount = 0;
  }
});