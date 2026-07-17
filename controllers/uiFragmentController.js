const path = require('path');

const FRAGMENT_VIEW_MAP = {
  wallet: 'partials/lucky-v2/fragments/wallet',
  chat: 'partials/lucky-v2/fragments/chat',
  history: 'partials/lucky-v2/fragments/history',
  'admin-status': 'partials/lucky-v2/fragments/admin-status'
};

exports.getFragment = async (req, res) => {
  const rawName = String(req.params.name || '').trim().toLowerCase();
  const viewName = FRAGMENT_VIEW_MAP[rawName];

  if (!viewName) {
    return res.status(404).send('Fragment not found');
  }

  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Vary', 'Accept-Encoding');

  try {
    return res.render(viewName, {
      title: res.locals.title || 'Mở Hộp Quà',
      seo: res.locals.seo || {},
      content: res.locals.content || {},
      appearance: res.locals.appearance || {}
    });
  } catch (err) {
    return res.status(500).send('Failed to render fragment');
  }
};
