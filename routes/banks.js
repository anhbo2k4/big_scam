/**
 * Banks API Route
 * Fetch danh sách ngân hàng từ VietQR API
 */

const express = require('express');
const router = express.Router();

// Use built-in fetch or fallback to node-fetch
let fetchFn = global.fetch;

// If built-in fetch not available, use node-fetch
if (!fetchFn) {
  try {
    const fetch = require('node-fetch');
    fetchFn = fetch;
  } catch (e) {
    console.warn('⚠️ Neither built-in fetch nor node-fetch available');
  }
}

// Cache ngân hàng trong 1 giờ
let banksCache = null;
let banksCacheTime = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

/**
 * GET /
 * Lấy danh sách ngân hàng từ VietQR API
 */
router.get('/', async (req, res) => {
  try {
    // Kiểm tra cache
    if (banksCache && banksCacheTime && Date.now() - banksCacheTime < CACHE_DURATION) {
      console.log('📊 Returning cached banks');
      return res.json({
        success: true,
        data: banksCache,
        cached: true
      });
    }

    // Fetch từ VietQR API
    console.log('🔄 Fetching banks from VietQR API...');
    
    const response = await fetchFn('https://api.vietqr.io/v2/banks', {
      method: 'GET',
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    if (!response.ok) {
      throw new Error(`VietQR API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.code || data.code !== '00') {
      throw new Error(`VietQR returned error code: ${data.code}`);
    }

    // Extract only needed fields
    const banks = data.data.map(bank => ({
      id: bank.id,
      name: bank.name,
      shortName: bank.shortName,
      bin: bank.bin,
      logo: bank.logo,
      transferSupported: bank.transferSupported,
      lookupSupported: bank.lookupSupported
    }));

    // Filter chỉ lấy ngân hàng transfer được
    const transferBanks = banks.filter(b => b.transferSupported === 1);

    // Cache lại
    banksCache = transferBanks;
    banksCacheTime = Date.now();

    console.log(`✅ Loaded ${transferBanks.length} banks`);

    res.json({
      success: true,
      data: transferBanks,
      count: transferBanks.length,
      cached: false
    });

  } catch (error) {
    console.error('❌ Error fetching banks:', error.message);
    
    // Return fallback banks nếu API fails
    const fallbackBanks = [
      { id: 970405, name: 'Ngân hàng Công thương Việt Nam', shortName: 'Vietcombank', bin: '970405' },
      { id: 970407, name: 'Ngân hàng Ngoại thương Việt Nam', shortName: 'Vietbank', bin: '970407' },
      { id: 970415, name: 'Ngân hàng Kỹ thương Việt Nam', shortName: 'Techcombank', bin: '970415' },
      { id: 970418, name: 'Ngân hàng Tây Á (ABBANK)', shortName: 'ABBANK', bin: '970418' },
      { id: 970425, name: 'Ngân hàng ACB', shortName: 'ACB', bin: '970425' },
      { id: 970010, name: 'Ngân hàng Đông Á', shortName: 'DongABank', bin: '970010' }
    ];

    res.json({
      success: false,
      data: fallbackBanks,
      message: error.message,
      note: 'Using fallback banks - API unavailable'
    });
  }
});

module.exports = router;
