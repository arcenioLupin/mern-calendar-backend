const express = require("express");
const cors = require('cors');
const { dbConnection } = require("./database/config");
require("dotenv").config();

// Crear el servidor de express

const app = express();

// Base de datos

dbConnection();

// Cors
app.use(cors());
// Directorio público
app.use(express.static("public"));

// Lectura y parseo del body
app.use(express.json());

// Rutas
app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));

// Escuchar peticiones
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Servidor Express corriendo en el puerto ${port}`);
});
