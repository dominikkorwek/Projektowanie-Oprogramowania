import PDFDocument from 'pdfkit';

function buildCsv(payload) {
  const rows = [
    ['format', payload.format || ''],
    ['from', payload.from || ''],
    ['to', payload.to || ''],
    ['downloadPath', payload.downloadPath || ''],
    ['measurements', (payload.measurements || []).join('|')],
    ['sensors', (payload.sensors || []).join('|')],
  ];
  return rows.map((r) => r.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(',')).join('\n') + '\n';
}

export async function generateExport(payload) {
  const format = String(payload?.format || 'pdf').toLowerCase();
  if (format === 'csv') {
    const csv = buildCsv(payload || {});
    return {
      contentType: 'text/csv; charset=utf-8',
      filename: 'export.csv',
      buffer: Buffer.from(csv, 'utf8'),
    };
  }

  // PDF (default)
  const doc = new PDFDocument({ margin: 48 });
  const chunks = [];
  doc.on('data', (c) => chunks.push(c));

  doc.fontSize(18).text('MOO METER — Export', { underline: true });
  doc.moveDown();
  doc.fontSize(12).text(`Zakres: ${payload?.from || '—'} → ${payload?.to || '—'}`);
  doc.text(`Format: ${format}`);
  doc.text(`Ścieżka (info): ${payload?.downloadPath || '—'}`);
  doc.moveDown();
  doc.text(`Mierzone wielkości: ${(payload?.measurements || []).join(', ') || '—'}`);
  doc.text(`Czujniki: ${(payload?.sensors || []).join(', ') || '—'}`);
  doc.moveDown();
  doc.text(`Wygenerowano: ${new Date().toISOString()}`);

  doc.end();

  const buffer = await new Promise((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
  });

  return {
    contentType: 'application/pdf',
    filename: 'export.pdf',
    buffer,
  };
}

