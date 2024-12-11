import express from 'express';
import { Order } from '../entities/Order';
import { initializeDatabase } from '../config/database';

const app = express();
app.use(express.json());

// Initialize database connection
initializeDatabase();

app.post('/print', async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findOne(orderId, { relations: ['items'] });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Simulate sending order to fiscal printer
    console.log();
    // Here you would integrate with your actual fiscal printer

    res.json({ message: 'Fiscal receipt printed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log();
});
