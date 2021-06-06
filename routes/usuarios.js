const express = require('express');
const router = express.Router();
const usuarios_controller = require('../controllers/usuarios-controller');

router.post('/cadastro', usuarios_controller.cadastrarUsuario);

router.post('/login', usuarios_controller.loginUsuario);


module.exports = router;