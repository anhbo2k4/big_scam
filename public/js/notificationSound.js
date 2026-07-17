const LS_MUTED = 'notif_muted';
const LS_VOLUME = 'notif_volume';
const LS_SOUND_TYPES_ADMIN = 'notif_sound_types_admin';
const LS_SOUND_TYPES_USER = 'notif_sound_types_user';
const DEFAULT_VOLUME = 0.42;
const CHAT_SOUND_SRC = '/audio/thongbao.mp3';
const ACTION_ALERT_SOUND_SRC = '/audio/tingting.mp3';

function getScopeFromPathname() {
  try {
    const path = String(window.location?.pathname || '').toLowerCase();
    return path.startsWith('/admin') ? 'admin' : 'user';
  } catch (_) {
    return 'user';
  }
}

function getSoundTypesStorageKey(scope) {
  return scope === 'admin' ? LS_SOUND_TYPES_ADMIN : LS_SOUND_TYPES_USER;
}

let singleton = null;

class NotificationSoundManager {
  constructor() {
    this.ctx = null;
    this.ready = false;
    this.lastPlayAt = 0;
    this.unlockBound = false;
    this.unlockHandler = this.onUnlock.bind(this);
    this.chatAudio = null;
    this.chatAudioReady = false;
    this.chatAudioWarmed = false;
    this.actionAudio = null;
    this.actionAudioReady = false;
    this.actionAudioWarmed = false;
  }

  ensureChatAudio() {
    if (this.chatAudioReady && this.chatAudio) return this.chatAudio;
    try {
      this.chatAudio = new Audio(CHAT_SOUND_SRC);
      this.chatAudio.preload = 'auto';
      this.chatAudioReady = true;
    } catch (_) {
      this.chatAudio = null;
      this.chatAudioReady = false;
    }
    return this.chatAudio;
  }

  async playChatNotificationMp3() {
    if (this.muted) return false;
    const audio = this.ensureChatAudio();
    if (!audio) return false;

    try {
      audio.pause();
      audio.currentTime = 0;
      audio.playbackRate = 1;
      audio.preservesPitch = true;
      // Keep mp3 close to original loudness (avoid sounding too soft vs source file)
      audio.volume = Math.min(1, Math.max(0.75, this.volume));
      await audio.play();
      return true;
    } catch (_) {
      return false;
    }
  }

  ensureActionAudio() {
    if (this.actionAudioReady && this.actionAudio) return this.actionAudio;
    try {
      this.actionAudio = new Audio(ACTION_ALERT_SOUND_SRC);
      this.actionAudio.preload = 'auto';
      this.actionAudioReady = true;
    } catch (_) {
      this.actionAudio = null;
      this.actionAudioReady = false;
    }
    return this.actionAudio;
  }

  async playActionNotificationMp3() {
    if (this.muted) return false;
    const audio = this.ensureActionAudio();
    if (!audio) return false;

    try {
      audio.pause();
      audio.currentTime = 0;
      audio.playbackRate = 1;
      audio.preservesPitch = true;
      audio.volume = Math.min(1, Math.max(0.75, this.volume));
      await audio.play();
      return true;
    } catch (_) {
      return false;
    }
  }

  bindGestureUnlock() {
    if (this.unlockBound) return;
    this.unlockBound = true;
    const events = ['pointerdown', 'touchstart', 'keydown', 'click'];
    for (const evt of events) {
      document.addEventListener(evt, this.unlockHandler, { passive: true, capture: true });
    }
  }

  async onUnlock() {
    const ok = await this.setAudioReady();
    if (!ok) return;
    const events = ['pointerdown', 'touchstart', 'keydown', 'click'];
    for (const evt of events) {
      document.removeEventListener(evt, this.unlockHandler, true);
    }
  }

  async setAudioReady() {
    if (this.ready) return true;

    if (!this.ctx) {
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return false;
        this.ctx = new Ctx({ latencyHint: 'interactive' });
      } catch (_) {
        return false;
      }
    }

    if (!this.ctx || this.ctx.state === 'closed') return false;
    if (this.ctx.state !== 'running') {
      try {
        await this.ctx.resume();
      } catch (_) {
        return false;
      }
    }

    this.ready = this.ctx.state === 'running';
    if (this.ready) {
      this.warmupChatAudio().catch(() => {});
      this.warmupActionAudio().catch(() => {});
    }
    return this.ready;
  }

  async warmupChatAudio() {
    if (this.chatAudioWarmed) return true;
    const audio = this.ensureChatAudio();
    if (!audio) return false;
    try {
      const prevMuted = audio.muted;
      const prevVolume = audio.volume;
      audio.muted = true;
      audio.volume = 0;
      await audio.play();
      audio.pause();
      audio.currentTime = 0;
      audio.muted = prevMuted;
      audio.volume = prevVolume;
      this.chatAudioWarmed = true;
      return true;
    } catch (_) {
      return false;
    }
  }

  async warmupActionAudio() {
    if (this.actionAudioWarmed) return true;
    const audio = this.ensureActionAudio();
    if (!audio) return false;
    try {
      const prevMuted = audio.muted;
      const prevVolume = audio.volume;
      audio.muted = true;
      audio.volume = 0;
      await audio.play();
      audio.pause();
      audio.currentTime = 0;
      audio.muted = prevMuted;
      audio.volume = prevVolume;
      this.actionAudioWarmed = true;
      return true;
    } catch (_) {
      return false;
    }
  }

  get muted() {
    return localStorage.getItem(LS_MUTED) === '1';
  }

  set muted(next) {
    localStorage.setItem(LS_MUTED, next ? '1' : '0');
  }

  get volume() {
    const raw = parseFloat(localStorage.getItem(LS_VOLUME));
    if (Number.isNaN(raw)) return DEFAULT_VOLUME;
    return Math.max(0.05, Math.min(1, raw));
  }

  set volume(next) {
    const value = Math.max(0.05, Math.min(1, Number(next) || DEFAULT_VOLUME));
    localStorage.setItem(LS_VOLUME, String(value));
  }

  getScope() {
    return getScopeFromPathname();
  }

  getTypeSettings(scope) {
    const normalizedScope = scope === 'admin' ? 'admin' : 'user';
    const key = getSoundTypesStorageKey(normalizedScope);
    let parsed = {};
    try {
      parsed = JSON.parse(localStorage.getItem(key) || '{}') || {};
    } catch (_) {
      parsed = {};
    }
    return (parsed && typeof parsed === 'object') ? parsed : {};
  }

  isTypeEnabled(type, scope) {
    const settings = this.getTypeSettings(scope || this.getScope());
    if (!Object.prototype.hasOwnProperty.call(settings, type)) return true;
    return settings[type] !== false;
  }

  setTypeEnabled(type, enabled, scope) {
    const normalizedType = String(type || '').trim();
    if (!normalizedType) return;
    const normalizedScope = scope === 'admin' ? 'admin' : (scope === 'user' ? 'user' : this.getScope());
    const key = getSoundTypesStorageKey(normalizedScope);
    const settings = this.getTypeSettings(normalizedScope);
    settings[normalizedType] = enabled !== false;
    localStorage.setItem(key, JSON.stringify(settings));
  }

  toggleType(type, scope) {
    const next = !this.isTypeEnabled(type, scope);
    this.setTypeEnabled(type, next, scope);
    return { type, enabled: next, scope: scope || this.getScope() };
  }

  playSound(type = 'message') {
    if (this.muted) return;
    if (!this.isTypeEnabled(type)) return;

    const isChatType = type === 'message' || type === 'admin_message' || type === 'admin_in_chat';
    const isActionAlertType = type === 'withdraw'
      || type === 'gift'
      || type === 'wallet_approved'
      || type === 'wallet_rejected'
      || type === 'gift_approved'
      || type === 'gift_rejected'
      || type === 'special_prize_approved'
      || type === 'special_prize_rejected'
      || type === 'conversion_approved'
      || type === 'conversion_rejected';

    if (isChatType) {
      this.playChatNotificationMp3().then((ok) => {
        if (ok) return;
        // Retry once after forcing audio ready/warmup.
        this.setAudioReady()
          .then(() => this.warmupChatAudio())
          .then(() => this.playChatNotificationMp3())
          .catch(() => {});
      });
      return;
    }

    if (isActionAlertType) {
      this.playActionNotificationMp3().then((ok) => {
        if (ok) return;
        this.setAudioReady()
          .then(() => this.warmupActionAudio())
          .then(() => this.playActionNotificationMp3())
          .catch(() => {});
      });
      return;
    }

    if (document.hidden || !this.ready || !this.ctx) return;

    const now = performance.now();
    if ((now - this.lastPlayAt) < 120) return;
    this.lastPlayAt = now;

    const vol = this.volume;
    if (type === 'gift') {
      this.tone(523, 523, 0.11, vol * 0.4, 0);
      this.tone(659, 659, 0.12, vol * 0.4, 0.11);
      this.tone(784, 784, 0.14, vol * 0.45, 0.24);
      return;
    }
    if (type === 'withdraw') {
      this.tone(1318, 1318, 0.08, vol * 0.5, 0);
      this.tone(1568, 1568, 0.11, vol * 0.5, 0.11);
      return;
    }

    if (type === 'system') {
      this.tone(587, 659, 0.08, vol * 0.25, 0);
      this.tone(784, 784, 0.08, vol * 0.22, 0.1);
      return;
    }

    this.tone(740, 740, 0.12, vol * 0.35, 0);
    this.tone(988, 988, 0.14, vol * 0.3, 0.12);
  }

  tone(freqA, freqB, duration, volume, offsetSec) {
    const ctx = this.ctx;
    if (!ctx || ctx.state !== 'running') return;

    const start = ctx.currentTime + (offsetSec || 0);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freqA, start);
    if (freqB !== freqA) {
      osc.frequency.exponentialRampToValueAtTime(freqB, start + duration);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    osc.stop(start + duration + 0.02);
  }

  toggleMute() {
    this.muted = !this.muted;
    if (!this.muted) this.playSound('message');
    return { muted: this.muted, icon: this.muted ? '🔕' : '🔔' };
  }

  dispose() {
    if (this.ctx && this.ctx.state !== 'closed') {
      this.ctx.close().catch(() => {});
    }
    this.ctx = null;
    this.ready = false;
  }
}

function getNotificationSound() {
  if (singleton) return singleton;
  singleton = new NotificationSoundManager();
  singleton.bindGestureUnlock();

  // Keep backward compatibility for legacy callers.
  window.notificationSound = {
    playSound: (type) => singleton.playSound(type),
    setAudioReady: () => singleton.setAudioReady(),
    toggleMute: () => singleton.toggleMute(),
    toggle: () => singleton.toggleMute(),
    isMuted: () => singleton.muted,
    setVolume: (v) => { singleton.volume = v; },
    getScope: () => singleton.getScope(),
    getTypeSettings: (scope) => singleton.getTypeSettings(scope),
    isTypeEnabled: (type, scope) => singleton.isTypeEnabled(type, scope),
    setTypeEnabled: (type, enabled, scope) => singleton.setTypeEnabled(type, enabled, scope),
    toggleType: (type, scope) => singleton.toggleType(type, scope)
  };

  return singleton;
}

window.NotificationSoundModule = window.NotificationSoundModule || {
  getNotificationSound
};
