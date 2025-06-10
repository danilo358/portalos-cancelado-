const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // ou SMTP do seu servidor
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

exports.sendOSMail = async (os) => {
  const cliente = os.cliente_id?.nome || 'Cliente'
  const tecnico = os.tecnico_id?.nome || 'Técnico'
  const modelo = os.modelo_id?.nome || 'Modelo'

  const camposHTML = os.campos_preenchidos.map(c => `<li><strong>${c.campo}</strong>: ${c.valor}</li>`).join('')
  const anexosLinks = os.anexos.map((a, i) =>
    `<li><a href="http://localhost:5050/uploads/${a}" target="_blank">Anexo ${i + 1}</a></li>`).join('')

  const html = `
    <h2>Ordem de Serviço Finalizada</h2>
    <p><strong>Modelo:</strong> ${modelo}</p>
    <p><strong>Cliente:</strong> ${cliente}</p>
    <p><strong>Técnico:</strong> ${tecnico}</p>
    <h3>Campos preenchidos:</h3>
    <ul>${camposHTML}</ul>
    <h3>Anexos:</h3>
    <ul>${anexosLinks}</ul>
    <p>Finalizada em: ${new Date(os.finalizada_em).toLocaleString()}</p>
  `

  await transporter.sendMail({
    from: `"Portal OS" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_DESTINO || os.cliente_id?.email,
    subject: `OS Finalizada - ${modelo}`,
    html
  })
}
