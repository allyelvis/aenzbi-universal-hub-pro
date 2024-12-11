import express from 'express';
import { SparkSession } from 'apache-spark';
import { initializeDatabase } from '../config/database';

const app = express();
app.use(express.json());

// Initialize database connection
initializeDatabase();

const spark = SparkSession
  .builder()
  .appName("AenzbiAnalytics")
  .master("spark://spark:7077")
  .getOrCreate();

app.get('/customer-analysis', async (req, res) => {
  try {
    const result = await spark.sql();

    const topCustomers = await result.collect();
    res.json(topCustomers);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3008;
app.listen(PORT, () => {
  console.log();
});
