/**
 * Withdrawal Banks Module
 * Handles loading Vietnamese banks for withdrawal modal
 */

let withdrawalBanksCache = null;

/**
 * Load all Vietnamese banks for withdrawal dropdown
 */
async function loadWithdrawalBanks() {
  const bankSelect = document.getElementById('withdrawBank');
  const spinner = document.getElementById('bankLoadingSpinner');
  
  if (!bankSelect) return;
  
  try {
    // Show spinner
    if (spinner) spinner.style.display = 'block';
    
    // Check cache first
    if (withdrawalBanksCache && withdrawalBanksCache.banks && withdrawalBanksCache.banks.length > 0) {
      populateBankDropdown(withdrawalBanksCache.banks);
      if (spinner) spinner.style.display = 'none';
      return;
    }
    
    // Fetch banks from API
    const response = await fetch('/api/banks');
    
    if (!response.ok) {
      // If rate limited (429) or error, use fallback immediately
      populateBankDropdown(getFallbackBanks());
      if (spinner) spinner.style.display = 'none';
      return;
    }
    
    const data = await response.json();
    
    if (data.success && data.data && data.data.length > 0) {
      // Cache the banks
      withdrawalBanksCache = { banks: data.data, timestamp: Date.now() };
      
      // Populate dropdown
      populateBankDropdown(data.data);
    } else {
      // Fallback to default banks
      populateBankDropdown(getFallbackBanks());
    }
  } catch (error) {
    // Use fallback banks on error
    populateBankDropdown(getFallbackBanks());
  } finally {
    if (spinner) spinner.style.display = 'none';
  }
}

/**
 * Populate bank dropdown with options
 */
function populateBankDropdown(banks) {
  const bankSelect = document.getElementById('withdrawBank');
  if (!bankSelect) return;
  
  // Clear current options (keep the placeholder)
  const currentOptions = bankSelect.querySelectorAll('option:not(:first-child)');
  currentOptions.forEach(opt => opt.remove());
  
  // Add banks as options
  banks.forEach(bank => {
    const option = document.createElement('option');
    option.value = bank.name || bank.shortName || bank.bin;
    option.textContent = bank.name || bank.shortName;
    option.dataset.bin = bank.bin;
    option.dataset.shortName = bank.shortName;
    bankSelect.appendChild(option);
  });
}

/**
 * Fallback Vietnamese banks list
 */
function getFallbackBanks() {
  return [
    { name: 'Ngân hàng TMCP Ngoại thương Việt Nam', shortName: 'Vietcombank', bin: '970436' },
    { name: 'Ngân hàng TMCP Phát triển Nhà đất', shortName: 'LPB', bin: '970562' },
    { name: 'Ngân hàng TMCP Công thương Việt Nam', shortName: 'CTG', bin: '970010' },
    { name: 'Ngân hàng Techcombank', shortName: 'TCB', bin: '970407' },
    { name: 'Ngân hàng TMCP Á Châu', shortName: 'ACB', bin: '970005' },
    { name: 'Ngân hàng TMCP Quân Đội', shortName: 'MBB', bin: '970422' },
    { name: 'Ngân hàng TMCP Nông nghiệp', shortName: 'AGR', bin: '970012' },
    { name: 'Ngân hàng TMCP Sài Gòn', shortName: 'STB', bin: '970415' },
    { name: 'Ngân hàng VP Bank', shortName: 'VPB', bin: '970432' },
    { name: 'Ngân hàng TMCP Quốc tế', shortName: 'VIB', bin: '970441' },
    { name: 'Ngân hàng TMCP Kiên Long', shortName: 'KLB', bin: '970452' },
    { name: 'Ngân hàng TMCP Kỹ thương', shortName: 'TCB', bin: '970458' },
    { name: 'Ngân hàng Bản Việt', shortName: 'BVB', bin: '970450' }
  ];
}

/**
 * Initialize withdrawal banks module
 */
function initWithdrawalBanks() {
  // Load banks only when withdrawal modal is opened
  const withdrawModal = document.getElementById('withdrawModal');
  if (withdrawModal) {
    // Detect when modal becomes visible
    const observer = new MutationObserver(() => {
      const isVisible = withdrawModal.style.display !== 'none' && 
                       withdrawModal.style.visibility !== 'hidden' &&
                       !withdrawModal.classList.contains('hidden');
      if (isVisible && !withdrawalBanksCache) {
        loadWithdrawalBanks();
      }
    });
    
    observer.observe(withdrawModal, { attributes: true, style: true });
  }
  
  // Also check for openWithdrawModal function to load banks
  if (window.openWithdrawModal) {
    const original = window.openWithdrawModal;
    window.openWithdrawModal = function(...args) {
      if (!withdrawalBanksCache) {
        loadWithdrawalBanks();
      }
      return original.apply(this, args);
    };
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWithdrawalBanks);
} else {
  initWithdrawalBanks();
}

// Export for manual calls
window.loadWithdrawalBanks = loadWithdrawalBanks;
