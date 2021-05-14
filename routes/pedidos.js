const express = require('express');
const router = express.Router();


router.post('/', (req,res, next)=>{
    const pedido = {
        id_produto : req.body.id_produto,
        quantidade : req.body.quantidade
    }
    res.status(200).send({
        mensagem: "post aqui",
        pedido: pedido
    })
});
router.get('/', (req, res, next)=>{
    res.status(200).send({
        mensagem : "get pedidos"
    })
});

module.exports = router;