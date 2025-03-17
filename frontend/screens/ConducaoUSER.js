import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const ConducaoUSER = () => {
  // Dados fictícios
  const dados = {
    numeroViagens: 23,
    mediaPercorrida: 48,
    velocidadeMedia: '38 km/h',
    tempoMedio: '45 min',
    agressividade: 72,
    exercicioVelocidade: 65,
    estrutura: 88,
    piorViagem: {
      data: '15/03/2024',
      tempo: '18:34'
    },
    melhorViagem: {
      data: '22/03/2024',
      tempo: '09:12'
    }
  };

  const BarraProgresso = ({ valor, cor }) => (
    <View style={styles.barraContainer}>
      <View style={[styles.barra, { width: `${valor}%`, backgroundColor: cor }]} />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.cardHeader}>
        <Text style={styles.tituloPrincipal}>Análise da Condução</Text>
        <Text style={styles.subtituloHeader}>
          Obtenha a análise realizada através de cálculos baseados no seu estilo de condução
        </Text>
      </View>

      {/* Seção Geral */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Geral</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Número de viagens</Text>
            <Text style={styles.value}>{dados.numeroViagens}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Média percorrida</Text>
            <Text style={styles.value}>{dados.mediaPercorrida} km</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Velocidade média</Text>
            <Text style={styles.value}>{dados.velocidadeMedia}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Tempo médio</Text>
            <Text style={styles.value}>{dados.tempoMedio}</Text>
          </View>
        </View>
      </View>

      {/* Seção Condução */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Condução</Text>
        <View style={styles.metrica}>
          <Text style={styles.label}>Agressividade</Text>
          <BarraProgresso valor={dados.agressividade} cor="#ff4444" />
        </View>
        <View style={styles.metrica}>
          <Text style={styles.label}>Exercício de velocidade</Text>
          <BarraProgresso valor={dados.exercicioVelocidade} cor="#ffbb33" />
        </View>
        <View style={styles.metrica}>
          <Text style={styles.label}>Estrutura</Text>
          <BarraProgresso valor={dados.estrutura} cor="#00C851" />
        </View>
        
        <View style={styles.tag}>
          <Text style={styles.tagText}>Estilo de condução: Agressivo</Text>
        </View>
      </View>

      {/* Viagens */}
      <View style={styles.horizontalContainer}>
        <View style={[styles.card, styles.halfCard]}>
          <Text style={styles.cardTitleRed}>Pior Viagem</Text>
          <Text style={styles.label}>Dia: {dados.piorViagem.data}</Text>
          <Text style={styles.label}>Hora: {dados.piorViagem.tempo}</Text>
        </View>

        <View style={[styles.card, styles.halfCard]}>
          <Text style={styles.cardTitleGreen}>Melhor Viagem</Text>
          <Text style={styles.label}>Dia: {dados.melhorViagem.data}</Text>
          <Text style={styles.label}>Hora: {dados.melhorViagem.tempo}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f2f6f9',
  },
  cardHeader: {
    width: width * 0.9,
    backgroundColor: '#61B8D8',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 1, height: 2 },
  },
  tituloPrincipal: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtituloHeader: {
    fontSize: 14,
    color: '#f2f2f2',
    textAlign: 'center',
  },
  card: {
    width: width * 0.9,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginTop: 4,
  },
  barraContainer: {
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 8,
  },
  barra: {
    height: '100%',
    borderRadius: 4,
  },
  metrica: {
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#ff444420',
    padding: 8,
    borderRadius: 6,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  tagText: {
    color: '#ff4444',
    fontWeight: '500',
  },
  horizontalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.9,
  },
  halfCard: {
    width: '48%',
  },
  cardTitleRed: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff4444',
    marginBottom: 12,
  },
  cardTitleGreen: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00C851',
    marginBottom: 12,
  },
});

export default ConducaoUSER;
