const express = require('express');
const router = express.Router();
const db = require('../db'); // ou o caminho do teu db.js certo

router.post('/login', (req, res) => {
    const { user, senha } = req.body;

    if (!user || !senha) {
        return res.send('Preencha usuário e senha!');
    }

    const sql = 'SELECT * FROM users WHERE name = ? AND password = ?';

    db.query(sql, [user, senha], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            res.redirect('/tema');  // Redireciona para o template tema.ejs
        } else {
            res.send('Usuário ou senha inválidos!');
        }
    });
});

module.exports = router;
