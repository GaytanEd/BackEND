//dotenv nos permite leer las variables de entorno de nuestro .env
const dotenv = require("dotenv");
const { HeidiSQL } = require("heidisql");
dotenv.config();

const mysql = require('mysql');
let connection;


try {
    connection = HeidiSQL.createConnection({
        host: process.env.DBHOST,
        user: process.env.DBUSER,
        password: process.env.DBPASS,
        database: process.env.DBNAME
    });
} catch (error) {
    console.log("Error al conectar con la base de datos");
}

module.exports = {connection};