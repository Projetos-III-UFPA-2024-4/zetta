// Importar dependências
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');

// Criar a instância do Express
const app = express();

// Usar JSON e CORS
app.use(express.json());
app.use(cors());

// Configuração do banco de dados
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Seu usuário do MySQL
  password: 'amand',  // Sua senha do MySQL
  database: 'sistema_login',  // Nome do banco de dados
});

// Conectar ao banco de dados
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    throw err;
  }
  console.log('Conectado ao banco de dados MySQL');
});

// Rota de login
app.post('/login', (req, res) => {
  const { user_id, senha } = req.body;
  console.log('Dados recebidos no login:', { user_id, senha });

  const query = 'SELECT * FROM usuarios WHERE user_id = ?';
  db.query(query, [user_id], async (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuário no banco de dados:', err);
      return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }

    if (results.length === 0) {
      console.log('Usuário não encontrado para user_id:', user_id);
      return res.status(400).json({ mensagem: 'Usuário não encontrado' });
    }

    const usuario = results[0];
    console.log('Usuário encontrado:', usuario);

    // Comparar a senha recebida com a senha criptografada
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    console.log('Senha válida?', senhaValida);

    if (!senhaValida) {
      console.log('Senha incorreta para user_id:', user_id);
      return res.status(400).json({ mensagem: 'Senha incorreta' });
    }

    // Retornar informações do usuário e a rota de redirecionamento
    console.log('Login realizado com sucesso para user_id:', user_id);
    return res.json({
      mensagem: 'Login realizado com sucesso!',
      redirectTo: usuario.tipo === 'admin' ? '/HomeADM' : '/HomeUSER',
      tipo: usuario.tipo, // Retorna o tipo de usuário
      nome: usuario.nome, // Retorna o nome do usuário
    });
  });
});

// Rota de criação de usuário (para cadastrar usuários com senha criptografada)
app.post('/criar-usuario', async (req, res) => {
  const { user_id, senha, nome, tipo } = req.body;
  console.log('Dados recebidos para criar usuário:', { user_id, senha, nome, tipo });

  // Verificar se o usuário já existe
  const checkUserQuery = 'SELECT * FROM usuarios WHERE user_id = ?';
  db.query(checkUserQuery, [user_id], async (err, results) => {
    if (err) {
      console.error('Erro ao verificar se o usuário já existe:', err);
      return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }

    if (results.length > 0) {
      console.log('Usuário já existe para user_id:', user_id);
      return res.status(400).json({ mensagem: 'Usuário já existe' });
    }

    // Criptografando a senha
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    console.log('Senha criptografada com sucesso');

    // Inserindo o novo usuário no banco com a senha criptografada
    const insertQuery = 'INSERT INTO usuarios (user_id, senha, nome, tipo) VALUES (?, ?, ?, ?)';
    db.query(insertQuery, [user_id, senhaCriptografada, nome, tipo], (err, results) => {
      if (err) {
        console.error('Erro ao inserir usuário no banco de dados:', err);
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
      }
      console.log('Usuário criado com sucesso:', { user_id, nome, tipo });
      return res.status(201).json({ mensagem: 'Usuário criado com sucesso' });
    });
  });
});

// Rota para listar todos os usuários (opcional, para fins de teste)
app.get('/usuarios', (req, res) => {
  console.log('Listando todos os usuários');
  const query = 'SELECT user_id, nome, tipo FROM usuarios';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao listar usuários:', err);
      return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
    console.log('Usuários listados com sucesso');
    return res.json(results);
  });
});

// Iniciar o servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});