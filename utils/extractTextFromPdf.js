
// // utils/extractTextFromPdf.js
// import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
// import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

// // This line is important for Node.js: tell pdfjs how to fetch files
// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
// pdfjsLib.GlobalWorkerOptions.workerSrc = require.resolve('pdfjs-dist/legacy/build/pdf.worker.mjs');



// export async function extractTextFromPdf(pdfBuffer) {
//   const loadingTask = getDocument({ data: pdfBuffer });
//   const pdf = await loadingTask.promise;

//   let fullText = '';
//   console.log(`📄 PDF has ${pdf.numPages} pages`);

//   for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
//     const page = await pdf.getPage(pageNum);
//     const content = await page.getTextContent();
//     const strings = content.items.map(item => item.str);
    
//     console.log(`🔹 Page ${pageNum} content:`, strings); // 🪵 DEBUG LOG

//     fullText += strings.join(' ') + '\n\n';
//   }

//   console.log("✅ Final extracted text length:", fullText.length);
//   return fullText.trim();
// }




// // utils/extractTextFromPdf.js

// import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf.mjs';
// import { createRequire } from 'module';

// const require = createRequire(import.meta.url);
// GlobalWorkerOptions.workerSrc = require.resolve('pdfjs-dist/legacy/build/pdf.worker.mjs');

// export async function extractTextFromPdf(pdfBuffer) {
//   const loadingTask = getDocument({ data: pdfBuffer });
//   const pdf = await loadingTask.promise;

//   let fullText = '';
//   console.log(`📄 PDF has ${pdf.numPages} pages`);

//   for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
//     const page = await pdf.getPage(pageNum);
//     const content = await page.getTextContent();
//     const strings = content.items.map(item => item.str);

//     console.log(`🔹 Page ${pageNum} content:`, strings); // debug

//     fullText += strings.join(' ') + '\n\n';
//   }

//   console.log("✅ Final extracted text length:", fullText.length);
//   return fullText.trim();
// }










// utils/extractTextFromPdf.js

import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
GlobalWorkerOptions.workerSrc = require.resolve('pdfjs-dist/legacy/build/pdf.worker.mjs');

export async function extractTextFromPdf(pdfBuffer) {
  const loadingTask = getDocument({ data: pdfBuffer });
  const pdf = await loadingTask.promise;

  let fullText = '';
  console.log(`📄 PDF has ${pdf.numPages} pages`);

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);

    console.log(`🔹 Page ${pageNum} content:`, strings);

    fullText += strings.join(' ') + '\n\n';
  }

  console.log("✅ Final extracted text length:", fullText.length);
  return fullText.trim();
}
