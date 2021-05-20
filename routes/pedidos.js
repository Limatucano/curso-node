const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;


router.get('/', (req,res, next)=>{
    mysql.getConnection((error, connection)=>{
        if(error){return res.status(500).send({error:error})}
        connection.query(
            'SELECT * FROM pedidos',
            (error, result, field)=>{
                connection.release();

                if(error){
                    return res.status(500).send({
                        error:error
                })}

                const response = {
                    quantidade: result.length,
                    pedidos: result.map(order =>{
                        return {
                            id_pedido: order.id_pedido,
                            id_produto: order.id_produto,
                            quantidade: order.quantidade,
                            request: {
                                tipo: "GET",
                                descricao: 'Retorna o detalhe do pedido',
                                url: "http://localhost:3000/pedidos/"+order.id_pedido,
                            }
                        }
                    })

                }
                res.status(200).send({response});
            }
        
        )
    })
});
router.post('/', (req, res, next)=>{
    const {id_produto, quantidade} = req.body;

    mysql.getConnection((error, connection)=>{
        if(error) {return res.status(500).send({error:error})};
        connection.query(
            'INSERT INTO pedidos (id_produto,quantidade) VALUES (?,?)',
            [id_produto,quantidade],
            (error, result, field)=>{
                connection.release();
                if(error) {
                    return res.status(500).send({error:error})
                }
                const response = {
                    mensagem: "pedido inserido com sucesso",
                    id_produto: id_produto,
                    id_pedido: result.id_pedido,
                    quantidade: quantidade,
                    request: {
                        tipo: "GET",
                        descricao: "Retorna detalhe do pedido criado",
                        url: "http://localhost:3000/pedidos/"+ result.id_pedido
                    }
                }
                res.status(201).send({
                    response
                })
            }
        )
    })

});

router.get('/:id_pedido',(req, res, next)=>{
    const id_pedido = req.params.id_pedido;

    mysql.getConnection((error, connection)=>{
        if(error){return res.status(500).send({error:error})}
        connection.query(
            'SELECT * FROM pedidos WHERE id_pedido = ?',
            [id_pedido],
            (error, result, field)=>{
                connection.release();

                if(error){
                    return res.status(500).send({error:error})
                }
                if(result[0] == undefined){
                    return res.status(404).send({
                        mensagem: "Não encontrado pedido com este ID"
                    })
                }
                const response = {
                    id_pedido: result[0].id_pedido,
                    id_produto: result[0].id_produto,
                    quantidade: result[0].quantidade,
                    request:{
                        tipo: "GET",
                        descricao: "Traz todos pedidos",
                        url: "http://localhost:3000/pedidos/"
                    }
                }

                res.status(200).send({response})
            }
        )
    })
});



module.exports = router;