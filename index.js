

import express from 'express';
import dotenv from 'dotenv';
import { webhookRoute } from './controllers/botController.js';
import connectDB from './config/database.js';
import { setWebhook } from './bot/bot.js'; // ✅ Import this
import mongoose from 'mongoose';
import bot from './bot/bot.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

connectDB(); // Commented out if MongoDB not needed

// Middleware to parse JSON
app.use(express.json());

// Webhook route
app.post(`/bot${process.env.BOT_TOKEN}`, webhookRoute);

// Start server and set webhook
app.listen(port, async () => {
  console.log(`🚀 Server running on port ${port}`);
  setWebhook(); // ✅ Call this to set webhook
});





