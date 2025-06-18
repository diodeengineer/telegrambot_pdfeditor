


// utils/donation.js
import dotenv from 'dotenv';
dotenv.config();

// Function to get the donation inline keyboard markup
// This function DOES NOT send a message. It just returns the structure.
const getDonationMarkup = () => {
    // Get PayPal link from .env
    const paypalLink = process.env.PAYPAL_ME_LINK || 'https://paypal.me/defaultpaypal';

    // Get UPI details from .env and construct the deep link
    const upiVPA = process.env.UPI_VPA || 'default@upi'; // Fallback if not set
    const upiName = process.env.UPI_NAME ? encodeURIComponent(process.env.UPI_NAME) : '';
    const upiNote = process.env.UPI_TRANSACTION_NOTE ? encodeURIComponent(process.env.UPI_TRANSACTION_NOTE) : '';

    // --- CRITICAL: Constructing the UPI link WITHOUT the 'am' (amount) parameter ---
    let upiLink = `upi://pay?pa=${upiVPA}`;
    if (upiName) upiLink += `&pn=${upiName}`;
    // The 'am' and 'cu' (currency) parameters are intentionally OMITTED here
    // to allow the user to enter their desired donation amount.
    if (upiNote) upiLink += `&tn=${upiNote}`;

    const inlineKeyboard = [
        [{ text: '💖 Donate via PayPal', url: paypalLink }],
        [{ text: '📱 Donate via UPI', url: upiLink }]
    ];

    return {
        inline_keyboard: inlineKeyboard
    };
};

export default getDonationMarkup;