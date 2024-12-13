const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Configurar a conexão com o banco PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Testar a conexão ao banco de dados
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Erro ao conectar ao PostgreSQL', err);
    } else {
        console.log('Conectado ao PostgreSQL:', res.rows[0]);
    }
});

// Rota para cálculos básicos
app.post('/calcular', (req, res) => {
    const { operacao, valor1, valor2 } = req.body;

    let resultado;
    switch (operacao) {
        case 'soma':
            resultado = valor1 + valor2;
            break;
        case 'subtracao':
            resultado = valor1 - valor2;
            break;
        case 'multiplicacao':
            resultado = valor1 * valor2;
            break;
        case 'divisao':
            resultado = valor2 !== 0 ? valor1 / valor2 : 'Erro: Divisão por zero';
            break;
        default:
            return res.status(400).json({ erro: 'Operação inválida' });
    }

    res.json({ resultado });
});

// Rota para cálculo de IMC
app.post('/imc', (req, res) => {
    const { peso, altura } = req.body;

    if (!peso || !altura) {
        return res.status(400).json({ erro: 'Peso e altura são obrigatórios' });
    }

    const imc = peso / (altura * altura);
    res.json({ imc });
});

// Rota para conversão de medidas
app.post('/converter', (req, res) => {
    const { valor, de, para } = req.body;

    const taxas = {
        metros: 1,
        centimetros: 100,
        milimetros: 1000,
        quilometros: 0.001,
    };

    if (!taxas[de] || !taxas[para]) {
        return res.status(400).json({ erro: 'Unidade inválida' });
    }

    const resultado = (valor * taxas[de]) / taxas[para];
    res.json({ resultado });
});

// Rota para salvar o histórico das operações no PostgreSQL
app.post('/historico', async (req, res) => {
    const { operacao, resultado, timestamp } = req.body;

    try {
        await pool.query('INSERT INTO historico (operacao, resultado, timestamp) VALUES ($1, $2, $3)', [
            operacao,
            resultado,
            timestamp
        ]);
        res.status(200).json({ message: 'Histórico salvo com sucesso!' });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao salvar no histórico', details: error });
    }
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));
