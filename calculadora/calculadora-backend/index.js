const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

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

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));
