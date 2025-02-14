// HomeUSER.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HomeUSER = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="menu" size={30} color="#fff" />
        <Text style={styles.headerText}>Iniciar Viagem</Text>
      </View>

      {/* Minhas Viagens */}
      <View style={styles.tripsContainer}>
        <Text style={styles.tripsTitle}>Minhas Viagens</Text>
        <View style={styles.monthsContainer}>
          <Text style={styles.month}>Outubro</Text>
          <Text style={styles.month}>Novembro</Text>
          <Text style={styles.month}>Dezembro</Text>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.date}>17</Text>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Tempo:</Text>
          <Text style={styles.statValue}>00:32:45</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Distância:</Text>
          <Text style={styles.statValue}>5.14 km</Text>
        </View>
      </View>

      {/* Sonolência & Velocidade */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Sonolência:</Text>
          <Text style={styles.statValue}>23,3%</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Velocidade:</Text>
          <Text style={styles.statValue}>54,27%</Text>
        </View>
      </View>

      {/* General Section */}
      <View style={styles.generalContainer}>
        <Text style={styles.generalText}>Comportamento Perigoso</Text>
      </View>

      {/* Start Trip Button */}
      <TouchableOpacity style={styles.startButton}>
        <Ionicons name="play" size={50} color="#fff" />
        <Text style={styles.startButtonText}>Iniciar Viagem</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
  },
  tripsContainer: {
    marginTop: 30,
  },
  tripsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  monthsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  month: {
    marginRight: 10,
    fontSize: 16,
    color: '#1E90FF',
  },
  dateContainer: {
    marginTop: 20,
  },
  date: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1E90FF',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  statBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 16,
    color: '#000',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E90FF',
  },
  generalContainer: {
    marginTop: 30,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  generalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF4500',
  },
  startButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
});

export default HomeUSER;

