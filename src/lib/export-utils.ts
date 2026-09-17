// @ts-ignore
import PDFDocument from "pdfkit";

/**
 * Escapes fields to prevent CSV Formula Injection attacks (=, +, -, @).
 */
export function escapeCsvField(val: any): string {
  if (val === null || val === undefined) return '""';
  let str = String(val).trim();

  // Remove potential formula execution triggers
  if (/^[=\+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }

  // Quote double quotes
  str = str.replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Converts array of objects to safe CSV string.
 */
export function generateCsv<T extends Record<string, any>>(
  data: T[],
  headers: { key: keyof T; label: string }[]
): string {
  const headerRow = headers.map((h) => escapeCsvField(h.label)).join(",");
  const rows = data.map((item) =>
    headers.map((h) => escapeCsvField(item[h.key])).join(",")
  );

  return "\ufeff" + [headerRow, ...rows].join("\r\n");
}


/**
 * Generates a styled PDF Buffer using pdfkit.
 */
export async function generatePdfReport(
  title: string,
  headers: string[],
  rows: string[][]
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: any) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", (err: any) => reject(err));

    // Title Header
    doc
      .fillColor("#7c3aed")
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("BUZZSPIRE WORKHUB", { align: "left" });

    doc
      .fillColor("#1f2937")
      .fontSize(14)
      .font("Helvetica-Bold")
      .text(title, { align: "left" });

    doc
      .fillColor("#6b7280")
      .fontSize(9)
      .font("Helvetica")
      .text(`Generated on: ${new Date().toLocaleString()}`, { align: "left" });

    doc.moveDown(1.5);

    // Simple Table Formatting
    const startX = 40;
    let startY = doc.y;
    const pageWidth = 515;
    const colWidth = pageWidth / Math.max(headers.length, 1);

    // Draw Header Row
    doc.rect(startX, startY, pageWidth, 22).fill("#7c3aed");
    doc.fillColor("#ffffff").fontSize(9).font("Helvetica-Bold");

    headers.forEach((h, i) => {
      doc.text(h, startX + i * colWidth + 5, startY + 6, {
        width: colWidth - 10,
        truncate: true,
      });
    });

    startY += 26;

    // Draw Rows
    doc.fillColor("#111827").font("Helvetica").fontSize(8);

    rows.forEach((row, rowIndex) => {
      if (startY > 750) {
        doc.addPage();
        startY = 40;
      }

      if (rowIndex % 2 === 1) {
        doc.rect(startX, startY - 2, pageWidth, 18).fill("#f9fafb");
      }

      doc.fillColor("#111827");
      row.forEach((cell, colIndex) => {
        doc.text(String(cell ?? ""), startX + colIndex * colWidth + 5, startY + 2, {
          width: colWidth - 10,
          truncate: true,
        });
      });

      startY += 18;
    });

    // Footer
    doc
      .fillColor("#9ca3af")
      .fontSize(8)
      .text("Confidential Operational Report — BuzzSpire WorkHub Platform", startX, 800, {
        align: "center",
      });

    doc.end();
  });
}
