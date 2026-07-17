const { PrizeIcon } = require('../models')

async function list(req, res) {
  try {
    const items = await PrizeIcon.findAll({ order: [['id', 'ASC']] })
    res.json({ success: true, data: items })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false })
  }
}

async function create(req, res) {
  try {
    const item = await PrizeIcon.create(req.body)
    res.json({ success: true, data: item })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false })
  }
}

async function remove(req, res) {
  try {
    const item = await PrizeIcon.findByPk(req.params.id)
    if (!item) return res.status(404).json({ success: false })
    await item.destroy()
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false })
  }
}

module.exports = { list, create, remove }
