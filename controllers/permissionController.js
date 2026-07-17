const { Permission, User } = require('../models')

async function list(req, res) {
  try {
    const permissions = await Permission.findAll({ 
      where: { is_active: true },
      limit: 200 
    })
    res.json({ success: true, data: permissions })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Unable to fetch permissions' })
  }
}

async function get(req, res) {
  try {
    const permission = await Permission.findByPk(req.params.id)
    if (!permission) return res.status(404).json({ success: false, message: 'Permission not found' })
    res.json({ success: true, data: permission })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false })
  }
}

async function create(req, res) {
  try {
    const { name, code, description, category } = req.body
    
    if (!name || !code) {
      return res.status(400).json({ success: false, message: 'Name and code are required' })
    }

    const permission = await Permission.create({
      name,
      code,
      description: description || '',
      category: category || 'system',
      is_active: true
    })
    
    res.json({ success: true, data: permission })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: err.message })
  }
}

async function update(req, res) {
  try {
    const permission = await Permission.findByPk(req.params.id)
    if (!permission) return res.status(404).json({ success: false })
    
    await permission.update(req.body)
    res.json({ success: true, data: permission })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false })
  }
}

async function remove(req, res) {
  try {
    const permission = await Permission.findByPk(req.params.id)
    if (!permission) return res.status(404).json({ success: false })
    
    
    await permission.update({ is_active: false })
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false })
  }
}

module.exports = { list, get, create, update, remove }
