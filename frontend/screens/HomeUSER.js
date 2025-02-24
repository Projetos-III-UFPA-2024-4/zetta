import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const HomeUSER = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Iniciar Viagem</Text>

      <TouchableOpacity style={styles.button} onPress={() => alert('Comportamento Perigoso')}>
        <Text style={styles.buttonText}>Comportamento Perigoso</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.startButtonText}>Iniciar Viagem</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statsContainer: {
    marginBottom: 30,
  },
  statText: {
    fontSize: 18,
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  startButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default HomeUSER;