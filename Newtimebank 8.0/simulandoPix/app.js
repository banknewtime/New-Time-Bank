const express = require('express');
const path = require('path');
const app = express();
const port = 8000;

const db = require('./models/database'); // Importe o módulo da conexão com o banco de dados

app.use(express.static(path.join(__dirname)));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/transferencia-pix', async (req, res) => {
    const { chavePixRemetente, chavePixDestinatario, valor } = req.body;

    const connection = await db.getConnection(); // Use a conexão do módulo de banco de dados

    try {
        await connection.beginTransaction();

        const [remetente] = await connection.execute('SELECT * FROM contas WHERE chave_pix = ?', [chavePixRemetente]);
        const [destinatario] = await connection.execute('SELECT * FROM contas WHERE chave_pix = ?', [chavePixDestinatario]);

        if (remetente.length === 0 || destinatario.length === 0) {
            throw new Error('Conta remetente ou destinatário não encontrada.');
        }

        if (remetente[0].saldo < valor) {
            throw new Error('Saldo insuficiente para realizar a transferência.');
        }

        await connection.execute('UPDATE contas SET saldo = saldo - ? WHERE chave_pix = ?', [valor, chavePixRemetente]);
        await connection.execute('UPDATE contas SET saldo = saldo + ? WHERE chave_pix = ?', [valor, chavePixDestinatario]);

        await connection.commit();

        res.json({ success: true });
    } catch (error) {
        await connection.rollback();
        res.json({ success: false, error: error.message });
    } finally {
        connection.release();
    }
});



app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

