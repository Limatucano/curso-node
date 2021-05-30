const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/cadastro', (req, res, next) => {
    mysql.getConnection((error, connection)=>{
        if(error) {return res.status(500).send({error:error})}

        connection.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [req.body.email],
            (error, results, field)=>{
                if(error) {return res.status(500).send({error:error})}
                if(results.length != 0){
                    return res.status(409).send({mensagem: "usuario já existe"})
                }else{
                    bcrypt.hash(req.body.senha, 10, (errBcrypt, hash)=>{
                        if(errBcrypt){
                            return res.status(500).send({error:errBcrypt})
                        }
                        connection.query(
                            'INSERT INTO usuarios (email, senha) VALUES (?, ?)', 
                        [req.body.email, hash],
                        (error, results, field)=>{
                            connection.release();
                            if(error){return res.status(500).send({error:error})}
                            const response = {
                                mensagem: "Usuario criado com sucesso",
                                usuario: {
                                    id: results.insertId,
                                    email: req.body.email,
                            }}
                            res.status(201).send(response)
                        })
            
                    });
                }
            }
        )

    })
});

router.post('/login', (req, res, next)=>{
    mysql.getConnection((error, connection)=>{
        if(error) {return res.status(500).send({error:error})}
        const query = `SELECT * FROM usuarios WHERE email = ?`;
        connection.query(query,
            [req.body.email],
            (error, results, field)=>{
                connection.release();
                if(error) {return res.status(500).send({error:error})}
                if(results.length < 1) {
                    return notAures.status(401).send({mensagem:"Falha na autenticação"});
                }
                bcrypt.compare(req.body.senha, results[0].senha, function(err, result){
                    if(err){res.status(401).send({mensagem:"Falha na autenticação"});}
                    if(result){
                        const token = jwt.sign({
                            id_usuario: results[0].id_usuario,
                            email: results[0].email,
                        }, process.env.JWT_KEY,
                        {
                            expiresIn : "1h"
                        });
                        return res.status(200).send({mensagem:"Autenticado com sucesso", token:token})
                    }else{
                        return res.status(401).send({mensagem:"Falha na autenticação"});
                    }
                     
                });
            });
    });
});


module.exports = router;