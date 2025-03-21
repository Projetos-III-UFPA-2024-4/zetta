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
      <Text style={styles.viagemText}>Tempo:                00:00 horas</Text>
      <Text style={styles.distanciaText}>Distância:                 0.7km</Text>
      <Text style={styles.sonolenciaText}>Sonolência</Text>
      <Text style={styles.velocidadeText}>Velocidade</Text>
      <Text style={styles.mediaText}>média </Text>
      <Text style={styles.geral}>GERAL:</Text>
      <Text style={styles.comportamentoText}>Comportamento tranquilo</Text>


      <Image source={require('../assets/cima.png')} style={styles.cima} />
      <Image source={require('../assets/meio1.png')} style={styles.meio1} />
      <Image source={require('../assets/meio2.png')} style={styles.meio2} />
      <Image source={require('../assets/baixo.png')} style={styles.baixo} />
      <Image source={require('../assets/barra.png')} style={styles.barradenavegacao} />
      <Image source={require('../assets/meio1.png')} style={styles.barradenavegacao} />
      <Image source={require('../assets/icon_conducao.png')} style={styles.icon_cond} />
      <Image source={require('../assets/icon_carro.png')} style={styles.icon_car} />
      <Image source={require('../assets/icon_ia.png')} style={styles.icon_ia} />      


      {/* Botão para Navegação para ConducaoUSER */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ConducaoUSER')}
      >
        <Text style={styles.buttonText}>Condução</Text>
      </TouchableOpacity>

      {/* Botão para Navegação para HistoricoUSER */}
      <TouchableOpacity
        style={styles.buttonhistorico}
        onPress={() => navigation.navigate('HistoricoUSER')}
      >
        <Text style={styles.buttonhistoricotext}>Histórico</Text>
      </TouchableOpacity>

      {/* Botão para Navegação para IA_USER */}
      <TouchableOpacity
        style={styles.buttonia}
        onPress={() => navigation.navigate('IA_USER')}
      >
        <Text style={styles.buttoniatext}>IA</Text>
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
    width: 300,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    height: 95,
    top: 239,
  },
  meio1: {
    left: 56,
    position: 'absolute',
    width: 145,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    height: 90,
    top: 340,
  },
  meio2: {
    left: 211,
    position: 'absolute',
    width: 145,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    height: 90,
    top: 340,
  },
  baixo: {
    left: 56,
    position: 'absolute',
    width: 300,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    height: 95,
    top: 440,
  },
  icon_cond: {
    left: 64,
    position: 'absolute',
    width: 30,
    height: 30,
    top: 729,
  },
  icon_car: {
    left: 181,
    position: 'absolute',
    width: 65,
    height: 44,
    top: 722,
  },
  icon_ia: {
    left: 323,
    position: 'absolute',
    width: 30,
    height: 30,
    top: 730,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    top: -118,
    color: '#FFF',
  },
  viagemText: {
    position: 'absolute', // Posicionamento absoluto
    left: 80, // Ajuste horizontal
    top: 254, // Ajuste vertical
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    zIndex: 2, // Garante que o texto fique sobre a imagem
  },
  distanciaText: {
    position: 'absolute', // Posicionamento absoluto
    left: 80, // Ajuste horizontal
    top: 290, // Ajuste vertical
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    zIndex: 2, // Garante que o texto fique sobre a imagem
  },
  sonolenciaText: {
    position: 'absolute', // Posicionamento absoluto
    left: 76, // Ajuste horizontal
    top: 370, // Ajuste vertical
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    zIndex: 2, // Garante que o texto fique sobre a imagem
  },
  velocidadeText: {
    position: 'absolute', // Posicionamento absoluto
    left: 239, // Ajuste horizontal
    top: 359, // Ajuste vertical
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',    
    zIndex: 2, // Garante que o texto fique sobre a imagem
  },
  mediaText: {
    position: 'absolute', // Posicionamento absoluto
    left: 259, // Ajuste horizontal
    top: 385, // Ajuste vertical
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',    
    zIndex: 2, // Garante que o texto fique sobre a imagem
  },
  geral: {
    position: 'absolute', // Posicionamento absoluto
    left: 76, // Ajuste horizontal
    top: 450, // Ajuste vertical
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    zIndex: 2, // Garante que o texto fique sobre a imagem
  },
  comportamentoText: {
    position: 'absolute', // Posicionamento absoluto
    left: 76, // Ajuste horizontal
    top: 480, // Ajuste vertical
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    zIndex: 2, // Garante que o texto fique sobre a imagem
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    top: 455,
    left: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonhistorico: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    top: 390,
    left: -125,
  },
  buttonhistoricotext: {
    color: '#fff',
    fontSize: 16,
  },
  buttonia: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    top: 325,
    left: 133,
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
barradenavegacao: {
  position: 'absolute',
  left: 0,
  width: 412,
  height: 70,
  top: 724,
},
});
export default HomeUSER;
