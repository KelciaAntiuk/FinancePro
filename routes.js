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

const error = [{}]

let ultimoId = 1;

route.get('/', (req, res) => {
    res.render('index');
});

//Rota para criação de novos financeiros
route.post('/criar', (req, res)=>{
    const desc = req.body.descricao;
    const valor = req.body.valor;
    const tipo = req.body.tipo;

    ultimoId++;

    const validation = !desc || isNaN(valor) || [1, 2].includes(tipo);

    if (validation) {
        error.push({
            erro: "Algo deu errado"
        })
        res.redirect('/');
    }
    else{
        financeiro.push({
            desc,
            valor: parseFloat(valor),
            tipo: parseInt(tipo),
            id: ultimoId
        });

        res.redirect('/');
    }
});

//atualizar as entradas e saídas e saldo.
route.get('/api/financeiro', (req, res) => {
    res.json(financeiro);
});

//Retornar mensagem de erro
route.get('/error', (req, res) => {
    res.status(400).json(error);
});

route.delete('/error/delete', (req, res) => {
    if (error.length > 0) {
        error.pop(); // remove o último erro
    }
    res.sendStatus(200);
});

module.exports = route;
