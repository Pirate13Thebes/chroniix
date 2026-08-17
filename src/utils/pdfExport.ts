import { jsPDF } from 'jspdf';

export interface PdfExportOptions {
  companyName?: string;
  companyLogoUrl?: string;
}

export function downloadPdf(
  filename: string,
  title: string,
  rows: Array<Record<string, string | number>>,
  options?: PdfExportOptions
) {
  const doc = new jsPDF();
  const marginX = 14;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const compName = options?.companyName || 'CX SOLUTIONS LTD';

  // 1. Top Decorative Diagonal Header Bar (Navy + Amber accent)
  // Left Navy block
  doc.setFillColor(12, 28, 44); // Chronix Dark Navy
  doc.triangle(0, 0, 145, 0, 130, 14, 'F');
  doc.rect(0, 0, 130, 14, 'F');

  // Right Amber accent block
  doc.setFillColor(243, 174, 44); // Chronix Amber
  doc.triangle(130, 0, pageWidth, 0, pageWidth, 14, 'F');
  doc.rect(130, 0, pageWidth - 130, 14, 'F');

  let y = 28;

  // 2. Customer Brand Logo & Name Header
  // Logo Icon (Stylized CX Logo matching Page 4)
  doc.setFillColor(12, 28, 44);
  doc.rect(marginX, y, 22, 22, 'F');
  doc.setFillColor(243, 174, 44);
  doc.triangle(marginX + 12, y + 4, marginX + 20, y + 4, marginX + 16, y + 18, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(12, 28, 44);
  doc.text(compName.toUpperCase(), marginX + 28, y + 16);

  y += 32;

  // Horizontal divider
  doc.setDrawColor(243, 174, 44);
  doc.setLineWidth(1.5);
  doc.line(marginX, y, marginX + 35, y);

  y += 8;

  // 3. Document Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(12, 28, 44);
  doc.text(title.includes('(') ? title.split('(')[0].trim() : title, marginX, y);

  y += 8;

  // 4. Metadata Block
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  
  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });

  doc.text(`🏢 Company Name: `, marginX, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(compName, marginX + 32, y);

  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`📅 Report Generation Date: `, marginX, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(formattedDate, marginX + 44, y);

  y += 12;

  if (rows.length === 0) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text('No attendance or payroll records found in the selected date range.', marginX, y);
    doc.save(filename);
    return;
  }

  // 5. Table Setup & Headers
  const headers = Object.keys(rows[0]);
  const numCols = headers.length;
  const tableWidth = pageWidth - marginX * 2;
  const colWidth = tableWidth / numCols;
  const rowHeight = 10;

  // Draw Table Header Bar
  doc.setFillColor(241, 245, 249); // Light slate header background matching Page 4
  doc.rect(marginX, y, tableWidth, rowHeight, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  headers.forEach((h, i) => {
    const align =
      h.toLowerCase().includes('rate') ||
      h.toLowerCase().includes('pay') ||
      h.toLowerCase().includes('total') ||
      h.toLowerCase().includes('hours')
        ? 'right'
        : 'left';
    const xPos = align === 'right' ? marginX + (i + 1) * colWidth - 4 : marginX + i * colWidth + 4;
    doc.text(String(h), xPos, y + 6.5, { align: align as 'left' | 'right' });
  });

  y += rowHeight;

  // Header bottom border
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(marginX, y, marginX + tableWidth, y);

  // 6. Rows Iteration
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);

  let grandTotalPayout = 0;

  rows.forEach((row, rowIndex) => {
    // Check page height limit
    if (y > pageHeight - 35) {
      doc.addPage();
      y = 20;

      // Re-draw header on new page
      doc.setFillColor(241, 245, 249);
      doc.rect(marginX, y, tableWidth, rowHeight, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      headers.forEach((h, i) => {
        const align =
          h.toLowerCase().includes('rate') ||
          h.toLowerCase().includes('pay') ||
          h.toLowerCase().includes('total') ||
          h.toLowerCase().includes('hours')
            ? 'right'
            : 'left';
        const xPos = align === 'right' ? marginX + (i + 1) * colWidth - 4 : marginX + i * colWidth + 4;
        doc.text(String(h), xPos, y + 6.5, { align: align as 'left' | 'right' });
      });
      y += rowHeight;
      doc.line(marginX, y, marginX + tableWidth, y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
    }

    // Row alternating background
    if (rowIndex % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(marginX, y, tableWidth, rowHeight, 'F');
    }

    headers.forEach((h, i) => {
      const rawVal = String(row[h] ?? '-');
      const align =
        h.toLowerCase().includes('rate') ||
        h.toLowerCase().includes('pay') ||
        h.toLowerCase().includes('total') ||
        h.toLowerCase().includes('hours')
          ? 'right'
          : 'left';
      const xPos = align === 'right' ? marginX + (i + 1) * colWidth - 4 : marginX + i * colWidth + 4;

      // Calculate grand total if payout column
      if (h.toLowerCase().includes('total') || h.toLowerCase().includes('pay')) {
        const numVal = Number(rawVal.replace(/[^\d.]/g, ''));
        if (!isNaN(numVal) && numVal > 0) {
          grandTotalPayout += numVal;
        }
      }

      // Format currency values
      let displayVal = rawVal;
      if (
        (h.toLowerCase().includes('rate') || h.toLowerCase().includes('pay') || h.toLowerCase().includes('total')) &&
        !isNaN(Number(rawVal.replace(/[^\d.]/g, '')))
      ) {
        const numVal = Number(rawVal.replace(/[^\d.]/g, ''));
        displayVal = `${numVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }

      doc.text(displayVal.length > 22 ? `${displayVal.slice(0, 20)}...` : displayVal, xPos, y + 6.5, {
        align: align as 'left' | 'right',
      });
    });

    y += rowHeight;
    doc.setDrawColor(241, 245, 249);
    doc.line(marginX, y, marginX + tableWidth, y);
  });

  y += 4;

  // 7. Grand Total Payout Banner (Matching Page 4 PDF design)
  if (y < pageHeight - 35) {
    const bannerHeight = 14;
    doc.setFillColor(241, 245, 249); // Light slate bar
    doc.rect(marginX, y, tableWidth, bannerHeight, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42); // Dark slate
    doc.text('Grand Total Payout:', marginX + 10, y + 9.5);

    const formattedGrandTotal = `MUR ${grandTotalPayout.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
    doc.text(formattedGrandTotal, marginX + tableWidth - 10, y + 9.5, { align: 'right' });

    y += bannerHeight + 15;
  }

  // 8. Footer (Matching Page 4 PDF layout)
  const footerY = pageHeight - 12;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Generated dynamically by Chronix Pro Workforce System.', marginX, footerY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Powered by ', pageWidth - marginX - 34, footerY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(12, 28, 44);
  doc.text('Chronix', pageWidth - marginX - 18, footerY);

  doc.save(filename);
}
