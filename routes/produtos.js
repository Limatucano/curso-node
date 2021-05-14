const express = require('express');
const router = express.Router();


router.get('/', (req, res, next)=>{
    res.status(200).send({
        mensagem:'get ai',
    })
});

router.post('/', (req, res, next)=>{
    res.status(201).send({
        mensagem: "post ai"
    })
});

router.get('/:id_produto', (req, res, next)=>{
    const id_produto = req.params.id_produto;


    res.status(200).send({
        mensagem: `id do produto ${id_produto}`
    })
});

router.patch('/', (req, res, next)=>{

    res.status(200).send({
        mensagem: `patch ai`
    })
});


router.delete('/', (req, res, next)=>{

    res.status(200).send({
        mensagem: 'delete ai'
    })
});

module.exports = router;