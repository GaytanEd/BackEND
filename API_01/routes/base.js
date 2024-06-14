const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

//conexión con la base de datos
const {connection} = require("../config.db");

const getUsuarios = (request, response) => {
    connection.query("SELECT * FROM usuarios", 
    (error, results) => {
        if(error)
            throw error;
        response.status(200).json(results);
    });
};

//ruta
app.route("/usuarios")
.get(getUsuarios);


const postUsuarios= (request, response) => {
    const {ID_usuario, Nombre, Apellido, Edad, Correo, Boleta, Especialidad, Contraseña, Fecha_Creacion, Fecha_Modificación} = request.body;
    connection.query("INSERT INTO usuarios(ID_usuario, Nombre, Apellido, Edad, Correo, Boleta, Especialidad, Contraseña, Fecha_Creacion, Fecha_Modificación) VALUES (?,?,?,?,?,?,?,?,?,?) ", 
    [ID_usuario, Nombre, Apellido, Edad, Correo, Boleta, Especialidad, Contraseña, Fecha_Creacion, Fecha_Modificación],
    (error, results) => {
        if(error)
            throw error;
        response.status(201).json({"Items añadido correctamente": results.affectedRows});
    });
};

//ruta 
app.route("/usuarios")
.post(postUsuarios);


const delUsuarios = (request, response) => {
    const id = request.params.id;
    connection.query("Delete from usuarios where id = ?", 
    [id],
    (error, results) => {
        if(error)
            throw error;
        response.status(201).json({"Item eliminado":results.affectedRows});
    });
};

//ruta
app.route("/usuarios/:id")
.delete(delUsuarios);
module.exports = app;
