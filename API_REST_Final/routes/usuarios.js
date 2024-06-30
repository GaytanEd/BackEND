const express = require("express");
const router = express.Router();
const { getUsuarios, postUsuarios, delUsuarios, postInicioSesion, postDatos, postAmigo, postNombreAmigos, postListaAmigos } = require("../controllers/usuarioController");

router.get("/", getUsuarios);
router.post("/nuevo", postUsuarios);
router.delete("/:ID_usuario", delUsuarios);
router.post("/login", postInicioSesion);
router.post("/extraer-datos", postDatos);
router.post("/amigos/nuevo", postAmigo); 
router.post("/amigos/nombre", postListaAmigos);

module.exports = router;
