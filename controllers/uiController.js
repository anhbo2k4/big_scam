const { UICustomization } = require('../models')

async function getUI(req, res) {
  try {
    let ui = await UICustomization.findOne()
    if (!ui) {
      ui = await UICustomization.create({})
    }
    res.json({ success: true, data: ui })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false })
  }
}

async function updateUI(req, res) {
  try {
    let ui = await UICustomization.findOne()
    if (!ui) ui = await UICustomization.create(req.body)
    else await ui.update(req.body)
    res.json({ success: true, data: ui })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false })
  }
}

module.exports = { getUI, updateUI }
