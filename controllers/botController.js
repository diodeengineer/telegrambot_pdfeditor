import bot  from '../bot/bot.js';

export const webhookRoute = (req, res) => {
  bot.processUpdate(req.body);  // Forward Telegram updates
  console.log("✅ Message received:", req.body?.message?.text || "Non-text event");
  res.sendStatus(200);
};

