import dotenv from 'dotenv';
dotenv.config();

export const {
  MONGODB_URI = 'mongodb+srv://harihk0506:anbu@cluster0.yzukbbs.mongodb.net/employ_assist',
  JWT_SECRET = 'employ_assist_secret_key_2025',
  PORT = 5001,
  CORS_ORIGIN = 'http://localhost:5173'
} = process.env;

export const SALT_ROUNDS = 10;
