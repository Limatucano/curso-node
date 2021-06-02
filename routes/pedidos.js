const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const pedidos_controller = require('../controllers/pedidos-controller');

router.get('/', pedidos_controller.getPedidos);

router.post('/',pedidos_controller.postPedidos);

router.get('/:id_pedido',pedidos_controller.getPedidosById);

router.patch('/', pedidos_controller.patchPedidos);

router.delete('/:id_pedido', pedidos_controller.deletePedido);


module.exports = router;