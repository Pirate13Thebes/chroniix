import { jsPDF } from 'jspdf';

// Branded, structured PDF export — draws clean columns, headers, totals and alternate row backgrounds
export function downloadPdf(filename: string, title: string, rows: Array<Record<string, string | number>>) {
  const doc = new jsPDF();
  const marginX = 14;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 15;

  // Header Banner
  doc.setFillColor(12, 28, 44); // Chronix Navy
  doc.rect(0, 0, pageWidth, 35, 'F');

  // App Logo/Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(255, 210, 0); // Chronix Amber
  doc.text('Chronix', marginX, 18);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(200, 200, 200);
  doc.text('Smart Attendance & Payroll System', marginX, 24);

  // Title & Metadata
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text(title, marginX, 31);

  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  const genDate = `Generated: ${new Date().toLocaleString()}`;
  doc.text(genDate, pageWidth - marginX - doc.getTextWidth(genDate), 18);

  y = 45; // Start content below banner

  if (rows.length === 0) {
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text('No data in the selected range.', marginX, y);
    doc.save(filename);
    return;
  }

  const headers = Object.keys(rows[0]);
  const numCols = headers.length;
  const tableWidth = pageWidth - marginX * 2;
  const colWidth = tableWidth / numCols;
  const rowHeight = 9;

  // Draw table header background
  doc.setFillColor(243, 244, 246);
  doc.rect(marginX, y, tableWidth, rowHeight, 'F');
  
  // Headers text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);
  headers.forEach((h, i) => {
    const align = h.toLowerCase().includes('rate') || h.toLowerCase().includes('pay') || h.toLowerCase().includes('hours') ? 'right' : 'left';
    const xPos = align === 'right' ? marginX + (i + 1) * colWidth - 3 : marginX + i * colWidth + 3;
    doc.text(String(h), xPos, y + 6, { align: align as 'left' | 'right' });
  });

  y += rowHeight;

  // Draw lines
  doc.setDrawColor(229, 231, 235);
  doc.line(marginX, y, marginX + tableWidth, y);

  // Rows text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);

  let totalHours = 0;
  let totalPay = 0;
  let hasTotals = false;

  rows.forEach((row, rowIndex) => {
    if (y > pageHeight - 20) {
      doc.addPage();
      // Re-draw small header on new pages
      doc.setFillColor(12, 28, 44);
      doc.rect(0, 0, pageWidth, 15, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(255, 210, 0);
      doc.text('Chronix Report', marginX, 10);
      y = 25;

      // Draw table header background on new page
      doc.setFillColor(243, 244, 246);
      doc.rect(marginX, y, tableWidth, rowHeight, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(50, 50, 50);
      headers.forEach((h, i) => {
        const align = h.toLowerCase().includes('rate') || h.toLowerCase().includes('pay') || h.toLowerCase().includes('hours') ? 'right' : 'left';
        const xPos = align === 'right' ? marginX + (i + 1) * colWidth - 3 : marginX + i * colWidth + 3;
        doc.text(String(h), xPos, y + 6, { align: align as 'left' | 'right' });
      });
      y += rowHeight;
      doc.line(marginX, y, marginX + tableWidth, y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
    }

    // Zebra striping
    if (rowIndex % 2 === 1) {
      doc.setFillColor(249, 250, 251);
      doc.rect(marginX, y, tableWidth, rowHeight, 'F');
    }

    headers.forEach((h, i) => {
      const val = String(row[h] ?? '');
      const align = h.toLowerCase().includes('rate') || h.toLowerCase().includes('pay') || h.toLowerCase().includes('hours') ? 'right' : 'left';
      const xPos = align === 'right' ? marginX + (i + 1) * colWidth - 3 : marginX + i * colWidth + 3;
      
      // Calculate totals
      if (h === 'Hours Worked' || h === 'Hours' || h === 'Overtime Hours') {
        const numVal = Number(val);
        if (!isNaN(numVal)) {
          totalHours += numVal;
          hasTotals = true;
        }
      }
      if (h.toLowerCase().includes('pay') || h.toLowerCase().includes('rate')) {
        const numVal = Number(val.replace(/[^\d.]/g, ''));
        if (!isNaN(numVal) && h.toLowerCase().includes('pay')) {
          totalPay += numVal;
          hasTotals = true;
        }
      }

      // Format currency columns
      let displayVal = val;
      if (h.toLowerCase().includes('pay') || h.toLowerCase().includes('rate') || h.toLowerCase().includes('mur')) {
        const numVal = Number(val.replace(/[^\d.]/g, ''));
        if (!isNaN(numVal)) {
          displayVal = `MUR ${numVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
      }

      doc.text(displayVal.length > 25 ? `${displayVal.slice(0, 22)}...` : displayVal, xPos, y + 6, { align: align as 'left' | 'right' });
    });

    y += rowHeight;
    doc.line(marginX, y, marginX + tableWidth, y);
  });

  // Print Summary/Total row at the bottom if hasTotals
  if (hasTotals && y < pageHeight - 25) {
    y += 2;
    doc.setFillColor(243, 244, 246);
    doc.rect(marginX, y, tableWidth, rowHeight, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(12, 28, 44);

    headers.forEach((h, i) => {
      const align = h.toLowerCase().includes('rate') || h.toLowerCase().includes('pay') || h.toLowerCase().includes('hours') ? 'right' : 'left';
      const xPos = align === 'right' ? marginX + (i + 1) * colWidth - 3 : marginX + i * colWidth + 3;

      let displayVal = '';
      if (i === 0) {
        displayVal = 'TOTAL';
      } else if (h === 'Hours Worked' || h === 'Hours' || h === 'Overtime Hours') {
        displayVal = String(Math.round(totalHours * 100) / 100);
      } else if (h.toLowerCase().includes('pay')) {
        displayVal = `MUR ${totalPay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }

      doc.text(displayVal, xPos, y + 6, { align: align as 'left' | 'right' });
    });
    
    y += rowHeight;
    doc.line(marginX, y, marginX + tableWidth, y);
  }

  doc.save(filename);
}
