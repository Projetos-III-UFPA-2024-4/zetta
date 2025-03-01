import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const TelaSimples = () => {
  return (
    <View style={styles.container}>
     
     <Image source={require('../assets/analiseconducao.png')} style={styles.analise} />
           <Image source={require('../assets/blococonducao.png')} style={styles.bloco0} />
           <Image source={require('../assets/bloco2conducao.png')} style={styles.bloco1} />
           <Image source={require('../assets/bloco3conducao.png')} style={styles.bloco2} />
           <Image source={require('../assets/geral.png')} style={styles.geral} />

      {/* Card 2 - Análise da Condução */}
      <View style={[styles.card, styles.cardRight]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderText}>Análise da Condução</Text>
        </View>
        <Text style={styles.cardText}>
          Obtenha a análise realizada através de cálculos baseados no seu estilo de condução.
        </Text>
      </View>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logoImage} /> {/* Coloque o caminho do seu logo aqui */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f2f6f9',
  },
  card: {
    width: '100%',
    backgroundColor: '#8BC9DD',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: {
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 10,
  },
  cardHeaderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  analise: {
    position: 'absolute',
    width: 290,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: 55,
    top: 19,
  },
  bloco0: {
    position: 'absolute',
    width: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: 95,
    top: 19000,
  },
  bloco1: {
    left: 10,
    position: 'absolute',
    width: 360,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: 150,
    top: 340,
  },
  bloco2: {
    position: 'absolute',
    width: 350,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: 95,
    top: 220,
  },
  geral: {
    position: 'absolute',
    width: 350,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: 95,
    top: 100,
  },
  
  cardText: {
    fontSize: 14,
    color: '#333',
    marginTop: 10,
    top: 111110
  },
  cardRight: {
    backgroundColor: '#61B8D8', // Altere a cor para a que você deseja para o segundo card
    top: -11100
  },
  logoContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  logoImage: {
    width: 100,
    height: 100,
    top: 190
  },
});

export default TelaSimples;
