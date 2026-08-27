import PDFDocument from 'pdfkit-table';
import path from 'path';
import fs from 'fs';

export async function generateInvoicePdf(invoice: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        try {
            // A4 is 595.28 x 841.89. Reduce margins to maximize usable area and prevent auto page breaks
            const doc = new PDFDocument({ 
                margins: { top: 40, left: 40, right: 40, bottom: 30 }, 
                size: 'A4', 
                autoFirstPage: true 
            });
            const buffers: Buffer[] = [];
            
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);
            
            // Register Fonts (Fallback to Helvetica if TTF files aren't found)
            const regularFontPath = path.join(process.cwd(), 'public', 'Roboto-Regular.ttf');
            const boldFontPath = path.join(process.cwd(), 'public', 'Roboto-Bold.ttf');
            
            let fontRegular = 'Helvetica';
            let fontBold = 'Helvetica-Bold';
            
            if (fs.existsSync(regularFontPath) && fs.existsSync(boldFontPath)) {
                doc.registerFont('Roboto-Regular', regularFontPath);
                doc.registerFont('Roboto-Bold', boldFontPath);
                fontRegular = 'Roboto-Regular';
                fontBold = 'Roboto-Bold';
            }

            const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            const brandColor = '#1a365d'; // Dark blue accent
            const textColor = '#111827'; // Dark gray
            const mutedColor = '#6b7280';
            const lightBorder = '#e5e7eb';

            // ==========================================
            // 1. HEADER (TWO COLUMNS)
            // ==========================================
            const headerY = 40;
            
            // --- LEFT COLUMN (Logo & Company) ---
            const logoPath = path.join(process.cwd(), 'public', 'logo-full.png');
            let companyStartY = headerY;
            if (fs.existsSync(logoPath)) {
                doc.image(logoPath, 40, headerY, { width: 120 });
                companyStartY = headerY + 40 + 15; // proper breathing room
            } else {
                doc.font(fontBold).fontSize(16).fillColor(brandColor).text('BUZZSPIRE MEDIA', 40, headerY);
                companyStartY = headerY + 15 + 15;
            }

            doc.fillColor(textColor);
            doc.font(fontBold).fontSize(11).text('BuzzSpire Media Pvt. Ltd.', 40, companyStartY);
            doc.font(fontRegular).fontSize(9).fillColor(mutedColor).text('Ground Floor, Ram Dutt Enclave, B-16, Block D,', 40, companyStartY + 14);
            doc.text('Ram Dutt Enclave, Uttam Nagar, New Delhi, Delhi, 110059', 40, companyStartY + 24);
            doc.text('sales@buzzspiremedia.com | buzzspiremedia.com', 40, companyStartY + 34);

            // --- RIGHT COLUMN (Invoice Meta) ---
            const rightColumnX = 360;
            doc.font(fontBold).fontSize(18).fillColor(brandColor).text('INVOICE', rightColumnX, headerY, { align: 'right', width: 195 });
            doc.font(fontRegular).fontSize(9).fillColor(mutedColor).text('PAYMENT RECEIPT', rightColumnX, headerY + 20, { align: 'right', width: 195 });
            
            const metaStartY = headerY + 45;
            const metaValueX = 460;
            
            doc.fillColor(textColor);
            doc.font(fontBold).fontSize(9).text('Invoice No:', rightColumnX, metaStartY);
            doc.font(fontRegular).text(invoice.invoiceNumber || invoice.id.split('-')[0].toUpperCase(), metaValueX, metaStartY, { align: 'right', width: 95 });

            doc.font(fontBold).text('Invoice Date:', rightColumnX, metaStartY + 14);
            doc.font(fontRegular).text(new Date(invoice.createdAt).toLocaleDateString(), metaValueX, metaStartY + 14, { align: 'right', width: 95 });

            doc.font(fontBold).text('Status:', rightColumnX, metaStartY + 28);
            doc.font(fontBold)
               .fillColor(invoice.status === 'PAID' ? '#16a34a' : '#ea580c')
               .text(invoice.status, metaValueX, metaStartY + 28, { align: 'right', width: 95 });
            
            doc.fillColor(textColor); // Reset color

            // Divider
            const dividerY = Math.max(companyStartY + 50, metaStartY + 45);
            doc.moveTo(40, dividerY).lineTo(555, dividerY).lineWidth(0.5).stroke(lightBorder);

            // ==========================================
            // 2. BILL TO & SERVICE (TWO COLUMNS)
            // ==========================================
            const sectionY = dividerY + 15;

            // --- LEFT: BILL TO ---
            doc.font(fontBold).fontSize(10).fillColor(brandColor).text('BILL TO', 40, sectionY);
            doc.fillColor(textColor);
            doc.font(fontBold).fontSize(10).text(invoice.client.name || 'Client Name', 40, sectionY + 14);
            
            let currentClientY = sectionY + 26;
            if (invoice.client.company) {
                doc.font(fontRegular).fontSize(9).text(invoice.client.company, 40, currentClientY);
                currentClientY += 12;
            }
            doc.font(fontRegular).fontSize(9).fillColor(mutedColor).text(invoice.client.email || '', 40, currentClientY);

            // --- RIGHT: SERVICE ---
            doc.font(fontBold).fontSize(10).fillColor(brandColor).text('SERVICE', rightColumnX, sectionY);
            doc.fillColor(textColor);
            doc.font(fontBold).fontSize(10).text(invoice.service || 'General Services', rightColumnX, sectionY + 14, { width: 195 });

            // ==========================================
            // 3. SERVICE TABLE (FULL WIDTH)
            // ==========================================
            const tableY = Math.max(currentClientY + 20, sectionY + 35);
            doc.x = 40; // CRITICAL FIX: Reset X to left margin so the table spans full width!
            doc.y = tableY;

            const table = {
                headers: ['DESCRIPTION', 'AMOUNT'],
                rows: [
                    [invoice.description || 'Services Rendered', formatCurrency(invoice.amount)]
                ],
            };
            
            doc.table(table, {
                prepareHeader: () => doc.font(fontBold).fontSize(9).fillColor(textColor),
                prepareRow: () => doc.font(fontRegular).fontSize(9).fillColor(textColor),
                width: 515, // 595.28 - 40 - 40
                padding: 5,
            });

            // ==========================================
            // 4. TOTALS (RIGHT ALIGNED BOX)
            // ==========================================
            const totalsY = doc.y + 10;
            const totalsLabelX = 360;
            const totalsValueX = 460;
            
            doc.font(fontRegular).fontSize(9);
            
            let currentTotalY = totalsY;
            if (invoice.subtotal) {
                doc.text('Subtotal', totalsLabelX, currentTotalY);
                doc.text(formatCurrency(invoice.subtotal), totalsValueX, currentTotalY, { align: 'right', width: 95 });
                currentTotalY += 14;
            }
            if (invoice.tax) {
                doc.text('Tax', totalsLabelX, currentTotalY);
                doc.text(formatCurrency(invoice.tax), totalsValueX, currentTotalY, { align: 'right', width: 95 });
                currentTotalY += 14;
            }
            if (invoice.discount) {
                doc.text('Discount', totalsLabelX, currentTotalY);
                doc.text(formatCurrency(invoice.discount), totalsValueX, currentTotalY, { align: 'right', width: 95 });
                currentTotalY += 14;
            }
            
            // Totals Divider
            currentTotalY += 5;
            doc.moveTo(totalsLabelX, currentTotalY).lineTo(555, currentTotalY).lineWidth(0.5).stroke(lightBorder);
            
            // Total Amount
            currentTotalY += 10;
            doc.font(fontBold).fontSize(11).fillColor(brandColor).text('TOTAL AMOUNT', totalsLabelX, currentTotalY);
            doc.text(formatCurrency(invoice.amount), totalsValueX, currentTotalY, { align: 'right', width: 95 });
            
            // ==========================================
            // 5. PAYMENT DETAILS & NOTES (SIDE-BY-SIDE)
            // ==========================================
            const payment = invoice.payments?.[0];
            const detailsY = Math.max(currentTotalY + 30, totalsY + 30);
            
            // Divider above details
            doc.moveTo(40, detailsY - 10).lineTo(555, detailsY - 10).lineWidth(0.5).stroke(lightBorder);

            // Left: PAYMENT DETAILS
            doc.font(fontBold).fontSize(10).fillColor(brandColor).text('PAYMENT DETAILS', 40, detailsY);
            doc.fillColor(textColor);
            
            let py = detailsY + 15;
            if (payment) {
                doc.font(fontBold).fontSize(9).text('Method: ', 40, py, { continued: true }).font(fontRegular).text(payment.method || '-');
                py += 14;
                doc.font(fontBold).text('Transaction ID: ', 40, py, { continued: true }).font(fontRegular).text(payment.transactionId || '-');
                py += 14;
                doc.font(fontBold).text('Payment Date: ', 40, py, { continued: true }).font(fontRegular).text(payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : '-');
                py += 14;
                doc.font(fontBold).text('Payment Status: ', 40, py, { continued: true }).font(fontRegular).text(payment.status || '-');
            } else {
                doc.font(fontRegular).fontSize(9).text('No payment details recorded.', 40, py);
            }

            // Right: NOTES
            if (invoice.notes) {
                doc.font(fontBold).fontSize(10).fillColor(brandColor).text('NOTES', 300, detailsY);
                doc.fillColor(textColor);
                // constrain notes height to prevent page break overflow
                doc.font(fontRegular).fontSize(9).text(invoice.notes, 300, detailsY + 15, { width: 255, height: 60, ellipsis: true });
            }
            
            // ==========================================
            // 6. FOOTER (ABSOLUTE POSITION AT BOTTOM)
            // ==========================================
            const footerY = doc.page.height - 50; // Closer to bottom margin
            doc.moveTo(40, footerY - 10).lineTo(555, footerY - 10).lineWidth(0.5).stroke(lightBorder);
            doc.font(fontBold).fontSize(9).fillColor(brandColor).text('Thank you for your business!', 40, footerY, { align: 'center', width: 515 });
            doc.font(fontRegular).fontSize(8).fillColor(mutedColor).text('BuzzSpire Media Pvt. Ltd.', 40, footerY + 12, { align: 'center', width: 515 });
            
            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}
