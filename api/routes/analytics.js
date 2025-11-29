
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DB_CONNECTION_STRING });

// 1. GET /api/activity/get
// Fetch consolidated activity data
router.post('/get', async (req, res) => {
  const { range, userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  // In real implementation, "range" could determine aggregation (e.g. weekly averages)
  // For now, we return raw daily rows up to a limit
  const limit = range === 'weekly' ? 7 : range === 'monthly' ? 30 : 365;

  try {
    const result = await pool.query(
      `SELECT * FROM athlete_activity 
       WHERE user_id = $1 
       ORDER BY date ASC 
       LIMIT $2`,
      [userId, limit]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 2. POST /api/activity/export/pdf
// Generate PDF report
router.post('/export/pdf', async (req, res) => {
  const { userId, range } = req.body;
  
  // MOCK PDF GENERATION logic
  // In reality: Use 'puppeteer' or 'pdfkit' to render HTML/Charts to PDF
  
  console.log(`Generating PDF for user ${userId}, range ${range}`);
  
  // Simulate delay
  await new Promise(r => setTimeout(r, 1500));

  res.json({ 
    success: true, 
    url: `https://storage.googleapis.com/fitpro-reports/${userId}/report_${Date.now()}.pdf`,
    message: "PDF generated successfully"
  });
});

// 3. POST /api/activity/share/create
// Create share link
router.post('/share/create', async (req, res) => {
  const { userId, type, passcode } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO athlete_report_links (user_id, report_type, type, public_url, passcode, is_active)
       VALUES ($1, 'general', $2, $3, $4, true)
       RETURNING *`,
      [userId, type, `https://fit-pro.ir/share/${require('crypto').randomUUID()}`, passcode]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create link' });
  }
});

// 4. POST /api/activity/share/revoke
router.post('/share/revoke', async (req, res) => {
  const { linkId } = req.body;
  await pool.query('UPDATE athlete_report_links SET is_active = false WHERE id = $1', [linkId]);
  res.json({ success: true });
});

module.exports = router;
