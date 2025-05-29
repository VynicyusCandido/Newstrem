const request = require('supertest');
const express = require('express');
const session = require('express-session');
const authRouter = require('../../routes/auth');
const authService = require('../../services/authService');

jest.mock('../../services/authService');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
secret: 'test-secret',
resave: false,
saveUninitialized: false,
cookie: { secure: false }
}));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use((req, res, next) => {
res.render = jest.fn((view, data, callback) => {
if (callback) {
callback(null, `Rendered ${view} with ${JSON.stringify(data)}`);
} else {
res.send(`Rendered ${view} with ${JSON.stringify(data)}`);
}
});
next();
});

app.use('/auth', authRouter);

describe('Auth Routes', () => {
beforeEach(() => {
jest.clearAllMocks();
});

describe('POST /auth/login', () => {
it('deve fazer login com credenciais válidas', async () => {
const mockUsuario = {
id: 1,
usuario: 'admin',
senha: 'admin123',
email: 'admin@exemplo.com'
};
authService.buscarPorCredenciais.mockReturnValue(mockUsuario);


  const response = await request(app)
    .post('/auth/login')
    .send({
      user: 'admin',
      senha: 'admin123'
    });

  expect(response.status).toBe(302);
  expect(response.headers.location).toBe('/tema');
  expect(authService.buscarPorCredenciais).toHaveBeenCalledWith('admin', 'admin123');
});

it('deve rejeitar login com credenciais inválidas', async () => {
  authService.buscarPorCredenciais.mockReturnValue(null);

  const response = await request(app)
    .post('/auth/login')
    .send({
      user: 'admin',
      senha: 'senhaErrada'
    });

  expect(response.status).toBe(401);
  expect(response.text).toContain('Credenciais inválidas!');
});

it('deve rejeitar login sem usuário', async () => {
  const response = await request(app)
    .post('/auth/login')
    .send({
      senha: 'admin123'
    });

  expect(response.status).toBe(400);
  expect(response.text).toContain('Preencha usuário e senha!');
});

it('deve rejeitar login sem senha', async () => {
  const response = await request(app)
    .post('/auth/login')
    .send({
      user: 'admin'
    });

  expect(response.status).toBe(400);
  expect(response.text).toContain('Preencha usuário e senha!');
});

it('deve rejeitar quando campos estão vazios', async () => {
  const response = await request(app)
    .post('/auth/login')
    .send({
      user: '',
      senha: ''
    });

  expect(response.status).toBe(400);
  expect(response.text).toContain('Preencha usuário e senha!');
});

it('deve lidar com erro no serviço de auth', async () => {
  authService.buscarPorCredenciais.mockImplementation(() => {
    throw new Error('Erro no banco de dados');
  });

  const response = await request(app)
    .post('/auth/login')
    .send({
      user: 'admin',
      senha: 'admin123'
    });

  expect(response.status).toBe(500);
});

it('deve validar que credenciais undefined são rejeitadas', async () => {
  const response = await request(app)
    .post('/auth/login')
    .send({});

  expect(response.status).toBe(400);
  expect(response.text).toContain('Preencha usuário e senha!');
});

});

describe('POST /auth/logout', () => {
it('deve fazer logout com sucesso', async () => {
const response = await request(app)
.post('/auth/logout');

  expect(response.status).toBe(302);
  expect(response.headers.location).toBe('/');
});

it('deve lidar com erro na destruição da sessão', async () => {
  const app2 = express();
  app2.use(session({
    secret: 'test',
    resave: false,
    saveUninitialized: false
  }));

  app2.use((req, res, next) => {
    req.session.destroy = (callback) => {
      callback(new Error('Erro na sessão'));
    };
    next();
  });

  app2.use('/auth', authRouter);

  const response = await request(app2)
    .post('/auth/logout');

  expect(response.status).toBe(302);
  expect(response.headers.location).toBe('/');
});
});
});