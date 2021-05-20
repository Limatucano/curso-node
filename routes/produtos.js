const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/', (req, res, next)=>{

    mysql.getConnection((error,connection)=>{
        if(error){return res.status(500).send({error:error})}
        connection.query(
            'SELECT * FROM produtos',
            (error, result, field)=>{
                connection.release();

                if(error){
                    res.status(500).send({
                        error: error,
                    })
                }
                const response = {
                    quantidade: result.length,
                    produtos: result.map(prod =>{
                        return {
                            id_produto: prod.id_produto,
                            nome: prod.nome, 
                            preco: prod.preco,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os produtos, para saber mais use a chave url',
                                url: 'http://localhost:3000/produtos/'+prod.id_produto,
                            }
                        }
                    })
                }
                res.status(200).send({
                    response,
                });
            }
        )
    });
});

router.post('/', (req, res, next)=>{

    const produto = {
        nome: req.body.nome,
        preco: req.body.preco,
    };

    mysql.getConnection((error, connection)=>{
        if(error){return res.status(500).send({error:error})}
        connection.query(
            'INSERT INTO produtos (nome, preco) VALUES (?, ?)',
            [produto.nome, produto.preco],
            (error, resultado, field) =>{
                connection.release();

                if(error){
                    res.status(500).send({
                        error: error,
                        response:null
                    });
                }
                const response = {
                    mensagem: 'produto inserido com sucesso',
                    IdProdutoCriado: {
                        id: resultado.id_produto,
                        nome: req.body.nome, 
                        preco: req.body.preco,
                        request: {
                            tipo: 'POST',
                            descricao: 'Cria um novo produto',
                            url: 'http://localhost:3000/produtos/'
                        }
                    }
                }
                res.status(201).send({response});
            }
        )
    })
    
});

router.get('/:id_produto', (req, res, next)=>{
    const id_produto = req.params.id_produto;

    mysql.getConnection((error, connection)=>{
        if(error){return res.status(500).send({error:error})}
        connection.query(
            'SELECT * FROM produtos WHERE id_produto = ?',
            [id_produto],
            (error, resultado, field)=>{
                connection.release();

                if(error){
                    res.status(500).send({
                        error: error,
                    });
                }
                if(resultado[0] == undefined){
                    return res.status(404).send({
                        mensagem: "Não encontrado produto com este ID"
                    });

                }
                const response = {
                    id_produto: resultado[0].id_produto,
                    nome : resultado[0].nome, 
                    preco: resultado[0].preco,
                    request: {
                        tipo: "GET",
                        descricao: "Traz um produto especifico pelo ID",
                        url : "http://localhost:3000/produtos/",
                    }
                }
                res.status(200).send({
                    response
                })
            }
        )
    });
});

router.patch('/', (req, res, next)=>{
    const {id_produto, nome, preco} = req.body;
    mysql.getConnection((error, connection)=>{
        if(error){return res.status(501).send({error: error})}
        connection.query(
            'UPDATE produtos SET nome = ?, preco = ? WHERE id_produto = ?',
            [nome, preco,id_produto],
            (error, result, field)=>{
                connection.release();
                if(error){
                    res.status(500).send({
                        error: error,
                    })
                }
                const response = {
                    mensagem:"produto atualizado com sucesso",
                    id_produto: req.body.id_produto,
                    nome : req.body.nome,
                    preco: req.body.preco,
                    request: {
                        tipo: "GET",
                        descricao: "Lista detalhe do item adicionado",
                        url: "http://localhost:3000/produtos/"+req.body.id_produto
                    }
                }
                res.status(202).send({
                    response,
                })
            }
        )
    })
});


router.delete('/:id_produto', (req, res, next)=>{
    const id_produto = req.params.id_produto;
    mysql.getConnection((error, connection)=>{

        connection.query(
            'DELETE FROM produtos WHERE id_produto = ?',
            [id_produto],
            (error, resultado, field)=>{
                connection.release();
                if(error){
                    res.status(500).send({
                        error: error
                    })
                }
                const response = {
                    mensagem: "produto deletado com sucesso",
                    id_produto: req.params.id_produto,
                    request:{
                        tipo:"POST",
                        descricao:"insere um produto",
                        url:"http://localhost:3000/produtos/",
                        body:{
                            nome: "String",
                            preco: "Number",
                        }
                    }
                }
                res.status(202).send({
                    response,
                })
            }
        )

    })
});

module.exports = router;