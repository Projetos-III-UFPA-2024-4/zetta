import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';

const HomeUSER = ({ navigation }) => {  // Adicionando 'navigation' como prop
  const handlePress = () => {
    Alert.alert('Botão Clicado', 'Você pressionou o botão!');
  };

  return (
    <View style={styles.container}> 
      <TouchableOpacity onPress={handlePress} style={styles.logoImage}>
        <Image source={require('../assets/play.png')} style={styles.logoImage} />
      </TouchableOpacity>

      <View style={styles.bolaAzulClaro} />
      <View style={styles.bolaAzul} />
      <Text style={styles.headerText}>Iniciar Viagem</Text>
      <Text style={styles.viagemText}>Minhas viagens</Text>

      <Image source={require('../assets/cima.png')} style={styles.cima} />
      <Image source={require('../assets/meio1.png')} style={styles.meio1} />
      <Image source={require('../assets/meio2.png')} style={styles.meio2} />
      <Image source={require('../assets/baixo.png')} style={styles.baixo} />
      <Image source={require('../assets/meio1.png')} style={styles.barradenavegacao} />
      <Image source={require('../assets/icon_conducao.png')} style={styles.icon_cond} />
      <Image source={require('../assets/icon_carro.png')} style={styles.icon_car} />
      <Image source={require('../assets/icon_ia.png')} style={styles.icon_ia} />

      
      <Text style={styles.nav}>Navegação segura</Text>
      <Text style={styles.comece}>Comece sua viagem com segurança</Text>

      {/* Botão para Navegação para ConducaoUSER */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('ConducaoUSER')}  // Navegando para ConducaoUSER
      >
        <Text style={styles.buttonText}>Navegação</Text>  {/* Botão Navegação */}
      </TouchableOpacity>

      {/* Botão para Navegação para Historico_USER */}
      <TouchableOpacity 
        style={styles.buttonhi}
        onPress={() => {
        console.log('Botão Histórico pressionado'); // Log para depuração
        navigation.navigate('Historico_USER');
  }}
>
  <Text style={styles.buttonh}>Histórico</Text>
</TouchableOpacity>
      {/* Botão para Navegação para IA_USER */}
      <TouchableOpacity 
        style={styles.buttonia}
        onPress={() => navigation.navigate('IA_USER')}  // Navegando para ConducaoUSER
      >
        <Text style={styles.buttoniatext}>Alertas</Text>  {/* Botão Navegação */}
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.startButtonText}>Iniciar Viagem</Text>
      </TouchableOpacity>
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  bolaAzulClaro: {
    position: 'absolute',
    width: 600,
    height: 700,
    borderRadius: 500,
    backgroundColor: '#8BC9DD',
    top: -500,
    left: -89.7,
    zIndex: -1,
  },
  bolaAzul: {
    position: 'absolute',
    width: 600,
    height: 700,
    borderRadius: 500,
    backgroundColor: '#61B8D8',
    top: -520,
    left: -89.7,
    zIndex: -1,
  },
  logoImage: {
    position: 'absolute',
    width: 101,
    height: 100,
    top: 10,
  },
  cima: {
    position: 'absolute',
    width: 310,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: 90,
    top: 239,
  },
  meio1: {
    left: 10,
    position: 'absolute',
    width: 165,
    height: 95,
    top: 340,
  },
  meio2: {
    left: 185,
    position: 'absolute',
    width: 164,
    height: 95,
    top: 340,
  },
  baixo: {
    left: 12,
    position: 'absolute',
    width: 339,
    height: 95,
    top: 440,
  },
  barradenavegacao: {
    position: 'absolute',
    left: 0,
    width: 370,
    height: 70,
    top: 590,
  },
  icon_cond: {
    left: 40,
    position: 'absolute',
    width: 30,
    height: 30,
    top: 600,
  },
  icon_car: {
    left: 150,
    position: 'absolute',
    width: 50,
    height: 40,
    top: 595,
  },
  icon_ia: {
    left: 285,
    position: 'absolute',
    width: 30,
    height: 30,
    top: 599,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    top: -10,
    color: '#FFF',
  },
  viagemText: {
    left: -90,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 40,
    top: 10,
    color: '#000',
  },

  carro: {
    left: -3,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 20,
    top: 330,
    color: '#FFF',
  },
  
  button: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    top: 320,
    left: -119,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonia: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    top: 196,
    left: 120,
  },
  buttoniatext: {
    color: '#fff',
    fontSize: 16,
  },
  buttonhi: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    top: 256,
    width: 100, // Largura fixa
    alignItems: 'center', // Centralizar texto
  },
  buttonh: {
    color: '#fff',
    fontSize: 16,
  },
  startButton: {
  
    padding: 15,
    borderRadius: 5,
    top: 5000
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
  },
 nav: {
    color: '#fff',
    fontSize: 18,
  },
 comece: {
    color: '#fff',
    fontSize: 18,
  },

});

export default HomeUSER;
