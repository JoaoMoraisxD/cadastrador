const express = require('express');
const cors = require('cors');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const { Client } = require('pg');
const config = require('./database');

const app = express();
app.use(cors());
app.use(express.json());


async function createAndConnectClient(user, password) {
    const client = new Client({
        user: user,
        host: 'localhost',
        database: 'postgres',
        password: password,
        port: 5432
    });

    try {
        await client.connect();
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados', error);
        throw error;
    }

    return client;
}


app.post('/login', async (req, res) => {
    const { nomeUsuario, senhaDb } = req.body;

    try {
        console.log('Requisição de login recebida:', req.body);

        const bytes = CryptoJS.AES.decrypt(senhaDb, 'sua-chave-secreta');
        const senhaDescriptografada = bytes.toString(CryptoJS.enc.Utf8);

        console.log('Senha descriptografada:', senhaDescriptografada);


        const token = jwt.sign({ user: nomeUsuario, password: senhaDescriptografada }, 'sua-chave-secreta', { expiresIn: '1h' });

        res.status(200).json({ token });

    } catch (error) {
        console.error('Erro ao autenticar', error);
        res.status(500).send('Erro ao autenticar');
    }
});


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, 'sua-chave-secreta', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.get('/listaProdutos', authenticateToken, async (req, res) => {
    const { user, password } = req.user;

    console.log('Usuário e senha recebidos do token:', user, password);

    const client = await createAndConnectClient(user, password);
    try {
        const result = await client.query('SELECT * FROM public.produtos ORDER BY id ASC');
        res.status(200).json({
            message: 'Dados buscados com sucesso',
            data: result.rows
        });
    } catch (error) {
        console.error('Erro ao buscar dados', error);
        res.status(500).json({
            message: 'Erro ao buscar dados',
            error: error.message
        });
    } finally {
        await client.end();
    }
});


app.post('/data', authenticateToken, async (req, res) => {
    const { user, password } = req.user;
    const jsonData = req.body;

    console.log('Dados recebidos para inserção:', jsonData);

    const client = await createAndConnectClient(user, password);
    try {
        const query = `INSERT INTO produtos (nomeProduto, valor) VALUES ($1, $2)`;
        const values = [jsonData.nomeProduto, jsonData.valor];
        await client.query(query, values);
        res.status(200).json({
            message: 'Dados recebidos com sucesso',
            data: jsonData
        });
    } catch (error) {
        console.error('Erro ao inserir dados', error);
        res.status(500).json({
            message: 'Erro ao inserir dados',
            error: error.message
        });
    } finally {
        await client.end();
    }
});


app.delete('/delete', authenticateToken, async (req, res) => {
    const { user, password } = req.user;
    const jsonData = req.body;

    console.log('Dados recebidos para deleção:', jsonData);

    const client = await createAndConnectClient(user, password);
    try {
        const query = `DELETE FROM produtos WHERE nomeProduto = $1`;
        const values = [jsonData.nomeProduto];
        await client.query(query, values);
        res.status(200).json({
            message: 'Deletado com sucesso'
        });
    } catch (error) {
        console.error('Erro ao deletar dados', error);
        res.status(500).json({
            message: 'Erro ao deletar dados',
            error: error.message
        });
    } finally {
        await client.end();
    }
});

app.listen(3001, () => {
    console.log('Servidor Rodando em http://localhost:3001');
});
