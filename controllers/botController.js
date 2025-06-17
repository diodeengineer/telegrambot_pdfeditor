import bot  from '../bot/bot.js';

export const webhookRoute = (req, res) => {
bot.handleUpdate(req.body, res);

  console.log("✅ Message received:", req.body?.message?.text || "Non-text event");
  res.sendStatus(200);
};



