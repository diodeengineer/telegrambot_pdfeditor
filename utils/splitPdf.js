// import fs from 'fs';
// import path from 'path';
// import { PDFDocument } from 'pdf-lib';

// /**
//  * Splits a PDF buffer into individual page PDFs
//  * @param {Buffer} buffer - The PDF file buffer
//  * @param {string} outputDir - Directory to save split pages
//  * @returns {Promise<string[]>} - Array of saved file paths
//  */
// export const splitPdf = async (buffer, outputDir) => {
//   const originalPdf = await PDFDocument.load(buffer);
//   const totalPages = originalPdf.getPageCount();

//   const filePaths = [];

//   for (let i = 0; i < totalPages; i++) {
//     const newPdf = await PDFDocument.create();
//     const [page] = await newPdf.copyPages(originalPdf, [i]);
//     newPdf.addPage(page);

//     const pdfBytes = await newPdf.save();
//     const fileName = `page_${i + 1}.pdf`;
//     const filePath = path.join(outputDir, fileName);
//     fs.writeFileSync(filePath, pdfBytes);
//     filePaths.push(filePath);
//   }

//   return filePaths;
// };




// utils/splitPdf.js
import { PDFDocument } from 'pdf-lib';
import path from 'path';
import fs from 'fs/promises';

export async function splitPdf(pdfBuffer, outputDir, splitPoints = []) {
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const totalPages = pdfDoc.getPageCount();
  const outputPaths = [];

  // If no split point provided → return individual pages (auto split)
  if (!splitPoints || splitPoints.length === 0) {
    for (let i = 0; i < totalPages; i++) {
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(copiedPage);

      const pdfBytes = await newPdf.save();
      const filePath = path.join(outputDir, `page-${i + 1}.pdf`);
      await fs.writeFile(filePath, pdfBytes);
      outputPaths.push(filePath);
    }
  } else {
    // For splitting into exactly 2 parts at given page number
    const splitPage = splitPoints[0];

    // Part 1: from page 0 to splitPage-1
    const part1 = await PDFDocument.create();
    const part1Pages = await part1.copyPages(pdfDoc, [...Array(splitPage).keys()]);
    part1Pages.forEach((p) => part1.addPage(p));
    const part1Bytes = await part1.save();
    const part1Path = path.join(outputDir, `part-1.pdf`);
    await fs.writeFile(part1Path, part1Bytes);
    outputPaths.push(part1Path);

    // Part 2: from splitPage to end
    const part2 = await PDFDocument.create();
    const part2Pages = await part2.copyPages(pdfDoc, [...Array(totalPages - splitPage).keys()].map(i => i + splitPage));
    part2Pages.forEach((p) => part2.addPage(p));
    const part2Bytes = await part2.save();
    const part2Path = path.join(outputDir, `part-2.pdf`);
    await fs.writeFile(part2Path, part2Bytes);
    outputPaths.push(part2Path);
  }

  return outputPaths;
}







