// // Cargamos el módulo HTTP
// var http = require("http");

// // Creamos el servidor HTTP, y configuramos la escucha
// // de peticiones en el puerto 3000 (por ejemplo)
// http.createServer(function(request, response) {

//     // Definimos la cabecera HTTP, con el estado HTTP (OK: 200) y el tipo de contenido
//    response.writeHead(200, {'Content-Type': 'application/json'});
   
//    // Creamos un pequeño documento JSON para la respuesta
//     let resp = {
//         name: 'Samy',
//         age: '30',
//         url: request.url
//     }
//     response.write(JSON.stringify(resp));

//    // Definimos la respuesta con el mensaje "Servidor activo en el puerto 3000"
//    response.end();
// }).listen(3000);

// // Mostramos un mensaje en la terminal mientras está en ejecución el servidor
// console.log('Servidor en la url http://127.0.0.1:3000/');



const express = require("express");
const app = express();

//nos ayuda a analizar el cuerpo de la solicitud POST
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//cargamos el archivo de rutas
app.use(require('./routes/base'));

app.listen(process.env.PORT||3306,() => {
    console.log("Servidor corriendo en el puerto 3306");
});

module.exports = app;