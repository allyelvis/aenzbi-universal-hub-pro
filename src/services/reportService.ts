import express from 'express';
import { createObjectCsvWriter } from 'csv-writer';
import { Order } from '../entities/Order';
import { Customer } from '../entities/Customer';
import { initializeDatabase } from '../config/database';

const app = express();
app.use(express.json());

// Initialize database connection
initializeDatabase();

app.get('/sales-report', async (req, res) => {
  try {
    const orders = await Order.find({ relations: ['customer', 'items', 'items.product'] });

    const csvWriter = createObjectCsvWriter({
      path: 'sales_report.csv',
      header: [
        { id: 'orderId', title: 'Order ID' },
        { id: 'customerName', title: 'Customer Name' },
        { id: 'total', title: 'Total' },
        { id: 'date', title: 'Date' },
      ],
    });

    const records = orders.map(order => ({
      orderId: order.id,
      customerName: order.customer.name,
      total: order.total,
      date: order.createdAt,
    }));

    await csvWriter.writeRecords(records);

    res.download('sales_report.csv');
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
  console.log();
});
