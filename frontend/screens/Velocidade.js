import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

// Função para calcular a classificação
function calcularClassificacao(ocorrencias75, ocorrencias85, ocorrencias90, ocorrencias100) {
    let classificacao; 

    if (ocorrencias100 >= 1 || ocorrencias90 >= 5) {
        classificacao = "Condução muito perigosa";
    } else if (ocorrencias85 >= 5 || ocorrencias90 >= 4) {
        classificacao = "Condução agressiva";
    } else if (ocorrencias75 >= 5 || ocorrencias85 >= 4) {
        classificacao = "Condução moderada";
    } else {
        classificacao = "Condução segura";
    }

    return classificacao;
}

const Velocidade = () => {
  const route = useRoute();
  const [loading, setLoading] = useState(true);
  const [dados, setDados] = useState(null);
  const [error, setError] = useState(null);

  // Dados passados da tela da câmera
  const {
      userId,
      velocidade,
      maior_velocidade,
      cont_velocidade,
      horario_inicio,
      horario_termino,
      duracao,
      dadosGrafico,
      total_sono, // Recebe o total de alertas de sono
      total_dist, // Recebe o total de alertas de distração
  } = route.params;

  // Calcular ocorrências de velocidade
  const ocorrencias75 = dadosGrafico.filter((v) => v > 75).length;
  const ocorrencias85 = dadosGrafico.filter((v) => v > 85).length;
  const ocorrencias90 = dadosGrafico.filter((v) => v > 90).length;
  const ocorrencias100 = dadosGrafico.filter((v) => v > 100).length;

  // Calcular a classificação
  const classificacao = calcularClassificacao(ocorrencias75, ocorrencias85, ocorrencias90, ocorrencias100);

  // Salvar os dados no banco
  useEffect(() => {
      const salvarDados = async () => {
          try {
              const payload = {
                  user_id: userId,
                  velocidade: velocidade || 0,
                  duracao: duracao || 0,
                  maior_velocidade: maior_velocidade || 0,
                  cont_velocidade: cont_velocidade || 0,
                  total_sono: total_sono || 0, // Usa o valor de total_sono
                  total_dist: total_dist || 0, // Usa o valor de total_dist
                  media_orient: 0, // Exemplo, ajuste conforme necessário
                  classificacao,
                  horario_inicio: horario_inicio,
                  horario_termino: horario_termino,
                  data: new Date().toISOString().split('T')[0],
              };

              console.log('Payload enviado:', payload); // Log para depuração

              // Enviar dados para o backend
              const response = await axios.post('http://44.196.219.45:5000/salvar-velocidade', payload, {
                  timeout: 10000, // 10 segundos
              });
              console.log('Resposta do servidor:', response.data); // Log para depuração

              setDados(payload);
              setLoading(false);
          } catch (error) {
              console.error('Erro ao salvar os dados:', error);

              // Exibir detalhes do erro
              if (error.response) {
                  // Erro retornado pelo servidor
                  console.error('Resposta do servidor:', error.response.data);
                  console.error('Status do erro:', error.response.status);
                  setError(`Erro no servidor: ${error.response.data.message || error.response.status}`);
              } else if (error.request) {
                  // Erro de conexão
                  console.error('Erro de conexão:', error.request);
                  setError('Erro de conexão: Não foi possível se conectar ao servidor.');
              } else {
                  // Outros erros
                  console.error('Erro:', error.message);
                  setError(`Erro: ${error.message}`);
              }

              setLoading(false);
          }
      };

      salvarDados();
  }, []);

  if (loading) {
      return (
          <View style={styles.container}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text>Carregando...</Text>
          </View>
      );
  }

  if (error) {
      return (
          <View style={styles.container}>
              <Text style={styles.erro}>Erro: {error}</Text>
          </View>
      );
  }

  return (
      <View style={styles.container}>
          <Text style={styles.titulo}>Relatório de Velocidade</Text>
          <Text>Velocidade Média: {velocidade !== undefined && velocidade !== null ? velocidade.toFixed(2) : 'N/A'} km/h</Text>
          <Text>Maior Velocidade: {maior_velocidade !== undefined && maior_velocidade !== null ? maior_velocidade.toFixed(2) : 'N/A'} km/h</Text>
          <Text>Vezes acima de 90 km/h: {cont_velocidade}</Text>
          <Text>Duração da Corrida: {duracao} segundos</Text>
          <Text>Horário de Início: {horario_inicio}</Text>
          <Text>Horário de Término: {horario_termino}</Text>
          <Text>Total Sono: {total_sono}</Text>
          <Text>Total Distração: {total_dist}</Text>
          <Text>Classificação: {classificacao}</Text>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#f0f8ff',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
  },
  titulo: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
  },
  erro: {
      color: 'red',
      fontSize: 18,
      marginBottom: 20,
  },
});

export default Velocidade;