const express = require('express');
const route = express.Router();
const financeiro = [
    {
        descricao: "Bala",
        valor: 1.00,
        tipo: 2
    }
];

route.get('/', (req, res) => {
    res.render('index'); 
    console.log(financeiro);
});

route.post('/criar', (req, res)=>{
    const desc = req.body.descricao;
    const valor = req.body.valor;
    const tipo = req.body.tipo

    financeiro.push({
        desc,
        valor: parseFloat(valor),
        tipo: parseInt(tipo)
    });

    res.redirect('/');
});

module.exports = route;
