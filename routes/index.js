const express = require('express');
const roteador = express.Router();

roteador.get('/', (req, res) => {
  if (req.session.usuario) {
    return res.redirect('/tema');
  }
  
  res.render('index', { 
    titulo: 'Login',
    erro: null 
  });
});

module.exports = roteador;
