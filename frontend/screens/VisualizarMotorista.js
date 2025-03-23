import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

const VisualizarMotorista = () => {
  const [historico, setHistorico] = useState([]);
  const [filtro, setFiltro] = useState(''); // Estado para o termo de pesquisa
  const route = useRoute();
  const { userId } = route.params;

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        const response = await axios.get(`http://44.196.219.45:5000/historico-viagens?user_id=${userId}`);
        console.log('Resposta da API:', response.data); // Verifique os dados retornados
        setHistorico(response.data);
      } catch (error) {
        console.error('Erro ao buscar histórico:', error);
      }
    };

    if (userId) {
      fetchHistorico();
    }
  }, [userId]);

  // Função para formatar a data no formato brasileiro (dd/MM/yyyy)
  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' }); // Usar UTC para evitar discrepâncias
  };

  // Função para extrair o horário (HH:MM:SS) de uma string ISO 8601
  const formatarHorario = (dataString) => {
    if (!dataString) return 'N/A'; // Caso o horário seja nulo ou indefinido

    const data = new Date(dataString);
    const horas = String(data.getUTCHours()).padStart(2, '0'); // Usar UTC para evitar discrepâncias
    const minutos = String(data.getUTCMinutes()).padStart(2, '0');
    const segundos = String(data.getUTCSeconds()).padStart(2, '0');

    return `${horas}:${minutos}:${segundos}`;
  };

  const converterSegundosParaHoras = (segundos) => {
    const horas = segundos / 3600;
    return horas.toFixed(2);
  };

  // Função para filtrar os dados com base no termo de pesquisa
  const filtrarDados = (termo) => {
    return historico.filter((item) => {
      const termoLowerCase = termo.toLowerCase();

      // Verifica se o termo de pesquisa está presente em qualquer campo
      return (
        formatarData(item.data).toLowerCase().includes(termoLowerCase) || // Data
        (item.velocidadeMedia?.toString() || '').toLowerCase().includes(termoLowerCase) || // Velocidade Média
        (item.maiorVelocidade?.toString() || '').toLowerCase().includes(termoLowerCase) || // Maior Velocidade
        (item.vezesAcimaLimite?.toString() || '').toLowerCase().includes(termoLowerCase) || // Vezes acima de 90 km/h
        (item.total_sono?.toString() || '').toLowerCase().includes(termoLowerCase) || // Total Sono
        (item.total_dist?.toString() || '').toLowerCase().includes(termoLowerCase) || // Total Distração
        (item.classificacao?.toLowerCase() || '').includes(termoLowerCase) || // Classificação
        formatarHorario(item.horario_inicio).toLowerCase().includes(termoLowerCase) || // Horário Início
        formatarHorario(item.horario_termino).toLowerCase().includes(termoLowerCase) // Horário Término
      );
    });
  };

  // Dados filtrados
  const dadosFiltrados = filtro ? filtrarDados(filtro) : historico;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Histórico de viagens</Text>

      {/* Campo de pesquisa geral */}
      <TextInput
        style={styles.input}
        placeholder="Pesquisar corrida..."
        value={filtro}
        onChangeText={setFiltro}
      />

      {dadosFiltrados.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.data}>{formatarData(item.data)}</Text>

          <View style={styles.metricas}>
            <View style={styles.metricaItem}>
              <Text style={styles.metricaTitulo}>Velocidade Média</Text>
              <Text style={styles.metricaValor}>
                {item.velocidadeMedia ? item.velocidadeMedia.toFixed(2) : '0.00'} km/h
              </Text>
            </View>

            <View style={styles.metricaItem}>
              <Text style={styles.metricaTitulo}>Duração</Text>
              <Text style={styles.metricaValor}>{converterSegundosParaHoras(item.duracao)} horas</Text>
            </View>

            <View style={styles.metricaItem}>
              <Text style={styles.metricaTitulo}>Maior Velocidade</Text>
              <Text style={styles.metricaValor}>
                {item.maiorVelocidade ? item.maiorVelocidade.toFixed(2) : '0.00'} km/h
              </Text>
            </View>

            <View style={styles.metricaItem}>
              <Text style={styles.metricaTitulo}>Excesso de Velocidade</Text>
              <Text style={styles.metricaValor}>{item.vezesAcimaLimite || 0}</Text>
            </View>

            <View style={styles.metricaItem}>
              <Text style={styles.metricaTitulo}>Sonolência</Text>
              <Text style={styles.metricaValor}>{item.total_sono || 0}</Text>
            </View>

            <View style={styles.metricaItem}>
              <Text style={styles.metricaTitulo}>Distração</Text>
              <Text style={styles.metricaValor}>{item.total_dist || 0}</Text>
            </View>

            <View style={styles.metricaItem}>
              <Text style={styles.metricaTitulo}>Horário Início</Text>
              <Text style={styles.metricaValor}>
                {formatarHorario(item.horario_inicio)}
              </Text>
            </View>

            <View style={styles.metricaItem}>
              <Text style={styles.metricaTitulo}>Horário Término</Text>
              <Text style={styles.metricaValor}>
                {formatarHorario(item.horario_termino)}
              </Text>
            </View>

            <View style={styles.metricaItem}>
              <Text style={styles.metricaTitulo}>Classificação</Text>
              <Text style={styles.metricaValor}>{item.classificacao || 'N/A'}</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

// Estilos (mantenha os mesmos estilos)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#042B3D',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  input: {
    borderColor: 'gray',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    height: 40,
    width: '100%',
    borderRadius: 20,
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: '#8BC9DD',
    borderBottomLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 16,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  data: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  metricas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  metricaItem: {
    alignItems: 'center',
    flexBasis: '48%',
    marginBottom: 10,
  },
  metricaTitulo: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  metricaValor: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
});

export default VisualizarMotorista;