import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://44.196.219.45:5002/detectar_fadiga'; // Substitua pelo IP da sua API

const CameraFunction = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const [velocidade, setVelocidade] = useState(null);
  const [maior_velocidade, setMaiorVelocidade] = useState(0);
  const [duracao, setDuracao] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);
  const [userId, setUserId] = useState(null);
  const [inicioCaptura, setInicioCaptura] = useState(null);
  const [terminoCaptura, setTerminoCaptura] = useState(null);
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const cameraRef = useRef(null);
  const locationSubscriptionRef = useRef(null);
  const intervaloRef = useRef(null);
  const navigation = useNavigation();

  // Recupera o user_id do AsyncStorage ao carregar o componente
  useEffect(() => {
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('user_id');
        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          console.error('User ID não encontrado no AsyncStorage');
        }
      } catch (error) {
        console.error('Erro ao recuperar o user_id', error);
      }
    };

    getUserId();
  }, []);

  // Solicita permissão para acessar a câmera
  useEffect(() => {
    (async () => {
      const { status } = await CameraView.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera para continuar.');
      }
    })();
  }, []);

  // Função para iniciar o monitoramento de velocidade
  const iniciarMonitoramentoVelocidade = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permissão para acessar a localização foi negada');
      return;
    }

    locationSubscriptionRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000, // Atualiza a cada segundo
        distanceInterval: 1, // Atualiza se o usuário mover 1 metro
      },
      (location) => {
        const speed = location.coords.speed;

        // Verifique se a velocidade não é null ou NaN
        if (speed != null && !isNaN(speed)) {
          const velocidadeKmh = speed * 3.6; // Converte m/s para km/h
          setVelocidade(velocidadeKmh);

          // Atualiza a maior velocidade captada
          if (velocidadeKmh > maior_velocidade) {
            setMaiorVelocidade(velocidadeKmh);
          }

          // Adiciona a velocidade ao array de dados para o gráfico
          setDadosGrafico((prevDados) => [...prevDados, velocidadeKmh]);
        } else {
          console.warn("Velocidade não capturada corretamente");
        }
      }
    );
  };

  // Função para parar o monitoramento de velocidade
  const pararMonitoramentoVelocidade = () => {
    if (locationSubscriptionRef.current) {
      locationSubscriptionRef.current.remove();
      locationSubscriptionRef.current = null;
      setVelocidade(null);
    }
  };

  // Função para iniciar/parar a captura
  const toggleCapturaAutomatica = async () => {
    if (!isCapturing) {
      // Iniciar captura
      await iniciarMonitoramentoVelocidade();
      setInicioCaptura(new Date().toISOString());
      setDuracao(0);
      setMaiorVelocidade(0);
      setDadosGrafico([]);

      // Iniciar cronômetro
      intervaloRef.current = setInterval(() => {
        setDuracao((prevTempo) => prevTempo + 1);
      }, 1000);
    } else {
      // Parar captura
      pararMonitoramentoVelocidade();
      const termino = new Date().toISOString();
      setTerminoCaptura(termino);

      // Limpar cronômetro
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
      }

      // Navegar para a tela Velocidade com os dados capturados
      navigation.navigate('Velocidade', {
        userId,
        velocidade: dadosGrafico.length > 0 ? dadosGrafico.reduce((acc, val) => acc + val, 0) / dadosGrafico.length : 0,
        maior_velocidade,
        cont_velocidade: dadosGrafico.filter((v) => v > 90).length,
        horario_inicio: inicioCaptura,
        horario_termino: termino,
        duracao,
        dadosGrafico,
        timestamp: new Date().toISOString(), // Adiciona o timestamp atual
      });
    }
    setIsCapturing((prev) => !prev);
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Precisamos de sua permissão para acessar a câmera</Text>
        <Button onPress={requestPermission} title="Conceder Permissão" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="front"
        ref={cameraRef}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCapturaAutomatica}>
            <Text style={styles.text}>{isCapturing ? 'Parar Captura' : 'Iniciar Captura'}</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      <Text style={styles.velocidadeText}>
        Velocidade: {velocidade !== null ? `${velocidade.toFixed(2)} km/h` : 'N/A'}
      </Text>
      <Text style={styles.dataHoraText}>Maior Velocidade: {maior_velocidade.toFixed(2)} km/h</Text>
      <Text style={styles.dataHoraText}>Tempo Decorrido: {duracao} segundos</Text>
      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  camera: {
    width: '100%',
    height: 400,
    borderRadius: 15,
    borderColor: '#0097a7',
    borderWidth: 2,
    marginBottom: 20,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#00bcd4',
    borderRadius: 30,
    width: '60%',
    alignItems: 'center',
    elevation: 5,
    height: 45,
    top: 320,
  },
  text: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  velocidadeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
  dataHoraText: {
    fontSize: 16,
    marginTop: 10,
    color: '#555',
  },
  error: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
  },
});

export default CameraFunction;