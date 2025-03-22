import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import axios from 'axios';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';

const API_URL = 'http://44.196.219.45:5002/detectar_fadiga'; // Substitua pelo IP da sua API

export default function MonitoramentoViagemComCamera({ navigation }) {
  const [userId, setUserId] = useState(null);
  const [velocidade, setVelocidade] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [cronometroAtivo, setCronometroAtivo] = useState(false);
  const [tempoDecorrido, setTempoDecorrido] = useState(0);
  const [maiorVelocidade, setMaiorVelocidade] = useState(0);
  const [contVelocidade, setContVelocidade] = useState(0);
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [analiseConducao, setAnaliseConducao] = useState('');
  const intervaloRef = useRef(null);
  const locationSubscriptionRef = useRef(null);

  // Estados da câmera
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef(null);
  const [drowsinessAlertShown, setDrowsinessAlertShown] = useState(false);
  const [distractionAlertShown, setDistractionAlertShown] = useState(false);
  const capturaIntervalRef = useRef(null); // Referência para o intervalo de captura de frames

  // Recupera o userId ao carregar o componente
  useEffect(() => {
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('user_id');
        if (storedUserId) {
          setUserId(storedUserId);
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

  // Inicia o monitoramento de velocidade e câmera
  const iniciarViagem = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permissão para acessar a localização foi negada');
      return;
    }

    // Iniciar monitoramento de velocidade
    setCronometroAtivo(true);
    setTempoDecorrido(0);
    setMaiorVelocidade(0);
    setContVelocidade(0);
    setDadosGrafico([]);
    setAnaliseConducao('');

    intervaloRef.current = setInterval(() => {
      setTempoDecorrido((prevTempo) => prevTempo + 1);
    }, 1000);

    locationSubscriptionRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (location) => {
        const speed = location.coords.speed;
        if (speed !== null) {
          const velocidadeKmh = speed * 3.6;
          setVelocidade(velocidadeKmh);

          if (velocidadeKmh > maiorVelocidade) {
            setMaiorVelocidade(velocidadeKmh);
          }

          if (velocidadeKmh > 80) {
            setContVelocidade((prevCont) => prevCont + 1);
          }

          setDadosGrafico((prevDados) => [...prevDados, velocidadeKmh]);
        }
      }
    );

    // Iniciar captura da câmera
    setIsCapturing(true);
  };

  // Encerra o monitoramento de velocidade e câmera
  const encerrarViagem = async () => {
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
      setCronometroAtivo(false);
    }

    if (locationSubscriptionRef.current) {
      locationSubscriptionRef.current.remove();
    }

    // Parar captura da câmera
    setIsCapturing(false);

    // Limpar o intervalo de captura de frames
    if (capturaIntervalRef.current) {
      clearInterval(capturaIntervalRef.current);
      capturaIntervalRef.current = null;
    }

    try {
      const dataAtual = new Date().toISOString().split('T')[0];

      // Calcular a velocidade média
      const velocidadeMedia = dadosGrafico.reduce((acc, val) => acc + val, 0) / dadosGrafico.length;

      const response = await axios.post('http://192.168.1.227:5000/salvar-velocidade', {
        user_id: userId,
        velocidade: velocidadeMedia,
        duracao: tempoDecorrido,
        maior_velocidade: maiorVelocidade,
        cont_velocidade: contVelocidade,
        data: dataAtual,
      });

      console.log('Dados salvos:', response.data);
      navigation.navigate('HomeUSER');
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      Alert.alert('Erro', 'Não foi possível salvar os dados.');
    }

    analisarConducao();
  };

  // Analisa a condução com base na velocidade
  const analisarConducao = () => {
    const mediaVelocidade = dadosGrafico.reduce((acc, val) => acc + val, 0) / dadosGrafico.length;
    const vezesAcimaLimite = dadosGrafico.filter((v) => v > 80).length;

    if (vezesAcimaLimite > 5 || mediaVelocidade > 90) {
      setAnaliseConducao('Condução Ruim: Muitas vezes acima do limite de velocidade.');
    } else if (vezesAcimaLimite > 2) {
      setAnaliseConducao('Condução Regular: Algumas vezes acima do limite de velocidade.');
    } else {
      setAnaliseConducao('Condução Boa: Dentro dos limites de velocidade.');
    }
  };

  // Captura e envia o frame da câmera
  const capturarEEnviarFrame = async () => {
    if (cameraRef.current && isCapturing) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ base64: true });

        if (!photo.uri) {
          console.error('Erro: photo.uri não está definido.');
          return;
        }

        const response = await FileSystem.uploadAsync(API_URL, photo.uri, {
          httpMethod: 'POST',
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: 'image',
        });

        if (response && response.body) {
          const data = JSON.parse(response.body);

          // Exibe alertas apenas se não estiverem bloqueados
          if (data.drowsiness_alert && !drowsinessAlertShown) {
            setDrowsinessAlertShown(true);
            Alert.alert('Alerta de Sonolência', 'O motorista parece estar com sono!', [
              { text: 'OK', onPress: () => {
                setTimeout(() => setDrowsinessAlertShown(false), 10000);
              }},
            ]);
          } else if (data.distraction_alert && !distractionAlertShown) {
            setDistractionAlertShown(true);
            Alert.alert('Alerta de Distração', 'O motorista parece distraído!', [
              { text: 'OK', onPress: () => {
                setTimeout(() => setDistractionAlertShown(false), 10000);
              }},
            ]);
          }
        }
      } catch (error) {
        console.error('Erro ao enviar o frame:', error);
      }
    }
  };

  // Efeito para captura automática de frames
  useEffect(() => {
    if (isCapturing) {
      capturaIntervalRef.current = setInterval(capturarEEnviarFrame, 1000);
    } else {
      if (capturaIntervalRef.current) {
        clearInterval(capturaIntervalRef.current);
        capturaIntervalRef.current = null;
      }
    }

    return () => {
      if (capturaIntervalRef.current) {
        clearInterval(capturaIntervalRef.current);
      }
    };
  }, [isCapturing, drowsinessAlertShown, distractionAlertShown]);

  // Limpeza ao sair da tela
  useEffect(() => {
    return () => {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
      }
      if (locationSubscriptionRef.current) {
        locationSubscriptionRef.current.remove();
      }
      if (capturaIntervalRef.current) {
        clearInterval(capturaIntervalRef.current);
      }
    };
  }, []);

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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Monitoramento de Velocidade (USER: {userId})</Text>
      <Text>Velocidade: {velocidade !== null ? `${velocidade.toFixed(2)} km/h` : 'Carregando...'}</Text>
      <Text>Tempo de Viagem: {tempoDecorrido} segundos</Text>
      <Text>Maior Velocidade: {maiorVelocidade.toFixed(2)} km/h</Text>
      <Text>Vezes acima de 80 km/h: {contVelocidade}</Text>
      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

      {/* Câmera */}
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="front"
          ref={cameraRef}
        />
      </View>

      {/* Botões */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={cronometroAtivo ? encerrarViagem : iniciarViagem}>
          <Text style={styles.text}>{cronometroAtivo ? 'Encerrar Viagem' : 'Iniciar Viagem'}</Text>
        </TouchableOpacity>
      </View>

      {/* Análise de condução */}
      {analiseConducao && (
        <Text style={styles.analise}>{analiseConducao}</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  error: {
    color: 'red',
  },
  cameraContainer: {
    width: 200,
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 20,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    marginVertical: 20,
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  analise: {
    fontSize: 16,
    marginTop: 20,
    color: 'red',
    fontWeight: 'bold',
  },
});
