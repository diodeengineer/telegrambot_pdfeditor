import dotenv from 'dotenv';


dotenv.config();
const UPI = process.env.UPI
const sendDonationMessage = (bot, chatId) => {
  bot.sendMessage(chatId, '🙏 If this bot helped you, consider supporting my work:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: '💖 Donate via PayPal', url: 'https://paypal.me/yourusername' }],
        [{ text: '📱 Donate via UPI', url: UPI }]
      ]
    }
  });
};

export default sendDonationMessage;