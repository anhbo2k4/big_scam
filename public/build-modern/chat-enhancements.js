

async function loadQuickReplies() {
    try {
        const response = await fetch('/api/chat/quick-replies');
        const result = await response.json();

        if (result.success && result.data) {
            displayQuickReplies(result.data);
        }
    } catch (err) {
        console.error('❌ Error loading quick replies:', err);
    }
}

function displayQuickReplies(replies) {
    const container = document.getElementById('quickReplies');
    if (!container) return;

    container.innerHTML = '';
    
    replies.forEach(reply => {
        const button = document.createElement('button');
        button.className = 'quick-reply-btn';
        button.textContent = reply.label;
        button.onclick = () => {
            sendQuickReply(reply.value);
            hideQuickReplies();
        };
        container.appendChild(button);
    });

    showQuickReplies();
}

function showQuickReplies() {
    const container = document.getElementById('quickReplies');
    if (container) container.style.display = 'flex';
}

function hideQuickReplies() {
    const container = document.getElementById('quickReplies');
    if (container) container.style.display = 'none';
}

async function sendQuickReply(replyText) {
    const input = document.getElementById('chatInput');
    if (input) {
        input.value = replyText;
        await sendMessage();
    }
}

async function sendSatisfactionSurvey() {
    try {
        const response = await fetch(`/api/chat/survey/${currentChatCode}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customer_name: currentChatSession?.customer_name || 'Bạn'
            })
        });

        const result = await response.json();
        if (result.success) {
            console.log('✅ Survey sent');
            
            await loadChatMessages();
        }
    } catch (err) {
        console.error('❌ Error sending survey:', err);
    }
}

async function submitSatisfactionRating(rating, feedback = '') {
    try {
        const response = await fetch('/api/chat/satisfaction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session_code: currentChatCode,
                rating: rating,
                feedback: feedback
            })
        });

        const result = await response.json();
        if (result.success) {
            console.log('✅ Satisfaction rating submitted:', rating);
            showNotification('✅', 'Cảm ơn đánh giá của bạn!', '#10b981');
            await loadChatMessages();
        }
    } catch (err) {
        console.error('❌ Error submitting rating:', err);
    }
}

async function loadSupportAgents() {
    try {
        const response = await fetch('/api/chat/agent-list');
        const result = await response.json();

        if (result.success && result.data) {
            return result.data;
        }
    } catch (err) {
        console.error('❌ Error loading agents:', err);
        return [];
    }
}

async function assignAgentToChat(agentId, agentName) {
    try {
        const response = await fetch(`/api/chat/assign-agent/${currentChatCode}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                agent_id: agentId,
                agent_name: agentName
            })
        });

        const result = await response.json();
        if (result.success) {
            console.log('✅ Agent assigned:', agentName);
            await loadChatMessages();
            return result.data;
        }
    } catch (err) {
        console.error('❌ Error assigning agent:', err);
    }
}

async function getChatStats() {
    try {
        const response = await fetch('/api/chat/stats');
        const result = await response.json();

        if (result.success) {
            return result.data;
        }
    } catch (err) {
        console.error('❌ Error fetching chat stats:', err);
        return null;
    }
}

function formatChatTime(date) {
    const now = new Date();
    const msgDate = new Date(date);
    const diff = now - msgDate;

    if (diff < 60000) return 'Vừa xong';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}p`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    
    return msgDate.toLocaleDateString('vi-VN');
}

function createRatingButtons() {
    const container = document.createElement('div');
    container.className = 'satisfaction-rating';
    container.innerHTML = `
        <div class="rating-prompt">Bạn thấy hài lòng không? (1-5 sao)</div>
        <div class="rating-buttons">
            <button class="rating-btn" data-rating="1" title="Rất không hài lòng">😞</button>
            <button class="rating-btn" data-rating="2" title="Không hài lòng">😕</button>
            <button class="rating-btn" data-rating="3" title="Bình thường">😐</button>
            <button class="rating-btn" data-rating="4" title="Hài lòng">😊</button>
            <button class="rating-btn" data-rating="5" title="Rất hài lòng">😍</button>
        </div>
    `;

    
    const buttons = container.querySelectorAll('.rating-btn');
    buttons.forEach(btn => {
        btn.onclick = async () => {
            const rating = btn.getAttribute('data-rating');
            await submitSatisfactionRating(rating);
            container.remove();
        };
    });

    return container;
}

function initializeChatEnhancements() {
    if (window.__chatEnhancementsInitialized) return;
    window.__chatEnhancementsInitialized = true;

    loadQuickReplies();

    
    setTimeout(() => {
        if (currentChatSession?.status === 'active') {
            sendSatisfactionSurvey();
        }
    }, 300000); 
}

// Initialize only when chat is actually opened to avoid unnecessary requests on page load.
window.addEventListener('chat:opened', () => {
    setTimeout(initializeChatEnhancements, 250);
});
