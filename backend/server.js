'use strict';

require('dotenv').config();

const express = require('express');
const db = require('./models');
const { registerEndpoints } = require('./endpoints');

const app = express();

app.use(express.json());
registerEndpoints(app);

app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada.' });
});

app.use((error, req, res, next) => {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  const status = Number.isInteger(error.status) && error.status >= 400 && error.status < 500
    ? error.status
    : 500;
  const message = status < 500 ? error.message : 'Error interno del servidor.';

  return res.status(status).json({ message });
});

async function startServer() {
  await db.sequelize.authenticate();

  const port = process.env.PORT || 3000;
  return app.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}.`);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error('No se pudo iniciar el servidor Express.', error);
    process.exitCode = 1;
  });
}

module.exports = { app, startServer };
