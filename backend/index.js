const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Configuração do banco de dados
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'amand',
    database: 'sistema_login',
};

// Middleware de erro global
app.use((err, req, res, next) => {
    console.error('Erro global:', err);
    res.status(500).json({ mensagem: 'Erro interno do servidor', detalhes: err.message });
});

// Rota de login
app.post('/login', async (req, res) => {
    const { user_id, senha } = req.body;
    console.log('Dados recebidos no login:', { user_id, senha });

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [results] = await connection.query('SELECT * FROM usuarios WHERE user_id = ?', [user_id]);

        if (results.length === 0) {
            console.log('Usuário não encontrado para user_id:', user_id);
            return res.status(400).json({ mensagem: 'Usuário não encontrado' });
        }

        const usuario = results[0];
        const senhaValida = senha === usuario.senha; // Comparação direta da senha (texto plano)

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
        if (connection) await connection.end();
    }
});

// Função para gerar o ID com prefixo e número inicial
const gerarId = async (tipo) => {
    const prefixo = tipo === 'admin' ? 'ADM' : 'USER';

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
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
        if (connection) await connection.end();
    }
};

app.post('/criar-usuario', async (req, res) => {
    const { senha, nome, tipo, email, dataNascimento, tipoCarteira, placaVeiculo } = req.body;

    // Formata a data no backend
    const dataNascimentoFormatada = new Date(dataNascimento).toISOString().split('T')[0];

    // Validação dos dados
    if (!senha || !nome || !tipo) {
        return res.status(400).json({ mensagem: 'Dados incompletos' });
    }

    let connection;
    try {
        const user_id = await gerarId(tipo); // Gera um ID único

        console.log('Dados recebidos para criar usuário:', { user_id, senha, nome, tipo, email, dataNascimentoFormatada, tipoCarteira, placaVeiculo });

        connection = await mysql.createConnection(dbConfig);
        await connection.query(
            'INSERT INTO usuarios (user_id, senha, nome, tipo, email, dataNascimento, tipoCarteira, placaVeiculo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [user_id, senha, nome, tipo, email, dataNascimentoFormatada, tipoCarteira, placaVeiculo]
        );

        console.log('Usuário criado com sucesso:', { user_id, nome, tipo });
        return res.status(201).json({ mensagem: 'Usuário criado com sucesso' });
    } catch (err) {
        console.error('Erro ao inserir usuário no banco de dados:', err);
        return res.status(500).json({ mensagem: 'Erro interno do servidor', detalhes: err.message });
    } finally {
        if (connection) await connection.end();
    }
});

// Rota para verificar se o user_id já existe
app.get('/verificar-id/:id', async (req, res) => {
    const { id } = req.params;

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [results] = await connection.query('SELECT COUNT(*) as count FROM usuarios WHERE user_id = ?', [id]);
        const exists = results[0].count > 0;

        console.log(`Verificando ID: ${id}, Existe: ${exists}`);
        return res.json({ exists });
    } catch (err) {
        console.error('Erro ao verificar ID existente:', err);
        return res.status(500).json({ mensagem: 'Erro interno do servidor', detalhes: err.message });
    } finally {
        if (connection) await connection.end();
    }
});

// Endpoint para buscar um usuário pelo ID
app.get('/usuario/:id', async (req, res) => {
    console.log('Requisição recebida em /usuario/:id');
    const { id } = req.params;
    console.log('ID do usuário:', id);

    const connection = await mysql.createConnection(dbConfig);
    try {
        const [results] = await connection.query('SELECT * FROM usuarios WHERE user_id = ?', [id]);
        if (results.length === 0) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }
        res.json(results[0]); // Retorna o primeiro usuário encontrado
    } catch (err) {
        console.error('Erro ao buscar usuário:', err);
        res.status(500).json({ mensagem: 'Erro interno do servidor', detalhes: err.message });
    } finally {
        connection.end();
    }
});

// Rota para buscar o último ID com base no tipo
app.get('/ultimo-id/:tipo', async (req, res) => {
    const { tipo } = req.params;
    const prefixo = tipo === 'admin' ? 'ADM' : 'USER';

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
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
        if (connection) await connection.end();
    }
});

// Rota para buscar usuários
app.get('/usuarios', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Conexão com o banco de dados estabelecida.');

        const [results] = await connection.query(
            'SELECT user_id, nome FROM usuarios WHERE tipo = ?',
            ['user']
        );

        console.log('Resultados da query:', results);

        if (results.length === 0) {
            console.log('Nenhum usuário encontrado.');
            return res.status(404).json({ mensagem: 'Nenhum usuário encontrado' });
        }

        res.json(results);
    } catch (err) {
        console.error('Erro ao buscar usuários:', err);
        res.status(500).json({ mensagem: 'Erro interno do servidor', detalhes: err.message });
    } finally {
        if (connection) await connection.end();
    }
});


app.put('/atualizar-usuario/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email, dataNascimento, tipoCarteira, placaVeiculo, senha } = req.body;

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.query(
            'UPDATE usuarios SET nome = ?, email = ?, dataNascimento = ?, tipoCarteira = ?, placaVeiculo = ?, senha = ? WHERE user_id = ?',
            [nome, email, dataNascimento, tipoCarteira, placaVeiculo, senha, id]
        );
        res.json({ mensagem: 'Usuário atualizado com sucesso' });
    } catch (err) {
        console.error('Erro ao atualizar usuário:', err);
        res.status(500).json({ mensagem: 'Erro interno do servidor', detalhes: err.message });
    } finally {
        if (connection) await connection.end();
    }
});


app.delete('/deletar-usuario/:id', async (req, res) => {
    const { id } = req.params;

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        // Executa a query para deletar o usuário
        const [results] = await connection.query('DELETE FROM usuarios WHERE user_id = ?', [id]);

        // Verifica se algum registro foi afetado
        if (results.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }

        res.json({ mensagem: 'Usuário deletado com sucesso' });
    } catch (err) {
        console.error('Erro ao deletar usuário:', err);
        res.status(500).json({ mensagem: 'Erro interno do servidor', detalhes: err.message });
    } finally {
        if (connection) await connection.end();
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});