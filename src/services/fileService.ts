import express from 'express';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { initializeDatabase } from '../config/database';

const app = express();
app.use(express.json());

// Initialize database connection
initializeDatabase();

const upload = multer({ dest: 'uploads/' });

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: ,
      Body: file.buffer,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    res.json({ message: 'File uploaded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3009;
app.listen(PORT, () => {
  console.log();
});
