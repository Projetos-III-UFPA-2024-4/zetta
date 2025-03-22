import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Button, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import axios from 'axios';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';

const API_URL = 'http://44.196.219.45:5002/detectar_fadiga';

const calcularClassificacao = (velocidadeMedia, ocorrencias70, ocorrencias80, ocorrencias90, ocorrencias100, ocorrencias115) => {
  const P1 = 5; // Peso para excessos de 80 km/h
  const P2 = 10; // Peso para excessos de 90 km/h
  const P3 = 20; // Peso para excessos de 100 km/h
  const P4 = 50; // Peso para excessos de 115 km/h

  const N80 = ocorrencias80 >= 2 ? ocorrencias80 : 0;
  const N90 = ocorrencias90 >= 3 ? ocorrencias90 : 0;
  const N100 = ocorrencias100 >= 1 ? ocorrencias100 : 0;
  const N115 = ocorrencias115 >= 1 ? ocorrencias115 : 0;

  const EC = velocidadeMedia + (N80 * P1) + (N90 * P2) + (N100 * P3) + (N115 * P4);

  let classificacao;
  if (ocorrencias115 >= 1) {
    classificacao = 'Direção muito perigosa';
  } else if (ocorrencias100 >= 1 || ocorrencias90 >= 5) {
    classificacao = 'Condução agressiva';
  } else if (ocorrencias80 >= 5 || ocorrencias90 >= 3) {
    classificacao = 'Ligeiramente acima do permitido';
  } else if (ocorrencias70 >= 4 || ocorrencias80 >= 2) {
    classificacao = 'Ligeiramente próximo do máximo permitido';
  } else {
    classificacao = 'Condução segura';
  }

  return { EC, classificacao };
};

export default function MonitoramentoViagemComCamera({ navigation }) {
  const [userId, setuserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [velocidade, setVelocidade] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [cronometroAtivo, setCronometroAtivo] = useState(false);
  const [tempoDecorrido, setTempoDecorrido] = useState(0);
  const [maiorVelocidade, setMaiorVelocidade] = useState(0);
  const [contVelocidade, setContVelocidade] = useState(0);
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [analiseConducao, setAnaliseConducao] = useState('');
  const [fadigaMetrics, setFadigaMetrics] = useState({
    total_sono: 0,
    total_dist: 0,
    media_orient: 0,
  });
  const [horarioInicio, setHorarioInicio] = useState(null);
  const [horarioTermino, setHorarioTermino] = useState(null);
  const intervaloRef = useRef(null);
  const locationSubscriptionRef = useRef(null);

  // Estados da câmera
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef(null);
  const [drowsinessAlertShown, setDrowsinessAlertShown] = useState(false);
  const [distractionAlertShown, setDistractionAlertShown] = useState(false);
  const capturaIntervalRef = useRef(null);

  // Recupera o userId ao carregar o componente
  useEffect(() => {
    const getuserId = async () => {
      try {
        const storeduserId = await AsyncStorage.getItem('user_id');
        if (storeduserId) {
          setuserId(storeduserId);
        } else {
          console.error('User ID não encontrado no AsyncStorage');
        }
      } catch (error) {
        console.error('Erro ao recuperar o user_id', error);
      } finally {
        setIsLoading(false);
      }
    };

    getuserId();
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
    if (!userId) {
      Alert.alert('Erro', 'User ID não definido. Não é possível iniciar a viagem.');
      return;
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permissão para acessar a localização foi negada');
      return;
    }

    // Define o horário de início
    setHorarioInicio(new Date().toISOString());

    // Iniciar monitoramento de velocidade
    setCronometroAtivo(true);
    setTempoDecorrido(0);
    setMaiorVelocidade(0);
    setContVelocidade(0);
    setDadosGrafico([]);
    setAnaliseConducao('');
    setFadigaMetrics({ total_sono: 0, total_dist: 0, media_orient: 0 });

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

          if (velocidadeKmh > 90) {
            setContVelocidade((prevCont) => prevCont + 1);
          }

          setDadosGrafico((prevDados) => [...prevDados, velocidadeKmh]);
        }
      }
    );

    // Iniciar captura da câmera
    setIsCapturing(true);
  };

  // Função para formatar a data no formato MySQL (YYYY-MM-DD HH:MM:SS)
const formatarDataParaMySQL = (dataISO) => {
  const data = new Date(dataISO);
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0'); // Meses são de 0 a 11
  const dia = String(data.getDate()).padStart(2, '0');
  const horas = String(data.getHours()).padStart(2, '0');
  const minutos = String(data.getMinutes()).padStart(2, '0');
  const segundos = String(data.getSeconds()).padStart(2, '0');

  return `${ano}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
};

const encerrarViagem = async () => {
  if (!userId) {
    Alert.alert('Erro', 'User ID não definido. Não é possível encerrar a viagem.');
    return;
  }

  // Define o horário de término
  setHorarioTermino(new Date().toISOString());

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

    // Calcular a média de orientação
    const mediaOrientacao = fadigaMetrics.media_orient / (fadigaMetrics.total_sono + fadigaMetrics.total_dist || 1);

    // Calcular as ocorrências de velocidade
    const ocorrencias70 = dadosGrafico.filter((v) => v > 70).length;
    const ocorrencias80 = dadosGrafico.filter((v) => v > 80).length;
    const ocorrencias90 = dadosGrafico.filter((v) => v > 90).length;
    const ocorrencias100 = dadosGrafico.filter((v) => v > 100).length;
    const ocorrencias115 = dadosGrafico.filter((v) => v > 115).length;

    // Calcular a classificação
    const { classificacao } = calcularClassificacao(
      velocidadeMedia,
      ocorrencias70,
      ocorrencias80,
      ocorrencias90,
      ocorrencias100,
      ocorrencias115
    );

    // Formatar as datas para o formato MySQL
    const horarioInicioFormatado = formatarDataParaMySQL(horarioInicio);
    const horarioTerminoFormatado = formatarDataParaMySQL(horarioTermino);

    // Montar o payload
    const payload = {
      user_id: userId,
      velocidade: velocidadeMedia,
      duracao: tempoDecorrido,
      maior_velocidade: maiorVelocidade,
      cont_velocidade: contVelocidade,
      total_sono: fadigaMetrics.total_sono,
      total_dist: fadigaMetrics.total_dist,
      media_orient: mediaOrientacao,
      classificacao,
      horario_inicio: horarioInicioFormatado, // Usando o valor formatado
      horario_termino: horarioTerminoFormatado, // Usando o valor formatado
      data: dataAtual,
    };

    console.log('Payload enviado:', payload); // Log para depuração

    // Enviar dados para o backend
    const response = await axios.post('http://44.196.219.45:5000/salvar-velocidade', payload);

    console.log('Dados salvos:', response.data);

    // Navegar de volta para HomeUSER, passando o userId
    navigation.navigate('HomeUSER', { userId });
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
    if (!userId) {
      console.error('User ID não definido. Não é possível capturar o frame.');
      return;
    }

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

          // Captura as métricas de fadiga
          const { total_sono, total_dist, media_orient } = data;

          // Atualiza o estado com as métricas capturadas
          setFadigaMetrics((prevMetrics) => ({
            total_sono: prevMetrics.total_sono + (total_sono || 0),
            total_dist: prevMetrics.total_dist + (total_dist || 0),
            media_orient: prevMetrics.media_orient + (media_orient || 0),
          }));

          // Exibe alertas de sonolência e distração
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
    if (isCapturing && userId) { // Só captura frames se o userId estiver definido
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
  }, [isCapturing, userId, drowsinessAlertShown, distractionAlertShown]);

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

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando...</Text>
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
        <TouchableOpacity
          style={[styles.button, !userId && styles.disabledButton]}
          onPress={cronometroAtivo ? encerrarViagem : iniciarViagem}
          disabled={!userId}
        >
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
  disabledButton: {
    opacity: 0.5,
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