import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { User } from '../entities/User';
import { redis } from '../utils/redis';
import { initializeDatabase } from '../config/database';
import { OAuth2Client } from 'google-auth-library';

const app = express();
app.use(express.json());

// Initialize database connection
initializeDatabase();

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/auth/google/callback'
);

app.get('/auth/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/userinfo.profile']
  });
  res.redirect(url);
});

app.get('/auth/google/callback', async (req, res) => {
  const { tokens } = await oauth2Client.getToken(req.query.code);
  oauth2Client.setCredentials(tokens);

  // Here you would typically create or update a user in your database
  // and generate a session token for your app

  res.redirect('/dashboard');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = uuidv4();
    await redis.set(`auth:${token}`, user.id, 'EX', 24 * 60 * 60); // Token expires in 24 hours

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/logout', async (req, res) => {
  const token = req.headers['authorization'];
  if (token) {
    await redis.del(`auth:${token}`);
  }
  res.json({ message: 'Logged out successfully' });
});

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
