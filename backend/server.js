const express = require('express');
const dotenv = require('dotenv');
const { registerUser, loginUser } = require('./modules/auth/authService');
const { postInvoice, postStockMovement } = require('./modules/fiscalizationService');

dotenv.config();
const app = express();
app.use(express.json());

app.post('/api/auth/register', async (req, res) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const result = await loginUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Add routes for invoices and stock movements here
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
