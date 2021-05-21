const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;


router.get('/', (req,res, next)=>{
    mysql.getConnection((error, connection)=>{
        if(error){return res.status(500).send({error:error})}
        connection.query(
            'SELECT pe.*, po.*  FROM pedidos as pe inner join produtos as po on pe.id_produto = po.id_produto',
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
                            quantidade: order.quantidade,
                            produto: {
                                id_produto: order.id_produto,
                                nome: order.nome, 
                                preco: order.preco
                            },
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
        if(error) {return res.status(500).send({error:error})}
        connection.query(
            'SELECT * FROM produtos WHERE id_produto = ?', 
            [id_produto], 
            (error, result, field)=>{
                if(error){return res.status(500).send({error:error})}
                if(result.length == 0){
                    return res.status(404).send({
                        mensagem: "Não encontrado produto com este ID"
                    })
                }
            }
        )
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

router.patch('/', (req, res, next)=>{
    const {id_pedido, id_produto, quantidade} = req.body;
    mysql.getConnection((error, connection)=>{
        if(error) return res.status(500).send({error:error})
        connection.query(
            'UPDATE pedidos SET id_produto = ?, quantidade = ? WHERE id_pedido = ?',
            [id_produto, quantidade, id_pedido],
            (error, result, field)=>{
                connection.release();
                if(error) {
                    return res.status(500).send({error:error})
                }

                const response = {
                    mensagem: "Pedido atualizado com sucesso",
                    id_pedido: id_pedido,
                    id_produto: id_produto,
                    quantidade: quantidade,
                    request: {
                        tipo: "GET",
                        descricao: "Permite visualizar detalhe do pedido atualizado",
                        url: "http://localhost:3000/pedidos/" + id_pedido
                    }
                }

                res.status(202).send({response})
            }
        )
    })
});

router.delete('/:id_pedido', (req, res, next)=>{

    const id_pedido = req.params.id_pedido;

    mysql.getConnection((error, connection)=>{
        if(error) {return res.status(500).send({error:error})}
        connection.query(
            'DELETE FROM pedidos where id_pedido = ?',
            [id_pedido],
            (error, result, field)=>{
                connection.release();
                if(error) {
                    return res.status(500).send({error:error})
                };

                const response = {
                    mensagem: "pedido deletado com sucesso",
                    id_pedido: id_pedido,
                    request: {
                        tipo: "POST",
                        descricao: "Insere um novo pedido",
                        url: "http://localhost:3000/pedidos/",
                        body:{
                            id_produto: "Number", 
                            quantidade: "Number",
                        }
                    }
                }
                res.status(202).send({response})
            }
        )
    })

})


module.exports = router;