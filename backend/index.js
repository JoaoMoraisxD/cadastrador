const express = require('express');
const app = express();
const { Client } = require('pg');
const config = require('./database');

app.use(express.json());

app.get('/', async (req, res) => {
    res.json({
        message: 'Bem vindo á API',
        status: "Sucess"
    });
});

app.post('/data', (req, res) => {
    const jsonData = req.body;
    console.log(jsonData);
    console.log('Tipo do password ',config.password);

    res.status(200).json({
        message: 'Dados recebidos com sucesso',
        data: jsonData
    });
    async function insertProduto() {
        const client = new Client(config);
        try{
            await client.connect();
            const query = `INSERT INTO produtos (nomeProduto, valor) VALUES ($1, $2)`;
            const values = [jsonData.nomeProduto, jsonData.valor];
            await client.query(query, values);
        }catch (error) {
            console.error('Erro ao executar comando', error);
            res.status(500).json({
                message:'Erro ao inserir dados',
                error: error.message
            })
        } finally {
            await client.end(); 
        }
    }

    insertProduto()
});

app.listen(3000, () => {
    console.log('Servidor Rodando em https://localhost:3000');
});