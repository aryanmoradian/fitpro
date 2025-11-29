
// Node 18+ (Google Cloud Functions)
const axios = require('axios');
const { Pool } = require('pg');

// env vars: TRONGRID_API_KEY (optional), PLATFORM_USDT_ADDRESS, DB_CONNECTION_STRING
const TRONGRID_API_BASE = 'https://api.trongrid.io'; // or TronGrid endpoint
const PLATFORM_ADDRESS = process.env.PLATFORM_USDT_ADDRESS; // TYkGpr...
const pool = new Pool({ connectionString: process.env.DB_CONNECTION_STRING });

/**
 * verifyTx - verifies TRC20 transfer by txid
 * POST body: { txid, expected_amount_usd, expected_amount_usdt, expected_address }
 */
exports.verifyTetherPayment = async (req, res) => {
  try {
    const { txid, expected_amount_usdt } = req.body;
    if (!txid) return res.status(400).json({ error: 'txid required' });

    // Query TronGrid / Tronscan tx details
    const txUrl = `${TRONGRID_API_BASE}/wallet/gettransactionbyid`;
    // TronGrid expects POST with txID in body for some endpoints — adapt to chosen API
    const txResp = await axios.post(txUrl, { value: txid }, {
      headers: { 'Content-Type': 'application/json', 'TRON-PRO-API-KEY': process.env.TRONGRID_API_KEY || '' }
    });

    const tx = txResp.data;
    // basic check
    if (!tx) return res.status(404).json({ verified: false, reason: 'tx not found' });

    // Parse logs / contract_result to find TRC20 transfer event
    // Many Tron APIs provide "log" with topics for transfer events; else fetch internal transactions
    const tokenTransfers = tx.log || tx.internal_transactions || []; // adapt per API
    // You will need to inspect actual API return shape; below is pseudo-logic:

    // Example pseudo-code to find transfer to PLATFORM_ADDRESS
    let matched = null;
    for (const t of tokenTransfers) {
      // if t.to === PLATFORM_ADDRESS && t.contract === 'USDT-TRC20' && t.value == expected_amount_usdt
      // Note: on TRON amount usually in token's smallest unit (with decimals)
      if ((t.to || '').toLowerCase() === PLATFORM_ADDRESS.toLowerCase()) {
        // convert token amount if needed
        const tokenAmount = Number(t.value) / (10 ** (t.token_decimal || 6)); // adjust decimals (USDT often 6)
        if (!expected_amount_usdt || Math.abs(tokenAmount - Number(expected_amount_usdt)) < 0.0001) {
          matched = { tx: tx, tokenAmount };
          break;
        }
      }
    }

    const verified = Boolean(matched);

    // Persist verification attempt to DB
    const client = await pool.connect();
    try {
      await client.query(
        `INSERT INTO tx_verifications (txid, platform_address, amount_usdt, verified, raw_response, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [txid, PLATFORM_ADDRESS, matched ? matched.tokenAmount : null, verified, JSON.stringify(tx)]
      );
    } finally {
      client.release();
    }

    return res.json({ verified, details: matched ? { amount: matched.tokenAmount } : { reason: 'no matching transfer' } });
  } catch (err) {
    console.error('verifyTetherPayment error', err?.response?.data || err.message || err);
    return res.status(500).json({ error: 'internal_error', detail: err.message });
  }
};
