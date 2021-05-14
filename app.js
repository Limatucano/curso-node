const express = require('express');
const app = express();
const morgan = require('morgan');
const rotaProdutos = require('./routes/produtos');
const rotaPedidos  = require('./routes/pedidos');

app.use(morgan('dev'));
app.use('/pedidos', rotaPedidos);
app.use('/produtos', rotaProdutos);
app.use((req, res, next)=>{
    res.status(200).send({
        message: "Ola mundo",
    });
})


module.exports = app;