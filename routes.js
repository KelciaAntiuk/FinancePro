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

let ultimoId = 2;

route.get('/', (req, res) => {
    res.render('index', { financeiro }); // Passando o array financeiro para o template
    console.log(financeiro);
});

//Rota para criação de novos financeiros
route.post('/criar', (req, res) => {
    const desc = req.body.descricao;
    const valor = req.body.valor;
    const tipo = req.body.tipo;
    ultimoId++;

    financeiro.push({
        descricao: desc,
        valor: parseFloat(valor),
        tipo: parseInt(tipo),
        id: ultimoId
    });

    res.redirect('/');
});

// Rota para edição de um item financeiro
route.put('/editar/:id', (req, res) => {
    const { id } = req.params; // ID do item a ser editado
    const { descricao, valor, tipo } = req.body; // Dados enviados no corpo da requisição

    console.log('Requisição recebida:', { id, descricao, valor, tipo });

    // Encontrar o item pelo ID
    const item = financeiro.find(i => i.id == id);

    if (item) {
        // Atualizar os dados do item
        item.descricao = descricao;
        item.valor = parseFloat(valor);
        item.tipo = parseInt(tipo);

        // Retornar sucesso
        res.status(200).json({ message: 'Item editado com sucesso!', item });
    } else {
        // Caso o item não seja encontrado
        res.status(404).json({ message: 'Item não encontrado!' });
    }
});

// Rota para deletar um item (opcional)
route.delete('/deletar/:id', (req, res) => {
    const { id } = req.params;
    
    // Filtrando o item do array
    financeiro = financeiro.filter(i => i.id != id);

    res.status(200).json({ message: 'Item deletado com sucesso!' });
});

module.exports = route;
