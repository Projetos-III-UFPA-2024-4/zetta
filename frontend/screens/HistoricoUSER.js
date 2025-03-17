import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const HistoricoUSER = () => {
  const [dias, setDias] = useState([
    { 
      dia: 'Segunda', 
      rating: 4, 
      concluido: true,
      velocidadeMedia: '38 km/h',
      estiloConducao: 'Econômico',
      kmsRodados: '45 km'
    },
    { 
      dia: 'Terça', 
      rating: 4, 
      concluido: false,
      velocidadeMedia: '42 km/h',
      estiloConducao: 'Moderado',
      kmsRodados: '52 km'
    },
    { 
      dia: 'Quarta', 
      rating: 4, 
      concluido: false,
      velocidadeMedia: '42 km/h',
      estiloConducao: 'Moderado',
      kmsRodados: '52 km'
    },
    { 
      dia: 'Quinta', 
      rating: 4, 
      concluido: false,
      velocidadeMedia: '42 km/h',
      estiloConducao: 'Moderado',
      kmsRodados: '52 km'
    },
    { 
      dia: 'Sexta', 
      rating: 4, 
      concluido: false,
      velocidadeMedia: '42 km/h',
      estiloConducao: 'Moderado',
      kmsRodados: '52 km'
    },
    { 
      dia: 'Sábado', 
      rating: 4, 
      concluido: false,
      velocidadeMedia: '60 km/h',
      estiloConducao: 'Moderado',
      kmsRodados: '52 km'
    },
    
  ]);

  // Função para atualizar o rating
  const atualizarRating = (index, novoRating) => {
    const novosDias = [...dias];
    novosDias[index].rating = novoRating;
    setDias(novosDias);
  };

  // Função para alternar o checkbox
  const toggleConcluido = (index) => {
    const novosDias = [...dias];
    novosDias[index].concluido = !novosDias[index].concluido;
    setDias(novosDias);
  };

  // Renderizar estrelas interativas
  const renderStars = (index, rating) => {
    return Array(5).fill().map((_, i) => (
      <TouchableOpacity 
        key={i} 
        onPress={() => atualizarRating(index, i + 1)}
      >
        <Text style={styles.star}>
          {i < rating ? '★' : '☆'}
        </Text>
      </TouchableOpacity>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Histórico de viagens</Text>
      
      {dias.map((item, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.cabecalhoCard}>
            <Text style={styles.dia}>{item.dia}</Text>
            
            <View style={styles.avaliacao}>
              {renderStars(index, item.rating)}
            </View>

            <TouchableOpacity 
              onPress={() => toggleConcluido(index)}
              style={[styles.checkbox, item.concluido && styles.checkboxPreenchido]}
            >
              {item.concluido && <Text style={styles.check}>✓</Text>}
            </TouchableOpacity>
          </View>

          <View style={styles.metricas}>
            <View style={styles.metricaItem}>
              <Text style={styles.metricaTitulo}>Velocidade média</Text>
              <Text style={styles.metricaValor}>{item.velocidadeMedia}</Text>
            </View>
            
            <View style={styles.metricaItem}>
              <Text style={styles.metricaTitulo}>Estilo de condução</Text>
              <Text style={styles.metricaValor}>{item.estiloConducao}</Text>
            </View>
            
            <View style={styles.metricaItem}>
              <Text style={styles.metricaTitulo}>KMs rodados</Text>
              <Text style={styles.metricaValor}>{item.kmsRodados}</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

// Estilos unificados
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#61B8D8',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#fff',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cabecalhoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dia: {
    flex: 1,
    fontSize: 16,
    color: '#444',
  },
  avaliacao: {
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  star: {
    fontSize: 20,
    color: '#FFD700',
    marginHorizontal: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxPreenchido: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  check: {
    color: 'white',
    fontWeight: 'bold',
  },
  metricas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  metricaItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricaTitulo: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  metricaValor: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});

export default HistoricoUSER;