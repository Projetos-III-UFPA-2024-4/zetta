import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
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
  const [totalSono, setTotalSono] = useState(0); // Contador para drowsiness_alert
  const [totalDist, setTotalDist] = useState(0); // Contador para distraction_alert
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

  // Cooldown para os alertas (10 segundos)
  const ALERT_COOLDOWN = 10000; // 10 segundos em milissegundos

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

          // Verifica o cooldown antes de exibir o alerta
          if (data.drowsiness_alert && now - lastAlertTime.drowsiness >= ALERT_COOLDOWN) {
            setLastAlertTime((prev) => ({ ...prev, drowsiness: now })); // Atualiza o timestamp
            setTotalSono((prev) => prev + 1); // Incrementa o contador de sono
            Alert.alert('Alerta de Sonolência', 'O motorista parece estar com sono!');
            playAlarm();
          } else if (data.distraction_alert && now - lastAlertTime.distraction >= ALERT_COOLDOWN) {
            setLastAlertTime((prev) => ({ ...prev, distraction: now })); // Atualiza o timestamp
            setTotalDist((prev) => prev + 1); // Incrementa o contador de distração
            Alert.alert('Alerta de Distração', 'O motorista parece distraído!');
            playAlarm();
          } else if (data.yawning_alert && now - lastAlertTime.yawning >= ALERT_COOLDOWN) {
            setLastAlertTime((prev) => ({ ...prev, yawning: now })); // Atualiza o timestamp
            Alert.alert('Alerta de Bocejo', 'O motorista está bocejando!');
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
      capturaIntervalRef.current = setInterval(capturarEEnviarFrame, 1500); // Captura e envia frames a cada 1 segundo
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

            // Atualiza a maior velocidade
            setMaiorVelocidade((prevMaiorVelocidade) => {
              if (velocidadeKmh > prevMaiorVelocidade) {
                return velocidadeKmh;
              }
              return prevMaiorVelocidade;
            });

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
        total_sono: totalSono, // Passa o total de alertas de sono
        total_dist: totalDist, // Passa o total de alertas de distração
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
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Permissão Necessária</Text>
        <Text style={styles.permissionMessage}>
          Precisamos de acesso à câmera e localização para continuar.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Conceder Permissão</Text>
        </TouchableOpacity>
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

      {/* Informações abaixo da câmera */}
      <View style={styles.infoContainer}>
        {/* Primeira linha: duas colunas */}
        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Velocidade Atual</Text>
            <Text style={styles.infoValue}>
              {velocidade !== null ? `${velocidade.toFixed(2)} km/h` : 'N/A'}
            </Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Maior Velocidade</Text>
            <Text style={styles.infoValue}>
              {maior_velocidade.toFixed(2)} km/h
            </Text>
          </View>
        </View>

        {/* Segunda linha: duas colunas */}
        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Tempo Decorrido</Text>
            <Text style={styles.infoValue}>{duracao} segundos</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Alertas de Sono</Text>
            <Text style={styles.infoValue}>{totalSono}</Text>
          </View>
        </View>

        {/* Terceira linha: caixa centralizada */}
        <View style={styles.infoBoxCentralized}>
          <Text style={styles.infoLabel}>Alertas de Distração</Text>
          <Text style={styles.infoValue}>{totalDist}</Text>
        </View>
      </View>

      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#042B3D',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#042B3D',
    padding: 20,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#61B8D8',
    marginBottom: 10,
  },
  permissionMessage: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#61B8D8',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    elevation: 3,
  },
  permissionButtonText: {
    fontSize: 18,
    color: '#042B3D',
    fontWeight: 'bold',
  },
  camera: {
    width: '100%',
    height: 400,
    borderRadius: 40,
    borderColor: '#61B8D8',
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
    backgroundColor: '#61B8D8',
    borderRadius: 30,
    width: '60%',
    alignItems: 'center',
    elevation: 5,
    height: 45,
    top: 320,
  },
  buttonActive: {
    backgroundColor: '#042B3D', // Cor diferente quando a captura está ativa
  },
  text: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  infoContainer: {
    width: '100%',
    marginTop: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoBox: {
    width: '48%',
    backgroundColor: '#8BC9DD',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  infoBoxCentralized: {
    width: '48%',
    backgroundColor: '#8BC9DD',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
    left: 100,
  },
  infoLabel: {
    fontSize: 14,
    color: '#042B3D',
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
  },
});

export default CameraFunction;
