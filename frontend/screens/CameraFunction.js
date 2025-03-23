import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';

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
  const soundRef = useRef(null);
  const [lastAlertTime, setLastAlertTime] = useState({
    drowsiness: 0,
    distraction: 0,
    yawning: 0,
  });
  const capturaIntervalRef = useRef(null);

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

  // Solicita permissão para acessar a câmera e localização
  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await CameraView.requestCameraPermissionsAsync();
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      if (cameraStatus !== 'granted' || locationStatus !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera e localização para continuar.');
      }
    })();
  }, []);

  // Carrega o som ao iniciar o componente
  useEffect(() => {
    (async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/alarm.wav') // Caminho para o arquivo de som
      );
      soundRef.current = sound;
    })();

    // Limpa o som ao desmontar o componente
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  // Função para reproduzir o som de alarme
  const playAlarm = async () => {
    if (soundRef.current) {
      await soundRef.current.replayAsync();
    }
  };

  // Função para capturar e enviar o frame
  const capturarEEnviarFrame = async () => {
    if (cameraRef.current && isCapturing) {
      try {
        // Captura a foto com qualidade reduzida e sem som
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.5,
          mute: true,
        });

        if (!photo.uri) {
          console.error('Erro: photo.uri não está definido.');
          return;
        }

        // Adiciona um timestamp ao frame
        const timestamp = Date.now();

        // Envia a foto para a API
        const response = await FileSystem.uploadAsync(API_URL, photo.uri, {
          httpMethod: 'POST',
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: 'image',
          headers: {
            'Timestamp': timestamp.toString(), // Envia o timestamp no cabeçalho
          },
        });

        // Processa a resposta da API
        if (isCapturing && response && response.body) {
          const data = JSON.parse(response.body);
          console.log(data);

          const now = Date.now();

          // Prioridade: Sonolência > Distração > Bocejo
          if (data.drowsiness_alert && now - lastAlertTime.drowsiness >= 10000) {
            Alert.alert('Alerta de Sonolência', 'O motorista parece estar com sono!');
            setLastAlertTime((prev) => ({ ...prev, drowsiness: now }));
            playAlarm();
          } else if (data.distraction_alert && now - lastAlertTime.distraction >= 10000) {
            Alert.alert('Alerta de Distração', 'O motorista parece distraído!');
            setLastAlertTime((prev) => ({ ...prev, distraction: now }));
            playAlarm();
          } else if (data.yawning_alert && now - lastAlertTime.yawning >= 10000) {
            Alert.alert('Alerta de Bocejo', 'O motorista está bocejando!');
            setLastAlertTime((prev) => ({ ...prev, yawning: now }));
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
      capturaIntervalRef.current = setInterval(capturarEEnviarFrame, 1000); // Captura e envia frames a cada 1 segundo
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
  }, [isCapturing]);

  // Função para iniciar o monitoramento de velocidade
  const iniciarMonitoramentoVelocidade = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão para acessar a localização foi negada');
        return;
      }

      locationSubscriptionRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (location) => {
          const speed = location.coords.speed;
          if (speed != null && !isNaN(speed)) {
            const velocidadeKmh = speed * 3.6;
            setVelocidade(velocidadeKmh);
            if (velocidadeKmh > maior_velocidade) {
              setMaiorVelocidade(velocidadeKmh);
            }
            setDadosGrafico((prevDados) => [...prevDados, velocidadeKmh]);
          } else {
            console.warn("Velocidade não capturada corretamente");
          }
        }
      );
    } catch (error) {
      console.error('Erro ao iniciar o monitoramento de velocidade:', error);
      setErrorMsg('Erro ao monitorar a velocidade');
    }
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
        timestamp: new Date().toISOString(),
      });
    }
    setIsCapturing((prev) => !prev);
  };

  // Limpeza de recursos ao desmontar o componente
  useEffect(() => {
    return () => {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
      }
      if (locationSubscriptionRef.current) {
        locationSubscriptionRef.current.remove();
      }
      if (soundRef.current) {
        soundRef.current.unloadAsync();
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
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="front"
        ref={cameraRef}
        mute={true}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, isCapturing && styles.buttonActive]} onPress={toggleCapturaAutomatica}>
            <Text style={styles.text}>{isCapturing ? 'Encerrar Viagem' : 'Iniciar Viagem'}</Text>
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
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: '#333',
    fontSize: 16,
  },
  camera: {
    width: '100%',
    height: 400,
    borderRadius: 40,
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
  buttonActive: {
    backgroundColor: '#ff4444', // Cor diferente quando a captura está ativa
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
