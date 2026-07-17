/**
 * Wallet Controller
 * Manages user wallets, balances, and transactions
 * CRITICAL: Every money operation goes through here with logging
 */

const { Wallet, TransactionLedger, User, AuditLog } = require('../models');
const crypto = require('crypto');

// Helper: Calculate SHA256 hash
function calculateHash(data) {
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
}

// Helper: Log transaction ledger entry (CRITICAL - can never omit this)
async function logTransaction(userId, transactionType, amount, balanceBefore, balanceAfter, metadata = {}) {
  try {
    const balanceDetails = {
      available_before: metadata.available_before || balanceBefore,
      available_after: metadata.available_after || balanceAfter,
      pending_before: metadata.pending_before || 0,
      pending_after: metadata.pending_after || 0,
      locked_before: metadata.locked_before || 0,
      locked_after: metadata.locked_after || 0
    };

    const txData = {
      user_id: userId,
      transaction_type: transactionType,
      amount: amount,
      balance_before: balanceBefore,
      balance_after: balanceAfter,
      ...balanceDetails,
      game_session_id: metadata.game_session_id || null,
      withdrawal_id: metadata.withdrawal_id || null,
      prize_id: metadata.prize_id || null,
      description: metadata.description || '',
      metadata: metadata,
      created_by: metadata.created_by || 'system',
      ip_address: metadata.ip_address || '',
      user_agent: metadata.user_agent || ''
    };

    // Hash for integrity
    txData.transaction_hash = calculateHash(txData);

    await TransactionLedger.create(txData);
    return true;
  } catch (err) {
    console.error('❌ CRITICAL: Failed to log transaction:', err);
    throw new Error('Transaction logging failed - operation aborted');
  }
}

/**
 * Get wallet details for user
 */
async function getWallet(req, res) {
  try {
    const { userId } = req.params;

    const wallet = await Wallet.findOne({ where: { user_id: userId } });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    // Verify integrity
    const expected = calculateHash({
      user_id: wallet.user_id,
      total_balance: wallet.total_balance,
      available_balance: wallet.available_balance,
      pending_balance: wallet.pending_balance,
      locked_balance: wallet.locked_balance
    });

    const integrityOk = wallet.integrity_hash === expected;

    res.json({
      success: true,
      data: {
        total_balance: wallet.total_balance,
        available_balance: wallet.available_balance,
        pending_balance: wallet.pending_balance,
        locked_balance: wallet.locked_balance,
        integrity_verified: integrityOk,
        last_updated: wallet.last_updated_at
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch wallet' });
  }
}

/**
 * Add money to wallet (e.g., game win)
 * CRITICAL OPERATION: Must use transactions
 */
async function addMoney(req, res) {
  try {
    const { userId, amount, transactionType, metadata = {} } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const dbTransaction = await Wallet.sequelize.transaction();

    try {
      // Fetch wallet with locking
      const wallet = await Wallet.findOne({
        where: { user_id: userId },
        transaction: dbTransaction,
        lock: true
      });

      if (!wallet) {
        await dbTransaction.rollback();
        return res.status(404).json({ success: false, message: 'Wallet not found' });
      }

      const balanceBefore = wallet.total_balance;
      const balanceAfter = balanceBefore + amount;

      // Update wallet with new optimistic locking version
      await Wallet.update(
        {
          total_balance: balanceAfter,
          available_balance: wallet.available_balance + amount,
          last_updated_at: new Date(),
          updated_by: metadata.updated_by || 'system',
          version: wallet.version + 1,
          integrity_hash: calculateHash({
            user_id: userId,
            total_balance: balanceAfter,
            available_balance: wallet.available_balance + amount,
            pending_balance: wallet.pending_balance,
            locked_balance: wallet.locked_balance
          })
        },
        { where: { user_id: userId }, transaction: dbTransaction }
      );

      // Log transaction
      await logTransaction(
        userId,
        transactionType || 'GAME_WIN',
        amount,
        balanceBefore,
        balanceAfter,
        {
          ...metadata,
          available_before: wallet.available_balance,
          available_after: wallet.available_balance + amount,
          pending_before: wallet.pending_balance,
          pending_after: wallet.pending_balance,
          locked_before: wallet.locked_balance,
          locked_after: wallet.locked_balance
        }
      );

      await dbTransaction.commit();

      res.json({
        success: true,
        message: 'Money added successfully',
        data: {
          new_balance: balanceAfter,
          amount_added: amount
        }
      });
    } catch (err) {
      await dbTransaction.rollback();
      throw err;
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to add money' });
  }
}

/**
 * Subtract money from wallet (e.g., withdrawal request)
 * Moves to pending balance
 */
async function subtractMoney(req, res) {
  try {
    const { userId, amount, transactionType, withdrawalId, metadata = {} } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const dbTransaction = await Wallet.sequelize.transaction();

    try {
      const wallet = await Wallet.findOne({
        where: { user_id: userId },
        transaction: dbTransaction,
        lock: true
      });

      if (!wallet) {
        await dbTransaction.rollback();
        return res.status(404).json({ success: false, message: 'Wallet not found' });
      }

      // Check available balance
      if (wallet.available_balance < amount) {
        await dbTransaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Insufficient available balance',
          available: wallet.available_balance,
          requested: amount
        });
      }

      const balanceBefore = wallet.total_balance;
      const newAvailable = wallet.available_balance - amount;
      const newPending = wallet.pending_balance + amount;
      const balanceAfter = balanceBefore; // Total doesn't change, just moves from available to pending

      // Update wallet
      await Wallet.update(
        {
          available_balance: newAvailable,
          pending_balance: newPending,
          last_updated_at: new Date(),
          updated_by: metadata.updated_by || 'system',
          version: wallet.version + 1,
          integrity_hash: calculateHash({
            user_id: userId,
            total_balance: wallet.total_balance,
            available_balance: newAvailable,
            pending_balance: newPending,
            locked_balance: wallet.locked_balance
          })
        },
        { where: { user_id: userId }, transaction: dbTransaction }
      );

      // Log transaction
      await logTransaction(
        userId,
        transactionType || 'WITHDRAWAL_REQUEST',
        -amount,
        balanceBefore,
        balanceAfter,
        {
          ...metadata,
          withdrawal_id: withdrawalId,
          available_before: wallet.available_balance,
          available_after: newAvailable,
          pending_before: wallet.pending_balance,
          pending_after: newPending,
          locked_before: wallet.locked_balance,
          locked_after: wallet.locked_balance
        }
      );

      await dbTransaction.commit();

      res.json({
        success: true,
        message: 'Money moved to pending successfully',
        data: {
          available_balance: newAvailable,
          pending_balance: newPending,
          amount_pending: amount
        }
      });
    } catch (err) {
      await dbTransaction.rollback();
      throw err;
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to process withdrawal' });
  }
}

/**
 * Lock money (e.g., for game in progress)
 */
async function lockMoney(req, res) {
  try {
    const { userId, amount, metadata = {} } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const dbTransaction = await Wallet.sequelize.transaction();

    try {
      const wallet = await Wallet.findOne({
        where: { user_id: userId },
        transaction: dbTransaction,
        lock: true
      });

      if (!wallet || wallet.available_balance < amount) {
        await dbTransaction.rollback();
        return res.status(400).json({ success: false, message: 'Insufficient balance' });
      }

      const balanceBefore = wallet.total_balance;

      // Update wallet (move from available to locked)
      await Wallet.update(
        {
          available_balance: wallet.available_balance - amount,
          locked_balance: wallet.locked_balance + amount,
          version: wallet.version + 1
        },
        { where: { user_id: userId }, transaction: dbTransaction }
      );

      // Log
      await logTransaction(
        userId,
        'LOCKED_HOLD',
        0,
        balanceBefore,
        balanceBefore,
        { ...metadata }
      );

      await dbTransaction.commit();
      res.json({ success: true, message: 'Money locked' });
    } catch (err) {
      await dbTransaction.rollback();
      throw err;
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
}

/**
 * Unlock money
 */
async function unlockMoney(req, res) {
  try {
    const { userId, amount, metadata = {} } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const dbTransaction = await Wallet.sequelize.transaction();

    try {
      const wallet = await Wallet.findOne({
        where: { user_id: userId },
        transaction: dbTransaction,
        lock: true
      });

      if (!wallet || wallet.locked_balance < amount) {
        await dbTransaction.rollback();
        return res.status(400).json({ success: false, message: 'Invalid amount' });
      }

      // Update wallet
      await Wallet.update(
        {
          available_balance: wallet.available_balance + amount,
          locked_balance: wallet.locked_balance - amount,
          version: wallet.version + 1
        },
        { where: { user_id: userId }, transaction: dbTransaction }
      );

      // Log
      await logTransaction(userId, 'LOCKED_RELEASE', 0, wallet.total_balance, wallet.total_balance, metadata);

      await dbTransaction.commit();
      res.json({ success: true, message: 'Money unlocked' });
    } catch (err) {
      await dbTransaction.rollback();
      throw err;
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
}

/**
 * Get transaction history for user
 */
async function getTransactionHistory(req, res) {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const transactions = await TransactionLedger.findAndCountAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: transactions.rows,
      total: transactions.count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
}

module.exports = {
  getWallet,
  addMoney,
  subtractMoney,
  lockMoney,
  unlockMoney,
  getTransactionHistory
};
