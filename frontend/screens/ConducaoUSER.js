// ConducaoUSER.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ProgressBar } from 'react-native-progress';
import { PieChart } from 'react-native-svg-charts';
import { Ionicons } from '@expo/vector-icons';

const ConducaoUSER = () => {
  // Dados fictícios para o gráfico de pizza
  const pieData = [
    { key: 1, value: 50, svg: { fill: '#1e90ff' }, arc: { outerRadius: '90%', cornerRadius: 0 } },
    { key: 2, value: 30, svg: { fill: '#ff6347' }, arc: { outerRadius: '90%', cornerRadius: 0 } },
    { key: 3, value: 20, svg: { fill: '#32cd32' }, arc: { outerRadius: '90%', cornerRadius: 0 } },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Análise da Condução</Text>
      </View>

      {/* Geral */}
      <View style={styles.generalContainer}>
        <Text style={styles.generalTitle}>Geral</Text>
        <Text style={styles.generalText}>Número de viagens: **</Text>
        <Text style={styles.generalText}>Média percorrida: ** km</Text>
        <Text style={styles.generalText}>Velocidade média: **</Text>
        <Text style={styles.generalText}>Tempo médio das viagens: **</Text>
      </View>

      {/* Gráfico de Pizza */}
      <View style={styles.graphContainer}>
        <Text style={styles.graphTitle}>Frequências bruscas</Text>
        <PieChart style={{ height: 200 }} data={pieData} />
        <Text style={styles.graphDescription}>Acelerações abruptas: **</Text>
        <Text style={styles.graphDescription}>Acima do limite: **</Text>
      </View>

      {/* Condução */}
      <View style={styles.conductionContainer}>
        <Text style={styles.conductionTitle}>Condução</Text>
        <Text style={styles.conductionText}>Agressividade</Text>
        <ProgressBar progress={0.7} width={null} color={'#1e90ff'} style={styles.progressBar} />
        <Text style={styles.conductionText}>Excesso de velocidade</Text>
        <ProgressBar progress={0.5} width={null} color={'#ff6347'} style={styles.progressBar} />
        <Text style={styles.conductionText}>Estresse</Text>
        <ProgressBar progress={0.3} width={null} color={'#32cd32'} style={styles.progressBar} />
        <Text style={styles.conductionText}>Estilo de condução: Agressivo</Text>
      </View>

      {/* Pior Viagem */}
      <View style={styles.tripContainer}>
        <Text style={styles.tripTitle}>Pior Viagem</Text>
        <Text style={styles.tripText}>Dia: **/**/****</Text>
        <Text style={styles.tripText}>Tempo: **:**:**</Text>
      </View>

      {/* Melhor Viagem */}
      <View style={styles.tripContainer}>
        <Text style={styles.tripTitle}>Melhor Viagem</Text>
        <Text style={styles.tripText}>Dia: **/**/****</Text>
        <Text style={styles.tripText}>Tempo: **:**:**</Text>
      </View>

      {/* Botão de Voltar */}
      <View style={styles.backButtonContainer}>
        <Ionicons name="arrow-back" size={30} color="#fff" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f6f9',
    padding: 15,
  },
  header: {
    backgroundColor: '#1e90ff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  generalContainer: {
    backgroundColor: '#e6f7ff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  generalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  generalText: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  graphContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  graphDescription: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  conductionContainer: {
    backgroundColor: '#d9f7be',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  conductionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  conductionText: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  progressBar: {
    marginTop: 10,
    marginBottom: 10,
  },
  tripContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tripText: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  backButtonContainer: {
    backgroundColor: '#1e90ff',
    borderRadius: 50,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    position: 'absolute',
    left: 20,
    top: 20,
  },
});

export default ConducaoUSER;
