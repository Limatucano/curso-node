const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const rotaProdutos = require('./routes/produtos');
const rotaPedidos  = require('./routes/pedidos');

//dependencia que monitora as requisições e retorna (o verbo, /o endpoint, status, tempo em milisegundos e tamanho em caractere do que foi enviado para o client)
app.use(morgan('dev'));
//aceitando apenas dados simples
app.use(bodyParser.urlencoded({ extended: false }));
//só aceitando formato json
app.use(bodyParser.json());

app.use('/pedidos', rotaPedidos);
app.use('/produtos', rotaProdutos);

//quando não encontrar as rotas citadas acima, exibe mensagem de erro
app.use((req, res, next)=>{
    const erro = new Error('URL desconhecida por nós');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    return res.send({
        erro:{
            mensagem: error.message
        }
    })
});


module.exports = app;