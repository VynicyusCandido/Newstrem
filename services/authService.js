const fs = require('fs');
const caminho = require('path');

const caminhoDB = caminho.join(__dirname, '../data/db.json');

function buscarPorCredenciais(usuario, senha) {
  try {

    if (!fs.existsSync(caminhoDB)) {
      console.error('Arquivo db.json não encontrado em:', caminhoDB);

      const dadosPadrao = {
        usuarios: [
          {
            id: 1,
            usuario: "admin",
            senha: "admin123",
            email: "admin@exemplo.com"
          },
          {
            id: 2,
            usuario: "usuario",
            senha: "usuario123",
            email: "usuario@exemplo.com"
          }
        ]
      };
      
      return dadosPadrao.usuarios.find(u => 
        u.usuario === usuario && 
        u.senha === senha
      );
    }

    const bancoDados = JSON.parse(fs.readFileSync(caminhoDB, 'utf8'));
    console.log('Banco de dados carregado:', bancoDados);
    
    const usuarioEncontrado = bancoDados.usuarios.find(u => 
      u.usuario === usuario && 
      u.senha === senha
    );
    
    console.log('Usuário encontrado:', usuarioEncontrado);
    return usuarioEncontrado;
    
  } catch (erro) {
    console.error('Erro ao ler banco de dados:', erro);
    return null;
  }
}

module.exports = {
  buscarPorCredenciais
};