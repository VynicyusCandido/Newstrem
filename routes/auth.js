const express = require('express');
const roteador = express.Router();
const servicoAuth = require('../services/authService');

roteador.post('/login', (req, res) => {
  const { user, senha } = req.body;

  console.log('Dados recebidos:', { user, senha });

  if (!user || !senha) {
    return res.status(400).render('index', {
      titulo: 'Login',
      erro: 'Preencha usuário e senha!'
    });
  }

  const usuarioEncontrado = servicoAuth.buscarPorCredenciais(user, senha);
  
  if (usuarioEncontrado) {
    req.session.usuario = usuarioEncontrado;
    console.log('Login bem-sucedido:', usuarioEncontrado);
    return res.redirect('/tema');
  } else {
    return res.status(401).render('index', {
      titulo: 'Login',
      erro: 'Credenciais inválidas!'
    });
  }
});

roteador.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Erro ao destruir sessão:', err);
    }
    res.redirect('/');
  });
});

module.exports = roteador;