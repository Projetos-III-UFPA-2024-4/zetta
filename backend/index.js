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

const gerarId = async (tipo) => {
  const prefixo = tipo === 'admin' ? 'ADM' : 'USER';

  let connection;
  try {
      connection = await mysql.createConnection(dbConfig);

      // Busca o último ID do tipo especificado
      const [results] = await connection.query(
          `SELECT user_id FROM usuarios WHERE tipo = ? AND user_id LIKE ? ORDER BY CAST(SUBSTRING(user_id, 5) AS UNSIGNED) DESC LIMIT 1`,
          [tipo, `${prefixo}%`]
      );

      const ultimoId = results.length > 0 ? results[0].user_id : `${prefixo}0`; // Se não existir, retorna um ID padrão
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
    const { senha, nome, tipo, emailOuNumero, dataNascimento, tipoCarteira, placaVeiculo } = req.body;

    // Formata a data no backend
    const dataNascimentoFormatada = new Date(dataNascimento).toISOString().split('T')[0];

    // Validação dos dados
    if (!senha || !nome || !tipo) {
        return res.status(400).json({ mensagem: 'Dados incompletos' });
    }

    let connection;
    try {
        const user_id = await gerarId(tipo); // Gera um ID único

        console.log('Dados recebidos para criar usuário:', { user_id, senha, nome, tipo, emailOuNumero, dataNascimentoFormatada, tipoCarteira, placaVeiculo });

        connection = await mysql.createConnection(dbConfig);
        await connection.query(
            'INSERT INTO usuarios (user_id, senha, nome, tipo, emailOuNumero, dataNascimento, tipoCarteira, placaVeiculo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [user_id, senha, nome, tipo, emailOuNumero, dataNascimentoFormatada, tipoCarteira, placaVeiculo]
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

app.get('/ultimo-id/:tipo', async (req, res) => {
  const { tipo } = req.params;
  const prefixo = tipo === 'admin' ? 'ADM' : 'USER';

  let connection;
  try {
      connection = await mysql.createConnection(dbConfig);

      // Query corrigida
      const [results] = await connection.query(
          `SELECT user_id FROM usuarios WHERE tipo = ? AND user_id LIKE ? ORDER BY CAST(SUBSTRING(user_id, 5) AS UNSIGNED) DESC LIMIT 1`,
          [tipo, `${prefixo}%`]
      );

      const ultimoId = results.length > 0 ? results[0].user_id : `${prefixo}0`; // Se não existir, retorna um ID padrão
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
  const { nome, emailOuNumero, dataNascimento, tipoCarteira, placaVeiculo, senha } = req.body;

  let connection;
  try {
      // Formatar a data no formato YYYY-MM-DD
      const dataNascimentoFormatada = new Date(dataNascimento).toISOString().split('T')[0];

      console.log('Data formatada:', dataNascimentoFormatada); // Debugging

      connection = await mysql.createConnection(dbConfig);
      await connection.query(
          'UPDATE usuarios SET nome = ?, emailOuNumero = ?, dataNascimento = ?, tipoCarteira = ?, placaVeiculo = ?, senha = ? WHERE user_id = ?',
          [nome, emailOuNumero, dataNascimentoFormatada, tipoCarteira, placaVeiculo, senha, id]
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


app.post('/salvar-velocidade', async (req, res) => {
  const {
    user_id,
    velocidade,
    duracao,
    maior_velocidade,
    cont_velocidade,
    total_sono,
    total_dist,
    media_orient,
    classificacao,
    horario_inicio,
    horario_termino,
    data,
  } = req.body;

  // Verificação de dados obrigatórios
  if (!user_id || !duracao || !data || !horario_inicio || !horario_termino) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando: user_id, duracao, data, horario_inicio, horario_termino.' });
  }

  // Se a velocidade for negativa, substitua por 0
  const velocidadeFinal = velocidade < 0 ? 0 : velocidade;
  console.log('Velocidade corrigida:', velocidadeFinal);

  // Se cont_velocidade, total_sono, total_dist ou media_orient não forem fornecidos, define como 0
  const contVelocidadeFinal = cont_velocidade === undefined ? 0 : cont_velocidade;
  const totalSonoFinal = total_sono === undefined ? 0 : total_sono;
  const totalDistFinal = total_dist === undefined ? 0 : total_dist;
  const mediaOrientFinal = media_orient === undefined ? 0 : media_orient;

  // Função para converter datas ISO 8601 para o formato MySQL (YYYY-MM-DD HH:MM:SS)
  const converterDataParaMySQL = (dataISO) => {
    const data = new Date(dataISO);
    const ano = data.getUTCFullYear();
    const mes = String(data.getUTCMonth() + 1).padStart(2, '0'); // Mês começa em 0
    const dia = String(data.getUTCDate()).padStart(2, '0');
    const horas = String(data.getUTCHours()).padStart(2, '0');
    const minutos = String(data.getUTCMinutes()).padStart(2, '0');
    const segundos = String(data.getUTCSeconds()).padStart(2, '0');
    return `${ano}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
  };

  // Converte as datas para o formato MySQL
  const horarioInicioMySQL = converterDataParaMySQL(horario_inicio);
  const horarioTerminoMySQL = converterDataParaMySQL(horario_termino);

  let connection;
  try {
    // Cria uma nova conexão
    connection = await mysql.createConnection(dbConfig);

    const query = `
      INSERT INTO corridas (
        user_id,
        velocidade,
        duracao,
        maior_velocidade,
        cont_velocidade,
        total_sono,
        total_dist,
        media_orient,
        classificacao,
        horario_inicio,
        horario_termino,
        data,
        timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    // Executa a query com os valores corrigidos
    const [results] = await connection.execute(query, [
      user_id,
      velocidadeFinal,
      duracao,
      maior_velocidade || 0, // Valor padrão caso seja undefined
      contVelocidadeFinal,
      totalSonoFinal,
      totalDistFinal,
      mediaOrientFinal,
      classificacao || 'Condução segura', // Valor padrão caso não seja fornecido
      horarioInicioMySQL, // Data no formato MySQL
      horarioTerminoMySQL, // Data no formato MySQL
      data,
    ]);

    console.log('Dados salvos com sucesso!', results);
    res.status(200).send('Dados salvos com sucesso!');
  } catch (err) {
    console.error('Erro ao salvar dados:', err);
    res.status(500).json({ error: 'Erro ao salvar dados', details: err.message }); // Retorna detalhes do erro
  } finally {
    // Fecha a conexão após o uso
    if (connection) await connection.end();
  }
});

app.get('/historico-viagens', async (req, res) => {
  const { user_id } = req.query; // Recebe o user_id como parâmetro de query

  if (!user_id) {
    return res.status(400).json({ mensagem: 'user_id não fornecido' });
  }

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    // Busca os dados da tabela corridas filtrados pelo user_id
    const [results] = await connection.query(
      `SELECT 
        data, 
        velocidade AS velocidadeMedia, 
        duracao, 
        maior_velocidade AS maiorVelocidade, 
        cont_velocidade AS vezesAcimaLimite,
        total_sono,
        total_dist,
        media_orient,
        horario_inicio,
        horario_termino,
        classificacao
      FROM corridas
      WHERE user_id = ?
      ORDER BY data DESC`,
      [user_id] // Passa o user_id como parâmetro para a query
    );

    res.json(results);
  } catch (err) {
    console.error('Erro ao buscar histórico de viagens:', err);
    res.status(500).json({ mensagem: 'Erro interno do servidor', detalhes: err.message });
  } finally {
    if (connection) await connection.end();
  }
});

  app.get('/ultima-corrida/:user_id', async (req, res) => {
    const { user_id } = req.params;
    console.log(`Buscando última corrida para o user_id: ${user_id}`);
  
    let connection;
    try {
      // Cria uma nova conexão com o banco de dados
      connection = await mysql.createConnection(dbConfig);
  
      // Query para buscar a última corrida com base no timestamp
      const query = `
        SELECT data, velocidade, duracao, maior_velocidade, cont_velocidade, classificacao
        FROM corridas
        WHERE user_id = ?
        ORDER BY timestamp DESC
        LIMIT 1;
      `;
  
      console.log('Executando query:', query);
      const [results] = await connection.query(query, [user_id]);
      console.log('Resultado da query:', results);
  
      if (results.length > 0) {
        const ultimaCorrida = results[0];
  
        // Verifica e fornece valores padrão para campos ausentes ou nulos
        const velocidade = ultimaCorrida.velocidade || 0;
        const maiorVelocidade = ultimaCorrida.maior_velocidade || 0;
        const classificacao = ultimaCorrida.classificacao || 'N/A'; // Valor padrão caso não exista
  
        // Formata os valores numéricos
        const resposta = {
          data: ultimaCorrida.data,
          velocidade: parseFloat(velocidade).toFixed(2), // Converte para número e formata para 2 casas decimais
          duracao: ultimaCorrida.duracao,
          maior_velocidade: parseFloat(maiorVelocidade).toFixed(2), // Converte para número e formata para 2 casas decimais
          cont_velocidade: ultimaCorrida.cont_velocidade || 0,
          classificacao: classificacao, // Adiciona o campo de classificação
        };
  
        res.json(resposta);
      } else {
        console.log('Nenhuma corrida encontrada para o user_id:', user_id);
        res.status(404).json({ error: 'Nenhuma corrida encontrada' });
      }
    } catch (error) {
      console.error('Erro ao buscar última corrida:', error);
      res.status(500).json({ error: 'Erro interno do servidor', detalhes: error.message });
    } finally {
      // Fecha a conexão após o uso
      if (connection) await connection.end();
    }
  });
  
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
