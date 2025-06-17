// import TelegramBot from 'node-telegram-bot-api';
// import dotenv from 'dotenv';
// import axios from 'axios';
// import fs from 'fs/promises';
// import { existsSync, mkdirSync } from 'fs';
// import path from 'path';

// import { splitPdf } from '../utils/splitPdf.js';
// import { mergePdfs } from '../utils/mergePdf.js';
// import { extractTextFromPdf } from '../utils/extractText.js';

// dotenv.config();
// const token = process.env.BOT_TOKEN;
// export const bot = new TelegramBot(token, { webHook: true });

// const userFiles = new Map();

// const userProcessing = new Map(); // chatId: true/false

// const uploadsDir = './uploads';

// // Ensure uploads folder exists
// if (!existsSync(uploadsDir)) {
//   mkdirSync(uploadsDir);
// }

// // ✅ /start command
// bot.onText(/\/start|.*/, (msg) => {
//   const chatId = msg.chat.id;
//   const name = msg.from?.first_name || "there";

//   userFiles.set(chatId, []);

//   const welcomeMessage = `
// 👋 Hello *${name}*!

// 📄 Please upload *PDF* files.

// I'll help you with options like:
// 🧩 Split, 📎 Merge, 🗒️ Extract Text, and more.

// Upload PDFs and select an option below.
//   `;

//   bot.sendMessage(chatId, welcomeMessage, { parse_mode: "Markdown" });
// });

// // ✅ PDF upload handler
// bot.on('document', async (msg) => {
//   const chatId = msg.chat.id;
//   const file = msg.document;

//   if (file.mime_type === 'application/pdf') {
//     const fileId = file.file_id;

//     if (!userFiles.has(chatId)) userFiles.set(chatId, []);
//     userFiles.get(chatId).push(fileId);

//     bot.sendMessage(chatId, `✅ Added: *${file.file_name}*`, { parse_mode: 'Markdown' });

//     bot.sendMessage(chatId, 'What would you like to do?', {
//       reply_markup: {
//         inline_keyboard: [
//           [{ text: '🧩 Auto Split PDF', callback_data: 'split_auto' }],
//           [{ text: '✂️ Custom Split PDF', callback_data: 'split_custom' }],
//           [{ text: '📎 Merge PDFs', callback_data: 'merge' }],
//           [{ text: '📝 Extract Text', callback_data: 'extract' }]
//         ]
//       }
//     });
//   } else {
//     bot.sendMessage(chatId, '❌ Only PDF files are allowed.');
//   }
// });

// // ✅ Global message listener (optional but helpful for debugging)
// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;

//   // If message is not text and not a document (PDF), log it
//   if (!msg.text && !msg.document) {
//     console.log('ℹ️ Non-text, non-document message received:', msg);
//     bot.sendMessage(chatId, '⚠️ Please send text or PDF files only.');
//   }
// });

// // ✅ Button actions
// bot.on('callback_query', async (query) => {
//   const chatId = query.message.chat.id;
//   const action = query.data;
//   const fileIds = userFiles.get(chatId);

//   if (!fileIds || fileIds.length === 0) {
//     return bot.sendMessage(chatId, "⚠️ Please upload at least one PDF first.");
//   }

//   } else if (action === 'split_auto') {
//   const fileId = fileIds[fileIds.length - 1];

//   userProcessing.set(chatId, true); // mark as processing

//   bot.sendMessage(chatId, '🔧 Starting auto split...\nClick ❌ *Cancel* if you want to stop.', {
//     parse_mode: 'Markdown',
//     reply_markup: {
//       inline_keyboard: [
//         [{ text: '❌ Cancel Split', callback_data: 'cancel_split' }]
//       ]
//     }
//   });

//   try {
//     const fileInfo = await bot.getFile(fileId);
//     const fileUrl = `https://api.telegram.org/file/bot${token}/${fileInfo.file_path}`;
//     const res = await axios.get(fileUrl, { responseType: 'arraybuffer' });
//     const pdfBuffer = Buffer.from(res.data);

//     const filePaths = await splitPdf(pdfBuffer, uploadsDir);

//     for (const filePath of filePaths) {
//       if (!userProcessing.get(chatId)) {
//         bot.sendMessage(chatId, '🛑 Split operation was cancelled.');
//         break;
//       }

//       await bot.sendDocument(chatId, filePath);
//       await fs.unlink(filePath);
//     }

//     if (userProcessing.get(chatId)) {
//       bot.sendMessage(chatId, '✅ Auto split completed!');
//     }

//     userProcessing.set(chatId, false);
//     bot.answerCallbackQuery(query.id, { text: "✅ Done!" });
//   } catch (err) {
//     console.error(err);
//     bot.sendMessage(chatId, "❌ Failed to split the PDF.");
//     userProcessing.set(chatId, false);
//   }


// } else if (action === 'cancel_split') {
//   userProcessing.set(chatId, false);
//   bot.answerCallbackQuery(query.id, { text: '❌ Split cancelled!' });

//   // if (action === 'split_auto') {
//   //   const fileId = fileIds[fileIds.length - 1];
//   //   try {
//   //     bot.sendMessage(chatId, '🔧 Splitting your PDF...');

//   //     const fileInfo = await bot.getFile(fileId);
//   //     const fileUrl = `https://api.telegram.org/file/bot${token}/${fileInfo.file_path}`;
//   //     const res = await axios.get(fileUrl, { responseType: 'arraybuffer' });
//   //     const pdfBuffer = Buffer.from(res.data);

//   //     const filePaths = await splitPdf(pdfBuffer, uploadsDir);

//   //     for (const filePath of filePaths) {
//   //       await bot.sendDocument(chatId, filePath);
//   //       await fs.unlink(filePath);
//   //     }

//   //     bot.answerCallbackQuery(query.id, { text: "✅ Auto split complete!" });
//   //   } catch (err) {
//   //     console.error(err);
//   //     bot.sendMessage(chatId, "❌ Failed to auto-split the PDF.");
//   //   }

//   } else if (action === 'split_custom') {
//     bot.sendMessage(chatId, '🔢 Please enter page numbers to split after (comma-separated).\n\nExample: `2,4` will split after page 2 and 4.', {
//       parse_mode: 'Markdown'
//     });

//     bot.once('message', async (msg) => {
//       const input = msg.text;
//       const pageNumbers = input
//         .split(',')
//         .map(p => parseInt(p.trim()))
//         .filter(p => !isNaN(p) && p > 0);

//       if (pageNumbers.length === 0) {
//         return bot.sendMessage(chatId, '❌ Invalid input. Please enter valid page numbers like: 2,4');
//       }

//       try {
//         const fileId = userFiles.get(chatId)?.slice(-1)[0];
//         const fileInfo = await bot.getFile(fileId);
//         const fileUrl = `https://api.telegram.org/file/bot${token}/${fileInfo.file_path}`;
//         const res = await axios.get(fileUrl, { responseType: 'arraybuffer' });
//         const pdfBuffer = Buffer.from(res.data);

//         const splitFiles = await splitPdf(pdfBuffer, uploadsDir, pageNumbers);

//         for (const filePath of splitFiles) {
//           await bot.sendDocument(chatId, filePath);
//           await fs.unlink(filePath);
//         }

//         bot.sendMessage(chatId, '✅ Custom split completed!');
//       } catch (err) {
//         console.error(err);
//         bot.sendMessage(chatId, '❌ Failed to split with custom pages.');
//       }
//     });

//   } else if (action === 'extract') {
//     const fileId = fileIds[fileIds.length - 1];
//     try {
//       bot.sendMessage(chatId, '🔍 Extracting text from your PDF...');

//       const fileInfo = await bot.getFile(fileId);
//       const fileUrl = `https://api.telegram.org/file/bot${token}/${fileInfo.file_path}`;
//       const res = await axios.get(fileUrl, { responseType: 'arraybuffer' });

//       const pdfBuffer = Buffer.from(res.data);
//       const uint8Array = new Uint8Array(pdfBuffer); // for pdfjs compatibility

//       const extractedText = (await extractTextFromPdf(uint8Array)).trim();

//       if (!extractedText) {
//         return bot.sendMessage(chatId, "⚠️ No text found in the PDF.");
//       }

//       if (extractedText.length < 4000) {
//         await bot.sendMessage(chatId, `📝 Extracted Text:\n\n${extractedText}`);
//       } else {
//         const textPath = path.join(uploadsDir, `text-${Date.now()}.txt`);
//         await fs.writeFile(textPath, extractedText);
//         await bot.sendDocument(chatId, textPath);
//         await fs.unlink(textPath);
//       }

//       bot.answerCallbackQuery(query.id, { text: "✅ Text extracted!" });
//     } catch (err) {
//       console.error("❌ Text extraction error:", err);
//       bot.sendMessage(chatId, "❌ Failed to extract text.");
//     }

//   } else if (action === 'merge') {
//     try {
//       bot.sendMessage(chatId, '📎 Merging your PDFs...');

//       const buffers = [];
//       for (const fileId of fileIds) {
//         const fileInfo = await bot.getFile(fileId);
//         const fileUrl = `https://api.telegram.org/file/bot${token}/${fileInfo.file_path}`;
//         const res = await axios.get(fileUrl, { responseType: 'arraybuffer' });
//         buffers.push(Buffer.from(res.data));
//       }

//       const mergedPath = path.join(uploadsDir, 'merged.pdf');
//       await mergePdfs(buffers, mergedPath);

//       await bot.sendDocument(chatId, mergedPath);
//       await fs.unlink(mergedPath);

//       userFiles.set(chatId, []);
//       bot.answerCallbackQuery(query.id, { text: "✅ Merge complete!" });
//     } catch (err) {
//       console.error(err);
//       bot.sendMessage(chatId, "❌ Failed to merge PDFs.");
//     }
//   }
// });

// // ✅ Set webhook
// export const setWebhook = () => {
//   const url = `${process.env.RENDER_URL}/bot${token}`;
//   bot.setWebHook(url);
//   console.log(`🔗 Webhook set to: ${url}`);
// };














// bot/bot.js
import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

import { splitPdf } from '../utils/splitPdf.js';
import { mergePdfs } from '../utils/mergePdf.js';
import { extractTextFromPdf } from '../utils/extractTextFromPdf.js';
import sendDonationMessage from '../utils/donation.js';

dotenv.config();


const bot = new Telegraf(process.env.BOT_TOKEN, {
  telegram: { webhookReply: true },
});

// — Local state
const userFiles = new Map();
const userProcessing = new Map();

const uploadsDir = './uploads';
if (!existsSync(uploadsDir)) mkdirSync(uploadsDir);

// — /start
bot.start((ctx) => {
  const chatId = ctx.chat.id;
  const name = ctx.from.first_name;
  userFiles.set(chatId, []);
  userProcessing.set(chatId, false);

  const msg = `
👋 Hello *${name}*!

📄 Send me PDF files, then choose:
🧩 Auto Split  
✂️ Custom Split  
📎 Merge  
🗒️ Extract Text  

Upload a PDF to begin!
  `;
  ctx.reply(msg.trim(), { parse_mode: 'Markdown' });
});

// — PDF Upload Handler
bot.on('document', async (ctx) => {
  const chatId = ctx.chat.id;
  const file = ctx.message.document;

  if (file.mime_type !== 'application/pdf') {
    return ctx.reply('❌ Only PDF files are allowed.');
  }

  if (!userFiles.has(chatId)) userFiles.set(chatId, []);
  userFiles.get(chatId).push(file.file_id);

  await ctx.reply(`✅ Added: *${file.file_name}*`, { parse_mode: 'Markdown' });

  await ctx.reply('Choose an action:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🧩 Auto Split PDF', callback_data: 'split_auto' }],
        [{ text: '✂️ Custom Split PDF', callback_data: 'split_custom' }],
        [{ text: '📎 Merge PDFs', callback_data: 'merge' }],
        [{ text: '📝 Extract Text', callback_data: 'extract' }],
      ],
    },
  });
});

// — Callback Queries
bot.on('callback_query', async (ctx) => {
  const action = ctx.callbackQuery.data;
  const chatId = ctx.chat.id;
  const fileIds = userFiles.get(chatId) || [];

  if (action === 'cancel_split') {
    userProcessing.set(chatId, false);
    return ctx.answerCbQuery('❌ Cancelled.');
  }

  if (fileIds.length === 0) {
    return ctx.reply('⚠️ Please upload at least one PDF first.');
  }

  if (action === 'split_auto') {
    if (userProcessing.get(chatId)) {
      return ctx.reply('⏳ Already splitting! Use cancel if needed.');
    }
    userProcessing.set(chatId, true);

    await ctx.reply('🔧 Starting auto split...', {
      reply_markup: {
        inline_keyboard: [[{ text: '❌ Cancel Split', callback_data: 'cancel_split' }]],
      },
    });

    try {
      const fileId = fileIds.at(-1);
      const link = await ctx.telegram.getFileLink(fileId);
      const res = await axios.get(link.href, { responseType: 'arraybuffer' });

      const parts = await splitPdf(Buffer.from(res.data), uploadsDir);
      for (const p of parts) {
        if (!userProcessing.get(chatId)) break;
        await ctx.replyWithDocument({ source: p });
        await fs.unlink(p);
      }

      if (userProcessing.get(chatId)) {
        ctx.reply('✅ Auto split completed!');
        sendDonationMessage(bot.telegram, chatId);
      }
    } catch (err) {
      console.error(err);
      ctx.reply('❌ Auto split failed.');
    } finally {
      userProcessing.set(chatId, false);
      ctx.answerCbQuery();
    }
  }

  else if (action === 'split_custom') {
    ctx.reply(
      '🔢 Enter page number to split PDF after.\n\nExample: `3` = 1–3 and 4–end',
      { parse_mode: 'Markdown' }
    );

    bot.once('text', async (msgCtx) => {
      const pageNum = parseInt(msgCtx.message.text);
      if (isNaN(pageNum) || pageNum <= 0) {
        return msgCtx.reply('❌ Invalid page number.');
      }

      msgCtx.reply('⏳ Splitting...');
      try {
        const fileId = fileIds.at(-1);
        const link = await ctx.telegram.getFileLink(fileId);
        const res = await axios.get(link.href, { responseType: 'arraybuffer' });

        const parts = await splitPdf(Buffer.from(res.data), uploadsDir, [pageNum]);
        for (const p of parts) {
          await msgCtx.replyWithDocument({ source: p });
          await fs.unlink(p);
        }

        msgCtx.reply('✅ Custom split completed!');
        sendDonationMessage(bot.telegram, chatId);
      } catch (err) {
        console.error(err);
        msgCtx.reply('❌ Custom split failed.');
      }
    });

    ctx.answerCbQuery();
  }

  else if (action === 'merge') {
    ctx.reply('📎 Merging PDFs...');
    try {
      const buffers = [];

      for (const fileId of fileIds) {
        const link = await ctx.telegram.getFileLink(fileId);
        const res = await axios.get(link.href, { responseType: 'arraybuffer' });
        buffers.push(Buffer.from(res.data));
      }

      const outPath = path.join(uploadsDir, `merged-${Date.now()}.pdf`);
      await mergePdfs(buffers, outPath);

      await ctx.replyWithDocument({ source: outPath });
      await fs.unlink(outPath);
      userFiles.set(chatId, []);
    } catch (err) {
      console.error(err);
      ctx.reply('❌ Merge failed.');
    }
    ctx.answerCbQuery();
  }

  else if (action === 'extract') {
    ctx.reply('📝 Extracting text...');
    try {
      const fileId = fileIds.at(-1);
      const link = await ctx.telegram.getFileLink(fileId);
      const res = await axios.get(link.href, { responseType: 'arraybuffer' });

      const text = (await extractTextFromPdf(new Uint8Array(res.data))).trim();

      if (!text) return ctx.reply('⚠️ No text found.');
      if (text.length < 4000) {
        ctx.reply(`📝 Text:\n\n${text}`);
      } else {
        const filePath = path.join(uploadsDir, `text-${Date.now()}.txt`);
        await fs.writeFile(filePath, text);
        await ctx.replyWithDocument({ source: filePath });
        await fs.unlink(filePath);
      }

      sendDonationMessage(bot.telegram, chatId);
    } catch (err) {
      console.error(err);
      ctx.reply('❌ Text extraction failed.');
    }
    ctx.answerCbQuery();
  }
});

// — Start webhook
export const setWebhook = async () => {
  const url = `${process.env.RENDER_URL}/bot${process.env.BOT_TOKEN}`;
  await bot.telegram.setWebhook(url);
  console.log(`🔗 Webhook set to: ${url}`);
};

export default bot;


