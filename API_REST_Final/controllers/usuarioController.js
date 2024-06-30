const { connection } = require("../config/config.db.js");
const { cifrarSHA256 } = require("../utils/utils");

/// Metodo GET para mostrar a todos los usuarios de la base de datos
const getUsuarios = (request, response) => {
    connection.query("SELECT * FROM usuarios", (error, results) => {
        if (error) throw error;
        response.status(200).json(results);
    });
};

// Método POST para agregar un nuevo usuario con contraseña cifrada
const postUsuarios = (request, response) => {
    const { ID_usuario, Nombre, Apellido, Edad, Correo, Boleta, Especialidad, Contraseña, Fecha_Creacion, Fecha_Modificación } = request.body;

    // Verificación de que Correo no sea undefined
    if (!Correo) {
        return response.status(400).json({ error: "El campo Correo es obligatorio" });
    }

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

    // Cifrar la contraseña usando SHA-256
    const contraseñaCifrada = cifrarSHA256(Contraseña);

    // Verificar si el correo o la boleta ya existen en la base de datos
    connection.query(
        "SELECT * FROM usuarios WHERE Correo = ? OR Boleta = ?",
        [Correo, Boleta],
        (error, results) => {
            if (error) {
                return response.status(500).json({ error: "Error al consultar la base de datos: " + error.message });
            }
            if (results.length > 0) {
                // Ya existe un usuario con el mismo correo o boleta
                return response.status(409).json({ error: "El correo o la boleta ya están registrados" });
            }
            // Insertar el nuevo usuario con la contraseña cifrada
            connection.query(
                "INSERT INTO usuarios(ID_usuario, Nombre, Apellido, Edad, Correo, Boleta, Especialidad, Contraseña, Fecha_Creacion, Fecha_Modificación) VALUES (?,?,?,?,?,?,?,?,?,?)",
                [ID_usuario, Nombre, Apellido, Edad, Correo, Boleta, Especialidad, contraseñaCifrada, Fecha_Creacion, Fecha_Modificación],
                (error, insertResults) => {
                    if (error) {
                        console.error("Error al insertar el usuario:", error); // Agregar mensaje de error detallado
                        return response.status(500).json({ error: "Error al insertar el usuario en la base de datos: " + error.message });
                    }
                    response.status(201).json({ mensaje: "Usuario creado exitosamente" });
                }
            );
        }
    );
};
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

// Metodo DELETE
const delUsuarios = (request, response) => {
    const id = request.params.id;
    connection.query("DELETE FROM usuarios WHERE ID_usuario = ?", [id], (error, results) => {
        if (error) throw error;
        response.status(201).json({ "Usuario eliminado": results.affectedRows });
    });
};

// Método POST para agregar un nuevo amigo
const postAmigo = (request, response) => {
    const { ID_usuario, Nombre_Amigos, Apellido_Amigos, Boleta_Amigos, ID_Amigos } = request.body;
    // Validación de boleta: debe tener 10 números
    const boletaRegex = /^\d{10}$/;
    if (!boletaRegex.test(Boleta_Amigos)) {
        return response.status(400).json({ error: "La boleta del amigo debe tener exactamente 10 números" });
    }

    // Verificar si ya existe una relación entre ID_usuario e ID_Amigos en la base de datos
    connection.query(
        "SELECT * FROM amigos WHERE ID_usuario = ? AND ID_Amigos = ?",
        [ID_usuario, ID_Amigos],
        (error, results) => {
            if (error) {
                return response.status(500).json({ error: "Error al consultar la base de datos" });
            }
            if (results.length > 0) {
                // Ya existe una relación entre ID_usuario e ID_Amigos
                return response.status(409).json({ error: "El amigo ya está registrado para este usuario" });
            }
            // Insertar el nuevo amigo
            connection.query(
                "INSERT INTO amigos(ID_usuario, Nombre_Amigos, Apellido_Amigos, Boleta_Amigos, ID_Amigos) VALUES (?,?,?,?,?)",
                [ID_usuario, Nombre_Amigos, Apellido_Amigos, Boleta_Amigos, ID_Amigos],
                (error, insertResults) => {
                    if (error) {
                        return response.status(500).json({ error: "Error al insertar el amigo en la base de datos" });
                    }
                    response.status(201).json({ mensaje: "Amigo añadido exitosamente" });
                }
            );
        }
    );
};

// Método POST para extraer la lista de amigos de un usuario
const postListaAmigos = (request, response) => {
    const { ID_usuario } = request.body;

    // Verificar si el ID_usuario está presente
    if (!ID_usuario) {
        return response.status(400).json({ error: "El campo ID_usuario es obligatorio" });
    }

    // Consultar la base de datos para obtener los nombres de los amigos
    connection.query(
        "SELECT Nombre_Amigos FROM amigos WHERE ID_usuario = ?",
        [ID_usuario],
        (error, results) => {
            if (error) {
                return response.status(500).json({ error: "Error al consultar la base de datos" });
            }
            if (results.length === 0) {
                return response.status(404).json({ mensaje: "No se encontraron amigos para este usuario" });
            }

            // Guardar los nombres de los amigos en un vector
            const nombresAmigos = results.map(row => row.Nombre_Amigos);
            response.status(200).json({ mensaje: "Nombres de amigos obtenidos correctamente", nombresAmigos });
        }
    );
};

module.exports = { getUsuarios, postUsuarios, delUsuarios, postInicioSesion, postDatos, postAmigo, postListaAmigos };

