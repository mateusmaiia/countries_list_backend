require('dotenv').config();
const express = require('express');
const cors = require('cors');
const countryRoutes = require('./routes/countryRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/', countryRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
