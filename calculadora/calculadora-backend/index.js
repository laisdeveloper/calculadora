const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Rotas de exemplo
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
            resultado = valor2 !== 0 ? valor1 / valor2 : 'Erro';
            break;
        default:
            return res.status(400).json({ erro: 'Operação inválida' });
    }
    res.json({ resultado });
});

// Inicializando o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));
