const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const rotaProdutos = require('./routes/produtos');
const rotaPedidos  = require('./routes/pedidos');
const rotaUsuarios  = require('./routes/usuarios');

//dependencia que monitora as requisições e retorna (o verbo, /o endpoint, status, tempo em milisegundos e tamanho em caractere do que foi enviado para o client)
app.use(morgan('dev'));
//disponibiliza a imagem publicamente
app.use('/uploads',express.static('uploads'));
//aceitando apenas dados simples
app.use(bodyParser.urlencoded({ extended: false }));
//só aceitando formato json
app.use(bodyParser.json());

app.use((req, res, next) => {
    //permite o acesso por parte de todos servidores, caso quisessemos delimitar, no segundo parametro setariamos o servidor que teria acesso
    res.header('Access-Control-Allow-Origin', '*');
    //O que iremos permitir de header
    res.header(
        'Access-Control-Allow-Header', 
        'Content-Type, Origin, X-Requested-With, Accept, Authorization'
            );
    //setamos quais metodos serao aceitos
    if(req.method === "OPTIONS"){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }

    next();
    
});
app.use('/pedidos', rotaPedidos);
app.use('/produtos', rotaProdutos);
app.use('/usuarios', rotaUsuarios);
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