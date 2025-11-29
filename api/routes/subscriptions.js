const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DB_CONNECTION_STRING });

// GET /api/subscriptions/status
router.get('/status', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'userId required' });

  try {
    const result = await pool.query(
      `SELECT * FROM subscriptions WHERE user_id = $1 AND status = 'active' ORDER BY expiry_date DESC LIMIT 1`,
      [userId]
    );
    
    if (result.rows.length > 0) {
      res.json({ active: true, subscription: result.rows[0] });
    } else {
      res.json({ active: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/subscriptions/create (Internal or Admin use mostly, usually handled via Payment)
router.post('/create', async (req, res) => {
  // Logic to manually create a subscription
  res.json({ message: "Use payment endpoints to initiate subscription." });
});

module.exports = router;
