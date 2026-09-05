const assert = require('node:assert/strict')
const { sanitizeSessionUpdatePayload } = require('../../controllers/gamesessionController')

const payload = sanitizeSessionUpdatePayload({
  session_code: 'UNEXPECTED-NEW-CODE',
  status: 'inactive',
  prize_1: 'Quà mới',
  server_random_seed: 'attacker-controlled'
})

assert.equal(payload.session_code, undefined)
assert.equal(payload.server_random_seed, undefined)
assert.equal(payload.status, 'paused')
assert.equal(payload.is_active, false)
assert.equal(payload.prize_1, 'Quà mới')
assert.throws(
  () => sanitizeSessionUpdatePayload({ status: 'VIP' }),
  /Trạng thái phiên không hợp lệ/
)

console.log('session update payload regression: PASS')
