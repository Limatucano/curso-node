const express = require('express');
const router = express.Router();


router.post('/', (req,res, next)=>{
    const pedido = {
        numero : req.body.numero,
        valor  : req.body.valor
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