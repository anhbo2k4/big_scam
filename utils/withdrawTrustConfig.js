 const DEFAULT_MIN_TRUST_SCORE_FOR_WITHDRAWAL = 100;

const clampTrustScore = (value, fallback = 100) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(0, Math.min(100, Math.round(parsed)));
};

const normalizeMinTrustScore = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return DEFAULT_MIN_TRUST_SCORE_FOR_WITHDRAWAL;
  return clampTrustScore(parsed, DEFAULT_MIN_TRUST_SCORE_FOR_WITHDRAWAL);
};

const parseSettingsValue = (raw) => {
  if (!raw) return {};
  if (typeof raw === 'object') return raw;
  try {
    return JSON.parse(String(raw));
  } catch (_) {
    return {};
  }
};

const getWithdrawalTrustConfig = async (models) => {
  const result = {
    minTrustScoreForWithdrawal: DEFAULT_MIN_TRUST_SCORE_FOR_WITHDRAWAL
  };

  try {
    if (!models || !models.SiteSettings) return result;

    const securitySetting = await models.SiteSettings.findOne({
      where: { key: 'security' },
      attributes: ['value'],
      raw: true
    });

    if (!securitySetting || securitySetting.value === undefined || securitySetting.value === null) {
      return result;
    }

    const parsedSecurity = parseSettingsValue(securitySetting.value);
    result.minTrustScoreForWithdrawal = normalizeMinTrustScore(parsedSecurity.minTrustScoreForWithdrawal);
    return result;
  } catch (_) {
    return result;
  }
};

const buildWithdrawTrustBlockedMessage = (sessionTrustScore, minTrustScoreForWithdrawal) => {
  return `Điểm tín nhiệm hiện tại (${sessionTrustScore}) thấp hơn mức tối thiểu (${minTrustScoreForWithdrawal}) để rút tiền. Vui lòng liên hệ nhân viên để được hỗ trợ.`;
};

module.exports = {
  DEFAULT_MIN_TRUST_SCORE_FOR_WITHDRAWAL,
  clampTrustScore,
  getWithdrawalTrustConfig,
  buildWithdrawTrustBlockedMessage
};
