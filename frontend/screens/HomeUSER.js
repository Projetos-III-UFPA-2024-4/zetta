import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';

const HomeUSER = ({ navigation }) => {
  const handlePress = () => {
    navigation.navigate('CameraFunction'); // Navega para a tela da câmera
  };

  return (
    <View style={styles.container}>
      {/* Botão de play que abre a câmera */}
      <TouchableOpacity onPress={handlePress} style={styles.logoImage}>
        <Image source={require('../assets/play.png')} style={styles.logoImage} />
      </TouchableOpacity>

      {/* Restante do código da tela HomeUSER */}
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

      <Text style={styles.carro}>Histórico</Text>
      <Text style={styles.alerta}>Alertas</Text>

      {/* Botão para Navegação para ConducaoUSER */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ConducaoUSER')}
      >
        <Text style={styles.buttonText}>Navegação</Text>
      </TouchableOpacity>

      {/* Botão para Navegação para IA_USER */}
      <TouchableOpacity
        style={styles.buttonia}
        onPress={() => navigation.navigate('IA_USER')}
      >
        <Text style={styles.buttoniatext}>Alertas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.startButtonText}>Iniciar Viagem</Text>
      </TouchableOpacity>
    </View>
  );
};

// Estilos (mantenha os mesmos estilos do seu código original)
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
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    height: 95,
    top: 239,
  },
  meio1: {
    left: 41,
    position: 'absolute',
    width: 161,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    height: 95,
    top: 340,
  },
  meio2: {
    left: 209,
    position: 'absolute',
    width: 162,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    height: 95,
    top: 340,
  },
  baixo: {
    left: 41,
    position: 'absolute',
    width: 330,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    height: 95,
    top: 440,
  },
  barradenavegacao: {
    position: 'absolute',
    left: 0,
    width: 412,
    height: 70,
    top: 724,
  },
  icon_cond: {
    left: 40,
    position: 'absolute',
    width: 30,
    height: 30,
    top: 730,
  },
  icon_car: {
    left: 172,
    position: 'absolute',
    width: 65,
    height: 44,
    top: 722,
  },
  icon_ia: {
    left: 330,
    position: 'absolute',
    width: 35,
    height: 31,
    top: 730,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    top: -129,
    color: '#FFF',
  },
  viagemText: {
    position: 'absolute', // Posicionamento absoluto
    left: 129, // Ajuste horizontal
    top: 270, // Ajuste vertical
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    zIndex: 2, // Garante que o texto fique sobre a imagem
  },
  alerta: {
    position: 'absolute', // Posicionamento absoluto
    left: 171, // Ajuste horizontal
    top: 469, // Ajuste vertical
    fontSize: 20, // Tamanho da fonte
    color: '#FFF', // Cor do texto
    fontWeight: 'bold', // Peso da fonte (negrito)
  },
  carro: {
    left: 0,
    fontSize: 15,
    marginBottom: 20,
    top: 453,
    color: '#FFF',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    top: 398,
    left: -150,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonia: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    top: 335,
    left: 141,
  },
  buttoniatext: {
    color: '#fff',
    fontSize: 16,
  },
  startButton: {
    padding: 15,
    borderRadius: 5,
    top: 5000,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default HomeUSER;