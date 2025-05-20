require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const app = express();

app.use(express.json());

const pool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false }
});

// Walidacja klucza
function isValidKey(key) {
  return typeof key === 'string' && /^[A-Za-z0-9]{18}$/.test(key);
}

// Sprawdzenie klucza
app.post('/api/check-key', async (req, res) => {
  const { key } = req.body;
  console.log('Received key:', key);  // logujemy co przyszło w żądaniu

  if (!isValidKey(key)) {
    console.log('Invalid key format'); // log jeśli format nie przejdzie
    return res.status(400).json({ success: false, message: 'Invalid key format' });
  }

  try {
    const result = await pool.query('SELECT * FROM keys WHERE "key" = $1', [key]);
    console.log('DB result rows:', result.rows);  // logujemy wynik zapytania

    if (result.rows.length > 0) {
      res.json({ success: true, message: 'Access granted.' });
    } else {
      res.json({ success: false, message: 'Wrong key!' });
    }
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
