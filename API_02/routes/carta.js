const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

//conexión con la base de datos
const {connection} = require("../config.db");


/// Metodo GET para mostrar a todos los usuarios de la base de datos
const getUsuarios = (request, response) => {
    connection.query("SELECT * FROM usuarios",
    (error, results) => {
        if(error)
            throw error;
        response.status(200).json(results);
    });
};
//ruta
app.route("/usuarios").get(getUsuarios);


// Método POST para agregar un nuevo usuario
const postUsuarios = (request, response) => {
    const { ID_usuario, Nombre, Apellido, Edad, Correo, Boleta, Especialidad, Contraseña, Fecha_Creacion, Fecha_Modificación } = request.body;
    // Validación de correo: debe contener @gmail.com
    if (!Correo.includes("@gmail.com")) {
        return response.status(400).json({ error: "El correo debe ser de formato @gmail.com" });
    }
    // Validación de boleta: debe tener 10 números
    const boletaRegex = /^\d{10}$/;
    if (!boletaRegex.test(Boleta)) {
        return response.status(400).json({ error: "La boleta debe tener exactamente 10 números" });
    }
    // Validación de contraseña: al menos una letra, un número y mínimo 8 caracteres
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(Contraseña)) {
        return response.status(400).json({ error: "La contraseña debe tener al menos una letra, un número y mínimo 8 caracteres" });
    }
    // Verificar si el correo o la boleta ya existen en la base de datos
    connection.query(
        "SELECT * FROM usuarios WHERE Correo = ? OR Boleta = ?",
        [Correo, Boleta],
        (error, results) => {
            if (error) {
                return response.status(500).json({ error: "Error al consultar la base de datos" });
            }
            if (results.length > 0) {
                // Ya existe un usuario con el mismo correo o boleta
                return response.status(409).json({ error: "El correo o la boleta ya están registrados" });
            }
            // Insertar el nuevo usuario
            connection.query(
                "INSERT INTO usuarios(ID_usuario, Nombre, Apellido, Edad, Correo, Boleta, Especialidad, Contraseña, Fecha_Creacion, Fecha_Modificación) VALUES (?,?,?,?,?,?,?,?,?,?)",
                [ID_usuario, Nombre, Apellido, Edad, Correo, Boleta, Especialidad, Contraseña, Fecha_Creacion, Fecha_Modificación],
                (error, insertResults) => {
                    if (error) {
                        return response.status(500).json({ error: "Error al insertar el usuario en la base de datos" });
                    }
                }
            );
        }
    );
};
// Ruta para agregar un nuevo usuario
app.route("/usuarios/nuevo").post(postUsuarios);


/// Metodo DELETE
// No se implementa, por eso no se pone la función de mysql
const delUsuarios = (request, response) => {
    const id = request.params.id;
    connection.query("Delete from usuarios where ID_usuario = ?",
    [id],
    (error, results) => {
        if(error)
            throw error;
        response.status(201).json({"Usuario eliminado":results.affectedRows});
    });
};
//ruta
app.route("/usuarios/:ID_usuario").delete(delUsuarios);


// Método POST para validar el inicio de sesión
const postInicioSesion = (request, response) => {
    const { Correo, Contraseña, Boleta } = request.body;
    // Verificar si el correo, la contraseña y la boleta coinciden con los de la base de datos
    connection.query(
        "SELECT * FROM usuarios WHERE Correo = ? AND Contraseña = ? AND Boleta = ?",
        [Correo, Contraseña, Boleta],
        (error, results) => {
            if (error) {
                return response.status(500).json({ error: "Error al consultar la base de datos" });
            }
            if (results.length === 0) {
                // Credenciales inválidas
                return response.status(401).json({ error: "Credenciales incorrectas" });
            }
            // Credenciales válidas, permitir el acceso
            response.status(200).json({ mensaje: "Inicio de sesión exitoso" });
        }
    );
};
// Ruta para validar el inicio de sesión
app.route("/login").post(postInicioSesion);



// Método POST para obtener los datos de un usuario específico de la base de datos
const postDatos = (request, response) => {
    const { ID_usuario } = request.body; // Obtén el ID_usuario desde el cuerpo de la solicitud

    connection.query("SELECT * FROM usuarios WHERE ID_usuario = ?", [ID_usuario], (error, results) => {
        if (error) {
            return response.status(500).json({ error: "Error al consultar la base de datos" });
        }

        if (results.length === 0) {
            return response.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        const usuario = {
            ID_usuario: results[0].ID_usuario,
            Nombre: results[0].Nombre,
            Apellido: results[0].Apellido,
            Edad: results[0].Edad,
            Correo: results[0].Correo,
            Boleta: results[0].Boleta,
            Especialidad: results[0].Especialidad
        };

        response.status(200).json({ mensaje: "Datos del usuario obtenidos correctamente", usuario });
    });
};

// Ruta para obtener un usuario por su ID (solicitud POST)
app.route("/extraer-datos").post(postDatos);

// /// Metodo POST para verificar e insertar amigos 
// const postInsertarAmigo = (request, response) => {
//     const { ID_usuario, Nombre_Amigos, Apellido_Amigos, Boleta_Amigos, ID_amigos } = request.body;
//     // Verifica si ya existe una relación entre estos usuarios
//   connection.query(
//     "SELECT * FROM amigos WHERE ID_usuario = ? AND ID_amigos = ?",
//     [ID_usuario, ID_amigos],
//     (error, results) => {
//       if (error) {
//         return response.status(500).json({ error: "Error al consultar la base de datos" });
//       }
//       if (results.length > 0) {
//         return response.status(409).json({ error: "Ya existe una relación entre estos usuarios" });
//       }
//           // Inserta los datos en la tabla "amigos"
//     connection.query(
//         "INSERT INTO amigos (ID_usuario, Nombre_Amigos, Apellido_Amigos, Boleta_Amigos, ID_amigos) VALUES (?,?,?,?,?)",
//         [ID_usuario, Nombre_Amigos, Apellido_Amigos, Boleta_Amigos, ID_amigos],
//         (error, insertResults) => {
//           if (error) {
//             return response.status(500).json({ error: "Error al insertar los datos en la base de datos" });
//           }
//           return response.status(201).json({ message: "Datos de amigo agregados exitosamente" });
//         }
//       );
//     }
//     )
//   };

//   app.route("/nuevo/amigo").post(postInsertarAmigo);

module.exports = app;