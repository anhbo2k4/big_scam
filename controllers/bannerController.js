'use strict';

/**
 * Banner Controller
 * CRUD for the multi-banner slider system.
 * GET  /api/banners            — public (game screen + homepage)
 * GET  /api/banners/admin      — admin, includes inactive banners
 * POST /api/banners            — admin create
 * PUT  /api/banners/:id        — admin update
 * DELETE /api/banners/:id      — admin delete
 * PUT  /api/banners/reorder    — admin reorder (body: { ids: [1,3,2] })
 */

const db = require('../models');
const { Banner } = db;

function toNullableText(v) {
  if (v === undefined) return undefined;
  const s = String(v || '').trim();
  return s || null;
}

function toBool(v, fallback) {
  if (v === undefined) return fallback;
  return !!v;
}

function toInt(v, fallback) {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.floor(n));
}

function toDateOrNull(v) {
  if (v === undefined || v === null || v === '') return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

function toCssSize(v, fallback = null) {
  if (v === undefined) return fallback;
  const s = String(v || '').trim().toLowerCase();
  if (!s) return null;
  if (!/^(\d{1,4})(px|vw|vh|%)$/.test(s)) return fallback;
  return s;
}

function sanitizeBanner(b) {
  if (!b) return null;
  const obj = b.toJSON ? b.toJSON() : { ...b };
  return obj;
}

function isMissingTableError(err) {
  const msg = String(err && err.message || '');
  return msg.includes("doesn't exist") || msg.includes('ER_NO_SUCH_TABLE') || msg.includes('no such table');
}

// GET /api/banners — public, active only, sorted
exports.list = async (req, res) => {
  try {
    const location = req.query.location; // 'game' | 'home' | undefined
    const where = { is_active: true };
    if (location === 'game') {
      where.location = ['game', 'both'];
    } else if (location === 'home') {
      where.location = ['home', 'both'];
    }

    const banners = await Banner.findAll({
      where,
      order: [['sort_order', 'ASC'], ['created_at', 'ASC']]
    });

    const nowTs = Date.now();
    const data = banners
      .map(sanitizeBanner)
      .filter((b) => {
        const start = b.start_at ? new Date(b.start_at).getTime() : null;
        const end = b.end_at ? new Date(b.end_at).getTime() : null;
        if (start && Number.isFinite(start) && nowTs < start) return false;
        if (end && Number.isFinite(end) && nowTs > end) return false;
        return true;
      });

    return res.json({ success: true, data });
  } catch (err) {
    if (isMissingTableError(err)) return res.json({ success: true, data: [] });
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/banners/admin — admin, all banners
exports.adminList = async (req, res) => {
  try {
    const banners = await Banner.findAll({
      order: [['sort_order', 'ASC'], ['created_at', 'ASC']]
    });
    return res.json({ success: true, data: banners.map(sanitizeBanner) });
  } catch (err) {
    if (isMissingTableError(err)) return res.json({ success: true, data: [] });
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/banners — admin create
exports.create = async (req, res) => {
  try {
    const {
      text,
      image_url,
      link_url,
      link_target,
      location,
      display_type,
      aspect_ratio,
      popup_width,
      popup_height,
      popup_delay_ms,
      popup_frequency,
      show_animation,
      hide_animation,
      auto_close_ms,
      start_at,
      end_at,
      popup_dismissible,
      bg_color,
      text_color,
      cta_text,
      cta_bg_color,
      cta_text_color,
      design_json,
      design_html,
      design_css,
      is_active,
      sort_order
    } = req.body;

    const banner = await Banner.create({
      text: toNullableText(text),
      image_url: toNullableText(image_url),
      link_url: toNullableText(link_url),
      link_target: ['_blank', '_self'].includes(link_target) ? link_target : '_blank',
      location: ['game', 'home', 'both'].includes(location) ? location : 'both',
      display_type: ['bar', 'popup', 'both'].includes(display_type) ? display_type : 'bar',
      aspect_ratio: ['16:9', '3:4', '4:3', '9:16', '1:1'].includes(aspect_ratio) ? aspect_ratio : '16:9',
      popup_width: toCssSize(popup_width, null),
      popup_height: toCssSize(popup_height, null),
      popup_delay_ms: toInt(popup_delay_ms, 800),
      popup_frequency: ['always', 'session', 'daily'].includes(popup_frequency) ? popup_frequency : 'session',
      show_animation: ['zoom', 'fade', 'slide-up', 'slide-down', 'flip'].includes(show_animation) ? show_animation : 'zoom',
      hide_animation: ['fade', 'zoom-out', 'slide-down', 'slide-up'].includes(hide_animation) ? hide_animation : 'fade',
      auto_close_ms: auto_close_ms === null || auto_close_ms === '' ? null : toInt(auto_close_ms, 0),
      start_at: toDateOrNull(start_at),
      end_at: toDateOrNull(end_at),
      popup_dismissible: toBool(popup_dismissible, true),
      bg_color: toNullableText(bg_color),
      text_color: toNullableText(text_color),
      cta_text: toNullableText(cta_text),
      cta_bg_color: toNullableText(cta_bg_color),
      cta_text_color: toNullableText(cta_text_color),
      design_json: toNullableText(design_json),
      design_html: toNullableText(design_html),
      design_css: toNullableText(design_css),
      is_active: toBool(is_active, true),
      sort_order: toInt(sort_order, 0),
      created_by: req.session?.user?.username || 'admin'
    });
    return res.status(201).json({ success: true, data: sanitizeBanner(banner) });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/banners/:id — admin update
exports.update = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });

    const {
      text,
      image_url,
      link_url,
      link_target,
      location,
      display_type,
      aspect_ratio,
      popup_width,
      popup_height,
      popup_delay_ms,
      popup_frequency,
      show_animation,
      hide_animation,
      auto_close_ms,
      start_at,
      end_at,
      popup_dismissible,
      bg_color,
      text_color,
      cta_text,
      cta_bg_color,
      cta_text_color,
      design_json,
      design_html,
      design_css,
      is_active,
      sort_order
    } = req.body;

    const updates = {};
    if (text !== undefined) updates.text = toNullableText(text);
    if (image_url !== undefined) updates.image_url = toNullableText(image_url);
    if (link_url !== undefined) updates.link_url = toNullableText(link_url);
    if (link_target && ['_blank', '_self'].includes(link_target)) updates.link_target = link_target;
    if (location && ['game', 'home', 'both'].includes(location)) updates.location = location;
    if (display_type && ['bar', 'popup', 'both'].includes(display_type)) updates.display_type = display_type;
    if (aspect_ratio && ['16:9', '3:4', '4:3', '9:16', '1:1'].includes(aspect_ratio)) updates.aspect_ratio = aspect_ratio;
    if (popup_width !== undefined) updates.popup_width = toCssSize(popup_width, null);
    if (popup_height !== undefined) updates.popup_height = toCssSize(popup_height, null);
    if (popup_delay_ms !== undefined) updates.popup_delay_ms = toInt(popup_delay_ms, 800);
    if (popup_frequency && ['always', 'session', 'daily'].includes(popup_frequency)) updates.popup_frequency = popup_frequency;
    if (show_animation && ['zoom', 'fade', 'slide-up', 'slide-down', 'flip'].includes(show_animation)) updates.show_animation = show_animation;
    if (hide_animation && ['fade', 'zoom-out', 'slide-down', 'slide-up'].includes(hide_animation)) updates.hide_animation = hide_animation;
    if (auto_close_ms !== undefined) updates.auto_close_ms = (auto_close_ms === null || auto_close_ms === '') ? null : toInt(auto_close_ms, 0);
    if (start_at !== undefined) updates.start_at = toDateOrNull(start_at);
    if (end_at !== undefined) updates.end_at = toDateOrNull(end_at);
    if (popup_dismissible !== undefined) updates.popup_dismissible = !!popup_dismissible;
    if (bg_color !== undefined) updates.bg_color = toNullableText(bg_color);
    if (text_color !== undefined) updates.text_color = toNullableText(text_color);
    if (cta_text !== undefined) updates.cta_text = toNullableText(cta_text);
    if (cta_bg_color !== undefined) updates.cta_bg_color = toNullableText(cta_bg_color);
    if (cta_text_color !== undefined) updates.cta_text_color = toNullableText(cta_text_color);
    if (design_json !== undefined) updates.design_json = toNullableText(design_json);
    if (design_html !== undefined) updates.design_html = toNullableText(design_html);
    if (design_css !== undefined) updates.design_css = toNullableText(design_css);
    if (is_active !== undefined) updates.is_active = !!is_active;
    if (sort_order !== undefined) updates.sort_order = toInt(sort_order, 0);

    await banner.update(updates);
    return res.json({ success: true, data: sanitizeBanner(banner) });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/banners/:id — admin delete
exports.remove = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
    await banner.destroy();
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/banners/reorder — admin reorder
exports.reorder = async (req, res) => {
  try {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
    await Promise.all(ids.map((id, idx) =>
      Banner.update({ sort_order: idx }, { where: { id } })
    ));
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
