const express = require('express');
const route = express.Router();

//Objeto utilizado
const financeiro = [
    {
        descricao: "Bala",
        valor: 1.00,
        tipo: 2,
        id: 1
    }
];

let ultimoId = 1;

route.get('/', (req, res) => {
    res.render('index'); 
    console.log(financeiro);
});

//Rota para criação de novos financeiros
route.post('/criar', (req, res)=>{
    const desc = req.body.descricao;
    const valor = req.body.valor;
    const tipo = req.body.tipo
    ultimoId++;

    financeiro.push({
        desc,
        valor: parseFloat(valor),
        tipo: parseInt(tipo),
        id: ultimoId
    });

    res.redirect('/');
});

module.exports = route;
