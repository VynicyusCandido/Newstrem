const criarErro = require('http-errors');
const express = require('express');
const caminho = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const roteadorIndex = require('./routes/index');
const roteadorUsuarios = require('./routes/users');
const roteadorAuth = require('./routes/auth');
const roteadorTema = require('./routes/tema');

const app = express();

app.use(session({
  secret: 'chave-secreta-super-segura-12345',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

app.set('views', caminho.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(caminho.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario;
  next();
});

app.use('/', roteadorIndex);
app.use('/users', roteadorUsuarios);
app.use('/auth', roteadorAuth);
app.use('/tema', roteadorTema);

app.use((req, res, next) => {
  next(criarErro(404));
});

app.use((erro, req, res, next) => {
  res.locals.mensagem = erro.message;
  res.locals.erro = req.app.get('env') === 'development' ? erro : {};
  res.status(erro.status || 500);
  res.render('error');
});

module.exports = app;

// Apenas se quiser rodar diretamente com `node app.js`
if (require.main === module) {
  const porta = process.env.PORT || 3000;
  app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}`);
  });
}
