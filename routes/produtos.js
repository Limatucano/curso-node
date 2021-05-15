const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/', (req, res, next)=>{

    mysql.getConnection((error,connection)=>{
        if(error){return res.status(500).send({error:error})}
        connection.query(
            'SELECT * FROM produtos',
            (error, resultado, field)=>{
                connection.release();

                if(error){
                    res.status(500).send({
                        error: error,
                    })
                }
                res.status(200).send({
                    message:resultado,
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

                res.status(201).send({
                    mensagem: "Produto inserido com sucesso",
                    produto: resultado.insertId,
                })
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
                res.status(200).send({
                    message: resultado
                })
            }
        )
    });
});

router.patch('/', (req, res, next)=>{
    //UPDATE users SET name = $1, email = $2 WHERE id = $3'
    res.status(200).send({
        mensagem: `patch ai`
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
                res.status(204).send({
                    message: "deletado com sucesso",
                })
            }
        )

    })
});

module.exports = router;