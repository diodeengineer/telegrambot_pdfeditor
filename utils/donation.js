const sendDonationMessage = (bot, chatId) => {
  bot.sendMessage(chatId, '🙏 If this bot helped you, consider supporting my work:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: '💖 Donate via PayPal', url: 'https://paypal.me/yourusername' }],
        [{ text: '📱 Donate via UPI', url: 'https://your-upi-link-or-image-host' }]
      ]
    }
  });
};

export default sendDonationMessage;