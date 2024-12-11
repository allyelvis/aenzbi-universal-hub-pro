import express from 'express';
import { Customer } from '../entities/Customer';
import { initializeDatabase } from '../config/database';

const app = express();
app.use(express.json());

// Initialize database connection
initializeDatabase();

app.get('/customers', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/customers', async (req, res) => {
  try {
    const customer = Customer.create(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findOne(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findOne(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    Customer.merge(customer, req.body);
    await customer.save();
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findOne(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    await customer.remove();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`CRM Service running on port ${PORT}`);
});
