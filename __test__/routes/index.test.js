const request = require('supertest');
const express = require('express');
const session = require('express-session');
const indexRouter = require('../../routes/index');

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

app.use('/', indexRouter);

describe('GET /', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar página de login quando usuário não está logado', async () => {
    const response = await request(app)
      .get('/');

    expect(response.status).toBe(200);
    expect(response.text).toContain('Rendered index');
    expect(response.text).toContain('"titulo":"Login"');
    expect(response.text).toContain('"erro":null');
  });

  it('deve redirecionar para /tema quando usuário já está logado', async () => {
    const app2 = express();
    app2.use(session({
      secret: 'test-secret',
      resave: false,
      saveUninitialized: false
    }));

    app2.use((req, res, next) => {
      req.session.usuario = { id: 1, usuario: 'admin' };
      next();
    });

    app2.use((req, res, next) => {
      res.render = jest.fn((view, data) => {
        res.send(`Rendered ${view} with ${JSON.stringify(data)}`);
      });
      next();
    });

    app2.use('/', indexRouter);

    const response = await request(app2)
      .get('/');

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/tema');
  });

  it('deve passar dados corretos para a view', async () => {
    const response = await request(app)
      .get('/');

    expect(response.status).toBe(200);
    const responseData = response.text;
    expect(responseData).toContain('"titulo":"Login"');
    expect(responseData).toContain('"erro":null');
  });
});