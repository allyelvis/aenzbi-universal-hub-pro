import express from 'express';
import amqp from 'amqplib';
import nodemailer from 'nodemailer';
import { initializeDatabase } from '../config/database';

const app = express();
app.use(express.json());

// Initialize database connection
initializeDatabase();

// Setup nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function setupQueue() {
  const connection = await amqp.connect('amqp://rabbitmq');
  const channel = await connection.createChannel();
  const queue = 'notifications';

  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const { to, subject, text } = JSON.parse(msg.content.toString());
      try {
        await transporter.sendMail({ to, subject, text });
        console.log('Email sent successfully');
        channel.ack(msg);
      } catch (error) {
        console.error('Error sending email:', error);
      }
    }
  });
}

setupQueue().catch(console.error);

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log();
});
