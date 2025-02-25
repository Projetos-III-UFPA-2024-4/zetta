import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Image, Alert } from 'react-native';

const HomeUSER = () => {
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

      <Text style={styles.navegacao}>Navegação</Text>
      <Text style={styles.carro}>Histórico</Text>
      <Text style={styles.alerta}>Alertas</Text>
     

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
    width: 330,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    height: 95,
    top: 239,
  },
  meio1: {
    left: 10,
    position: 'absolute',
    width: 165,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 3,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 0,
    height: 95,
    top: 340,
  },
  meio2: {
    left: 185,
    position: 'absolute',
    width: 164,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 20,
    height: 95,
    top: 340,
  },
  baixo: {
    left: 12,
    position: 'absolute',
    width: 339,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    height: 95,
    top: 440,
  },
  barradenavegacao: {
    position: 'absolute',
    left: 0,
    position: 'absolute',
    width: 370,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    height: 70,
    top: 590,
    color: '#69B1CB',
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
    width: 60,
    height: 40,
    top: 590,
    
  },
  icon_ia: {
    left: 270,
    position: 'absolute',
    width: 35,
    height: 35,
    top: 590,
    
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    top: -40,
    color: '#FFF',
  },
  viagemText: {
    left: -70,
    width: 200,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 40,
    top: -10,
    color: '#000',
  
  },
  navegacao: {
    left: -115,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 20,
    top: 350,
    color: '#FFF',
  },
  carro: {
    left: -3,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 20,
    top: 310,
    color: '#FFF',
  },
  alerta: {
    left: 115,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 20,
    top: 270,
    color: '#FFF',
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