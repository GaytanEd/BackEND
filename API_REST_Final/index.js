const express = require("express");
const app = express();

// Nos ayuda a analizar el cuerpo de la solicitud POST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cargamos el archivo de rutas
app.use('/usuarios', require('./routes/usuarios'));
//app.use('/carta', require('./routes/carta'));

app.listen(process.env.PORT || 3300, () => {
    console.log("Servidor corriendo en el puerto 3300");
});

module.exports = app;
