// IA_USER.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const IA_USER = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Análise da IA</Text>
      </View>

      {/* Gráfico de Sonolência */}
      <View style={styles.graphContainer}>
        <Text style={styles.graphTitle}>Sonolência</Text>
        <Text style={styles.graphDescription}>
          O gráfico mostra os horários de viagem e os momentos em que você se sentiu mais sono.
        </Text>
        {/* Placeholder para o gráfico */}
        <View style={styles.graph}>
          <Text>Gráfico de Sonolência</Text>
        </View>
      </View>

      {/* Pontos a melhorar */}
      <View style={styles.pointsContainer}>
        <Text style={styles.pointsTitle}>Pontos a melhorar</Text>
        <Text style={styles.pointsText}>• Aumentar o uso do cinto de segurança</Text>
        <Text style={styles.pointsText}>• Evitar dirigir entre os horários ****</Text>
      </View>

      {/* Geral */}
      <View style={styles.generalContainer}>
        <Text style={styles.generalTitle}>Geral</Text>
        <Text style={styles.generalText}>• Condução imprudente</Text>
      </View>

      {/* Botão de navegação para voltar */}
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
    marginVertical: 10,
  },
  graph: {
    backgroundColor: '#e0e0e0',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsContainer: {
    backgroundColor: '#e6f7ff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  pointsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pointsText: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  generalContainer: {
    backgroundColor: '#d9f7be',
    borderRadius: 10,
    padding: 15,
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

export default IA_USER;

