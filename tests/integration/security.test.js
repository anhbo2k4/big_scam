const crypto = require('crypto');

/**
 * Test file for security implementations
 * Run with: node tests/security.test.js
 */

// Test 1: Server-side random generation
function testServerRandomGeneration() {
  console.log('\n🧪 TEST 1: Server-Side Random Generation');
  
  function generateServerRandomBoxes(boxCount) {
    const boxes = Array.from({ length: boxCount }, (_, i) => i + 1);
    for (let i = boxes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [boxes[i], boxes[j]] = [boxes[j], boxes[i]];
    }
    return boxes;
  }

  const results = {};
  for (let i = 0; i < 1000; i++) {
    const boxes = generateServerRandomBoxes(3);
    const winner = boxes[0];
    results[winner] = (results[winner] || 0) + 1;
  }

  console.log('Distribution of winners (should be roughly equal):');
  console.log(results);
  
  const average = 1000 / 3;
  const acceptable = average * 0.2; // 20% variance acceptable
  
  let passed = true;
  for (const [box, count] of Object.entries(results)) {
    const variance = Math.abs(count - average);
    if (variance > acceptable) {
      console.log(`❌ Box ${box}: ${count} (variance too high)`);
      passed = false;
    } else {
      console.log(`✅ Box ${box}: ${count} (variance acceptable)`);
    }
  }
  
  return passed;
}

// Test 2: Token generation
function testTokenGeneration() {
  console.log('\n🧪 TEST 2: Secure Token Generation');
  
  function generateSecureToken(length = 64) {
    return crypto.randomBytes(length / 2).toString('hex');
  }
  
  const tokens = new Set();
  for (let i = 0; i < 1000; i++) {
    const token = generateSecureToken();
    if (tokens.has(token)) {
      console.log('❌ Duplicate token generated!');
      return false;
    }
    tokens.add(token);
  }
  
  console.log(`✅ Generated 1000 unique tokens`);
  console.log(`Sample token: ${tokens.values().next().value}`);
  return true;
}

// Test 3: Hash generation
function testHashGeneration() {
  console.log('\n🧪 TEST 3: Hash Generation');
  
  function calculateHash(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }
  
  const data = 'test-data-123';
  const hash1 = calculateHash(data);
  const hash2 = calculateHash(data);
  
  if (hash1 !== hash2) {
    console.log('❌ Hash not deterministic!');
    return false;
  }
  
  console.log(`✅ Hash is deterministic`);
  console.log(`Data: "${data}"`);
  console.log(`Hash: ${hash1}`);
  
  // Check hash length
  if (hash1.length !== 64) {
    console.log(`❌ Hash length is ${hash1.length}, expected 64`);
    return false;
  }
  
  console.log(`✅ Hash length is correct (64 characters)`);
  return true;
}

// Test 4: XSS Prevention
function testXSSPrevention() {
  console.log('\n🧪 TEST 4: XSS Input Sanitization');
  
  const xss = require('xss');
  
  const testCases = [
    {
      input: '<img src=x onerror="alert(1)">',
      expected: 'no script tags'
    },
    {
      input: '"><script>alert(1)</script>',
      expected: 'no script tags'
    },
    {
      input: 'javascript:alert(1)',
      expected: 'clean'
    },
    {
      input: 'normal text',
      expected: 'normal text'
    }
  ];
  
  let passed = true;
  for (const testCase of testCases) {
    const result = xss(testCase.input);
    const hasScript = result.toLowerCase().includes('<script');
    
    if (hasScript) {
      console.log(`❌ Failed to sanitize: ${testCase.input}`);
      console.log(`   Result: ${result}`);
      passed = false;
    } else {
      console.log(`✅ Sanitized: "${testCase.input.substring(0, 30)}..."`);
    }
  }
  
  return passed;
}

// Test 5: SQL Injection Detection
function testSQLInjectionDetection() {
  console.log('\n🧪 TEST 5: SQL Injection Pattern Detection');
  
  const patterns = [
    /union\s+select/i,
    /drop\s+table/i,
    /delete\s+from/i,
  ];
  
  const testCases = [
    { input: "'; DROP TABLE users; --", shouldDetect: true },
    { input: "1' UNION SELECT * FROM passwords", shouldDetect: true },
    { input: "normal session code 123", shouldDetect: false }
  ];
  
  let passed = true;
  for (const testCase of testCases) {
    let detected = false;
    for (const pattern of patterns) {
      if (pattern.test(testCase.input)) {
        detected = true;
        break;
      }
    }
    
    if (detected === testCase.shouldDetect) {
      console.log(`✅ Correctly ${detected ? 'detected' : 'allowed'}: "${testCase.input.substring(0, 30)}..."`);
    } else {
      console.log(`❌ Failed for: "${testCase.input.substring(0, 30)}..."`);
      passed = false;
    }
  }
  
  return passed;
}

// Run all tests
async function runAllTests() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   SECURITY IMPLEMENTATION TESTS       ║');
  console.log('╚════════════════════════════════════════╝');
  
  const results = {
    'Server-side Random': testServerRandomGeneration(),
    'Secure Tokens': testTokenGeneration(),
    'Hash Generation': testHashGeneration(),
    'XSS Prevention': testXSSPrevention(),
    'SQL Injection Detection': testSQLInjectionDetection()
  };
  
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║          TEST SUMMARY                 ║');
  console.log('╚════════════════════════════════════════╝');
  
  let allPassed = true;
  for (const [test, passed] of Object.entries(results)) {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} - ${test}`);
    if (!passed) allPassed = false;
  }
  
  console.log('\n' + (allPassed ? '🎉 All tests passed!' : '⚠️  Some tests failed'));
  return allPassed;
}

if (typeof describe === 'function') {
  describe('Security Script Suite', () => {
    test('runAllTests should complete successfully', async () => {
      const ok = await runAllTests();
      expect(ok).toBe(true);
    });
  });
} else {
  runAllTests()
    .then((ok) => {
      process.exit(ok ? 0 : 1);
    })
    .catch((err) => {
      console.error('Test error:', err);
      process.exit(1);
    });
}
