const request = require('supertest');
const express = require('express');
const session = require('express-session');
const temaRouter = require('../../routes/tema');

describe('Tema Routes', () => {
  let app;

  beforeEach(() => {

    app = express();

    app.use(session({
      secret: 'test-secret',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }
    }));

    app.use((req, res, next) => {
      res.render = jest.fn((view, data) => {
        res.status(200).send(`Rendered ${view} with ${JSON.stringify(data)}`);
      });
      next();
    });

    app.use('/tema', temaRouter);
  });

  describe('GET /tema', () => {
    it('deve redirecionar para / quando usuário não está logado', async () => {
      const response = await request(app)
        .get('/tema');

      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/');
    });

    it('deve renderizar a página tema quando usuário está logado', async () => {
      const appWithSession = express();
      const mockUser = { id: 1, usuario: 'testuser' };
      
      appWithSession.use(session({
        secret: 'test-secret',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
      }));

      appWithSession.use((req, res, next) => {
        req.session.usuario = mockUser;
        next();
      });

      appWithSession.use((req, res, next) => {
        res.render = jest.fn((view, data) => {
          res.status(200).send(`Rendered ${view} with ${JSON.stringify(data)}`);
        });
        next();
      });

      appWithSession.use('/tema', temaRouter);

      const response = await request(appWithSession)
        .get('/tema');

      expect(response.status).toBe(200);
      expect(response.text).toContain('Rendered tema');
      expect(response.text).toContain('"titulo":"Página Tema"');
      expect(response.text).toContain(`"usuario":${JSON.stringify(mockUser)}`);
    });

    it('deve passar os dados corretos do usuário para a view', async () => {
      const appWithSession = express();
      const mockUser = { id: 2, usuario: 'admin', email: 'admin@test.com' };
      
      appWithSession.use(session({
        secret: 'test-secret',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
      }));

      appWithSession.use((req, res, next) => {
        req.session.usuario = mockUser;
        next();
      });

      appWithSession.use((req, res, next) => {
        res.render = jest.fn((view, data) => {
          res.status(200).send(`Rendered ${view} with ${JSON.stringify(data)}`);
        });
        next();
      });

      appWithSession.use('/tema', temaRouter);

      const response = await request(appWithSession)
        .get('/tema');

      expect(response.status).toBe(200);
      expect(response.text).toContain(`"usuario":${JSON.stringify(mockUser)}`);
    });
  });
});