import dotenv from 'dotenv';
dotenv.config();

export const {
  MONGODB_URI = 'mongodb+srv://harihk0506:anbu@cluster0.yzukbbs.mongodb.net/employ_assist',
  JWT_SECRET = 'employ_assist_secret_key_2025',
  PORT = 5001,
  CORS_ORIGIN = 'https://workzeroapp.vercel.app'
} = process.env;

export const SALT_ROUNDS = 10;

// Multiple allowed origins for CORS
export const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://workzeroapp.vercel.app',
  'https://workzeroapp-git-main.vercel.app',
  'https://workzeroapp-preview.vercel.app',
  CORS_ORIGIN
].filter(Boolean);
