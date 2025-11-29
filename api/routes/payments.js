const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
// In a real setup, import verifyTetherPayment from the cloud function source or call it via HTTP
const pool = new Pool({ connectionString: process.env.DB_CONNECTION_STRING });

// POST /api/payments/submit-tx
router.post('/submit-tx', async (req, res) => {
  const { userId, plan, duration, txid, amountUsd } = req.body;
  
  if (!txid || !userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Create Subscription Record (Pending)
    const subRes = await client.query(
      `INSERT INTO subscriptions (user_id, plan, duration_months, status) 
       VALUES ($1, $2, $3, 'pending') RETURNING id`,
      [userId, plan, duration]
    );
    const subId = subRes.rows[0].id;

    // 2. Create Payment Record
    const payRes = await client.query(
      `INSERT INTO payments (user_id, subscription_id, amount_usd, method, tx_id, status) 
       VALUES ($1, $2, $3, 'USDT_TRC20', $4, 'pending') RETURNING id`,
      [userId, subId, amountUsd, txid]
    );
    
    await client.query('COMMIT');

    // 3. Trigger Verification (Async or Sync depending on architecture)
    // Here we just acknowledge receipt. A background worker or direct Cloud Function call would verify.
    return res.json({ 
      success: true, 
      paymentId: payRes.rows[0].id, 
      message: "Payment recorded. Verification in progress." 
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// POST /api/payments/manual-receipt
router.post('/manual-receipt', async (req, res) => {
  const { userId, plan, duration, receiptUrl, amountUsd } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const subRes = await client.query(
      `INSERT INTO subscriptions (user_id, plan, duration_months, status) 
       VALUES ($1, $2, $3, 'pending') RETURNING id`,
      [userId, plan, duration]
    );
    
    const payRes = await client.query(
      `INSERT INTO payments (user_id, subscription_id, amount_usd, method, receipt_url, status) 
       VALUES ($1, $2, $3, 'RECEIPT', $4, 'pending') RETURNING id`,
      [userId, subRes.rows[0].id, amountUsd, receiptUrl]
    );

    // Add to pending queue for admin
    await client.query(
      `INSERT INTO pending_payments (payment_id, reason) VALUES ($1, 'Manual Receipt Upload')`,
      [payRes.rows[0].id]
    );

    await client.query('COMMIT');
    return res.json({ success: true, message: "Receipt uploaded for admin review." });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

module.exports = router;
