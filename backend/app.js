const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const uploadRoutes = require('./routes/upload.routes');
const clientRoutes = require('./routes/client.routes');
const userRoutes = require('./routes/user.routes');
const technicianRoutes = require('./routes/technician.routes');
const osModelRoutes = require('./routes/os_model.routes');
const osMainRoutes = require('./routes/os_main.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const auditRoutes = require('./routes/audit.routes');


const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/technicians', technicianRoutes);
app.use('/api/modelos-os', osModelRoutes);
app.use('/api/os', osMainRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/estoque', inventoryRoutes);
app.use('/api/auditoria', auditRoutes);

// Conectar MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB conectado');
  const PORT = process.env.PORT || 5050;
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}).catch(err => {
  console.error('Erro ao conectar MongoDB:', err);
});
