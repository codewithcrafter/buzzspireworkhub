import PDFDocument from 'pdfkit-table';
import path from 'path';
import fs from 'fs';

export async function generatePayrollSummaryPdf(records: any[], month: number, year: number): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margins: { top: 40, left: 40, right: 40, bottom: 30 }, size: 'A4' });
            const buffers: Buffer[] = [];
            
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);

            const brandColor = '#1a365d';
            const textColor = '#111827';
            const lightBorder = '#e5e7eb';

            // Header
            doc.fontSize(16).fillColor(brandColor).text('BUZZSPIRE WORKHUB', 40, 40);
            doc.fontSize(12).fillColor(textColor).text('Payroll Summary', 40, 60);
            doc.fontSize(10).text(`Period: ${month}/${year}`, 40, 75);
            
            doc.moveTo(40, 95).lineTo(555, 95).lineWidth(0.5).stroke(lightBorder);

            const table = {
                title: "Employees",
                headers: [
                    { label: "Employee", property: 'name', width: 100 },
                    { label: "Dept", property: 'dept', width: 80 },
                    { label: "Base", property: 'base', width: 60 },
                    { label: "Gross", property: 'gross', width: 60 },
                    { label: "Ded", property: 'ded', width: 60 },
                    { label: "Net Pay", property: 'net', width: 70 }
                ],
                datas: records.map(r => {
                    const dept = r.departmentSnapshot as any;
                    return {
                        name: r.employee.fullName,
                        dept: dept?.name || "N/A",
                        base: `Rs. ${r.basePay}`,
                        gross: `Rs. ${r.grossPay}`,
                        ded: `Rs. ${r.totalDeductions}`,
                        net: `Rs. ${r.netPay}`
                    };
                })
            };

            doc.table(table, { x: 40, y: 110 });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}

export async function generateEmployeePayslipPdf(record: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margins: { top: 40, left: 40, right: 40, bottom: 30 }, size: 'A4' });
            const buffers: Buffer[] = [];
            
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);

            const brandColor = '#1a365d';
            const textColor = '#111827';
            const lightBorder = '#e5e7eb';
            
            // Header
            doc.fontSize(18).fillColor(brandColor).text('BUZZSPIRE WORKHUB', 40, 40, { align: 'center' });
            doc.fontSize(12).fillColor(textColor).text('EMPLOYEE PAYSLIP', 40, 65, { align: 'center' });

            doc.moveTo(40, 90).lineTo(555, 90).lineWidth(0.5).stroke(lightBorder);

            // Employee details
            const dept = record.departmentSnapshot as any;
            doc.fontSize(10).text(`Name: ${record.employee.fullName}`, 40, 110);
            doc.text(`ID: ${record.employee.employeeCode}`, 40, 125);
            doc.text(`Department: ${dept?.name || "Not Recorded"}`, 40, 140);
            
            doc.text(`Pay Period: ${record.payrollRun.month}/${record.payrollRun.year}`, 300, 110);
            doc.text(`Salary Type: ${record.salaryType}`, 300, 125);

            doc.moveTo(40, 160).lineTo(555, 160).lineWidth(0.5).stroke(lightBorder);

            // Earnings
            doc.fontSize(12).fillColor(brandColor).text('Earnings', 40, 180);
            doc.fontSize(10).fillColor(textColor).text(`Base Pay: Rs. ${record.basePay}`, 40, 200);
            doc.text(`Overtime Pay: Rs. ${record.overtimePay}`, 40, 215);
            doc.fontSize(11).font('Helvetica-Bold').text(`Gross Pay: Rs. ${record.grossPay}`, 40, 235);
            doc.font('Helvetica');

            // Deductions
            doc.fontSize(12).fillColor(brandColor).text('Deductions', 300, 180);
            doc.fontSize(10).fillColor(textColor);
            
            let y = 200;
            if (record.deductions && record.deductions.length > 0) {
                record.deductions.forEach((d: any) => {
                    doc.text(`${d.type} - ${d.description || ''}: Rs. ${d.amount}`, 300, y);
                    y += 15;
                });
            } else {
                doc.text('No deductions', 300, y);
                y += 15;
            }
            
            doc.fontSize(11).font('Helvetica-Bold').text(`Total Deductions: Rs. ${record.totalDeductions}`, 300, y + 5);
            doc.font('Helvetica');

            doc.moveTo(40, Math.max(250, y + 25)).lineTo(555, Math.max(250, y + 25)).lineWidth(0.5).stroke(lightBorder);

            // Net Pay
            const netY = Math.max(250, y + 25) + 20;
            doc.fontSize(14).font('Helvetica-Bold').text(`NET PAY: Rs. ${record.netPay}`, 40, netY, { align: 'right' });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}
