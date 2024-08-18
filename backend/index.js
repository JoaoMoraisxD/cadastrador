const express = require('express');
const cors = require('cors');
const app = express();
const { Client } = require('pg');
const config = require('./database');


app.use(cors())
app.use(express.json());

app.get('/listaProdutos', async (req, res) => {
    async function listaProdutos (){
        const client = new Client(config);
        try{
            await client.connect();
            const result = await client.query('SELECT * FROM public.produtos ORDER BY id ASC');
            return result.rows
        }catch (error){
            console.error("Erro ao executar comando");
            res.status(500).json({
                message: 'Erro ao buscar dados',
                error: error.message
            })
        }finally{
            await client.end();
        }
    }

    try{
        const produtos = await listaProdutos();
        res.status(200).json({
            message:'Dados buscados com sucesso',
            data: produtos
        })
    }catch (error) {
        res.status(500).json({
            message: 'Erro ao buscar dados',
            error: error.message
        });
    }
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

app.delete('/delete', (req, res) => {
    const cliente = new Client(config);
    const jsonData = req.body;
    console.log(jsonData)
   
    async function deleteProduto(){
        try{

            await cliente.connect();
            const query = `DELETE FROM produtos WHERE nomeProduto = $1`;
            const values = [jsonData.nomeProduto];
            await cliente.query(query, values);
            res.status(200).json({
                message: 'Deletado com sucesso'
            })

        }catch(error){
            console.error('Erro ao executar comando', error);
            res.status(500).json({
                message:'Erro ao deletar dados',
                error: error.message
            })
        }finally{
            await cliente.end();
        }
    }

    deleteProduto();
});

app.listen(3001, () => {
    console.log('Servidor Rodando em http://localhost:3001');
});