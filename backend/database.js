const { Client } = require('pg');

const config = {
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: "250295",
    port: 5432
}

const client = new Client(config);

client.connect()
    .then(() => console.log('conectado ao banco de dados'))
    .catch(err => console.error('Erro ao conectar ao banco de dados', err))

module.exports = config;