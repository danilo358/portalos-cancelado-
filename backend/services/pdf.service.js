const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.gerarPDFOS = async (os, callback) => {
  const doc = new PDFDocument();
  const filePath = path.join(__dirname, `../temp/OS-${os._id}.pdf`);
  const writeStream = fs.createWriteStream(filePath);

  doc.pipe(writeStream);

  doc.fontSize(20).text(`Ordem de Serviço`, { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).text(`Modelo: ${os.modelo_id?.nome}`);
  doc.text(`Cliente: ${os.cliente_id?.nome}`);
  doc.text(`Técnico: ${os.tecnico_id?.nome}`);
  doc.text(`Status: ${os.status}`);
  if (os.finalizada_em) {
    doc.text(`Finalizada em: ${new Date(os.finalizada_em).toLocaleString()}`);
  }
  doc.moveDown();

  doc.fontSize(14).text('Campos Preenchidos:', { underline: true });
  os.campos_preenchidos.forEach(c => {
    doc.fontSize(12).text(`- ${c.campo}: ${c.valor}`);
  });
  doc.moveDown();

  doc.fontSize(14).text('Itens Utilizados:', { underline: true });
  os.itens_utilizados.forEach(i => {
    doc.fontSize(12).text(`- ${i.item_id?.nome || 'Item'}: ${i.quantidade} un.`);
  });
  doc.moveDown();

  if (os.anexos?.length) {
    doc.fontSize(14).text('Anexos:', { underline: true });
    os.anexos.forEach((a, i) => {
      const link = `http://localhost:5000/uploads/${a}`;
      doc.fontSize(12).text(`Anexo ${i + 1}: ${link}`);
    });
  }

  doc.end();

  writeStream.on('finish', () => {
    callback(filePath);
  });
}
