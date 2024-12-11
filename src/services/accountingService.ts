import express from 'express';
import { Invoice } from '../entities/Invoice';
import { initializeDatabase } from '../config/database';

const app = express();
app.use(express.json());

// Initialize database connection
initializeDatabase();

app.get('/invoices', async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/invoices', async (req, res) => {
  try {
    const invoice = Invoice.create(req.body);
    await invoice.save();
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/invoices/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findOne(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/invoices/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findOne(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    Invoice.merge(invoice, req.body);
    await invoice.save();
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/invoices/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findOne(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    await invoice.remove();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log();
});
