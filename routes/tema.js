const express = require('express');
const roteador = express.Router();

roteador.get('/', (req, res) => {
  if (!req.session.usuario) {
    return res.redirect('/');
  }
  
  res.render('tema', {
    titulo: 'Página Tema',
    usuario: req.session.usuario
  });
});

module.exports = roteador;