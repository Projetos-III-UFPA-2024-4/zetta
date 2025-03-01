const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'çLipe13976302ç',
    database: 'sistema_login',
};

// Rota de login
app.post('/login', async (req, res) => {
    const { user_id, senha } = req.body;
    console.log('Dados recebidos no login:', { user_id, senha });

    const connection = await mysql.createConnection(dbConfig);
    try {
        const [results] = await connection.query('SELECT * FROM usuarios WHERE user_id = ?', [user_id]);

        if (results.length === 0) {
            console.log('Usuário não encontrado para user_id:', user_id);
            return res.status(400).json({ mensagem: 'Usuário não encontrado' });
        }

        const usuario = results[0];
        const senhaValida = senha === usuario.senha; // Comparação direta da senha

        if (!senhaValida) {
            console.log('Senha incorreta para user_id:', user_id);
            return res.status(400).json({ mensagem: 'Senha incorreta' });
        }

        console.log('Login realizado com sucesso para user_id:', user_id);
        return res.json({
            mensagem: 'Login realizado com sucesso!',
            redirectTo: usuario.tipo === 'admin' ? '/HomeADM' : '/HomeUSER',
            tipo: usuario.tipo,
            nome: usuario.nome,
        });
    } catch (err) {
        console.error('Erro ao processar login:', err);
        return res.status(500).json({ mensagem: 'Erro interno do servidor', detalhes: err.message });
    } finally {
        connection.end();
    }
});

// Função para gerar o ID com prefixo e número inicial
const gerarId = async (tipo) => {
    const prefixo = tipo === 'admin' ? 'ADM' : 'USER';

    const connection = await mysql.createConnection(dbConfig);
    try {
        const [results] = await connection.query(
            'SELECT MAX(user_id) as ultimoId FROM usuarios WHERE user_id LIKE ?',
            [`${prefixo}%`]
        );

        const ultimoId = results[0].ultimoId || `${prefixo}0`; // Se não existir, retorna um ID padrão
        const ultimoNumero = parseInt(ultimoId.replace(prefixo, ''), 10);
        const novoNumero = ultimoNumero + 1;

        return `${prefixo}${novoNumero}`;
    } catch (err) {
        console.error('Erro ao gerar ID:', err);
        throw err; // Propaga o erro
    } finally {
        connection.end();
    }
};

app.post('/criar-usuario', async (req, res) => {
    const { senha, nome, tipo } = req.body;

    // Validação dos dados
    if (!senha || !nome || !tipo) {
        return res.status(400).json({ mensagem: 'Dados incompletos' });
    }

    try {
        const user_id = await gerarId(tipo); // Gera um ID único
        console.log('Dados recebidos para criar usuário:', { user_id, senha, nome, tipo });

        const connection = await mysql.createConnection(dbConfig);
        await connection.query(
            'INSERT INTO usuarios (user_id, senha, nome, tipo) VALUES (?, ?, ?, ?)',
            [user_id, senha, nome, tipo] // Armazena a senha sem criptografia
        );

        console.log('Usuário criado com sucesso:', { user_id, nome, tipo });
        return res.status(201).json({ mensagem: 'Usuário criado com sucesso' });
    } catch (err) {
        console.error('Erro ao inserir usuário no banco de dados:', err);
        return res.status(500).json({ mensagem: 'Erro interno do servidor', detalhes: err.message });
    }
});

// Rota para verificar se o user_id já existe
app.get('/verificar-id/:id', async (req, res) => {
    const { id } = req.params;

    const connection = await mysql.createConnection(dbConfig);
    try {
        const [results] = await connection.query('SELECT COUNT(*) as count FROM usuarios WHERE user_id = ?', [id]);
        const exists = results[0].count > 0;

        console.log(`Verificando ID: ${id}, Existe: ${exists}`);
        return res.json({ exists });
    } catch (err) {
        console.error('Erro ao verificar ID existente:', err);
        return res.status(500).json({ mensagem: 'Erro interno do servidor', detalhes: err.message });
    } finally {
        connection.end();
    }
});

// Rota para buscar o último ID com base no tipo
app.get('/ultimo-id/:tipo', async (req, res) => {
    const { tipo } = req.params;
    const prefixo = tipo === 'admin' ? 'ADM' : 'USER';

    const connection = await mysql.createConnection(dbConfig);
    try {
        const [results] = await connection.query(
            'SELECT MAX(user_id) as ultimoId FROM usuarios WHERE user_id LIKE ?',
            [`${prefixo}%`]
        );

        const ultimoId = results[0].ultimoId || `${prefixo}0`; // Se não existir, retorna um ID padrão
        return res.json({ ultimoId });
    } catch (err) {
        console.error('Erro ao buscar último ID salvo:', err);
        return res.status(500).json({ mensagem: 'Erro interno do servidor', detalhes: err.message });
    } finally {
        connection.end();
    }
});

// Rota para buscar todos os usuários
app.get('/usuarios', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [results] = await connection.query('SELECT user_id, nome FROM usuarios');
        res.json(results); // Retorna a lista de usuários
    } catch (err) {
        console.error('Erro ao buscar usuários:', err);
        res.status(500).json({ mensagem: 'Erro interno do servidor', detalhes: err.message });
    } finally {
        connection.end();
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});