const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
app.use(bodyParser.json());

// Rota de Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Preencha e-mail e senha' });
  }

  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length === 0) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }

    res.json({ message: 'Login realizado com sucesso', user: results[0] });
  });
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
