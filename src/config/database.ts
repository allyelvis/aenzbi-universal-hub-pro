import { createConnection } from 'typeorm';
import { User } from '../entities/User';
import { Customer } from '../entities/Customer';
import { Product } from '../entities/Product';
import { Order } from '../entities/Order';
import { OrderItem } from '../entities/OrderItem';
import { Project } from '../entities/Project';
import { Invoice } from '../entities/Invoice';

export const initializeDatabase = async () => {
  try {
    await createConnection({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'admin',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'aenzbi_suite',
      entities: [User, Customer, Product, Order, OrderItem, Project, Invoice],
      synchronize: true, // Be careful with this in production
      logging: true,
    });
    console.log('Database connection established');
  } catch (error) {
    console.error('Database connection failed', error);
    process.exit(1);
  }
};
