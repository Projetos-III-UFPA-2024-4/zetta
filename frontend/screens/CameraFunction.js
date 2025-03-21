import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert, AppState } from 'react-native';
import * as FileSystem from 'expo-file-system';

const API_URL = 'http://44.196.219.45:5002/detectar_fadiga'; // Substitua pelo IP da sua API

export default function CameraFunction() {
  const [facing, setFacing] = useState('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [resultados, setResultados] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false); // Estado para controlar a captura automática
  const cameraRef = useRef(null);

  // Estados para controlar se os alertas já foram exibidos
  const [drowsinessAlertShown, setDrowsinessAlertShown] = useState(false);
  const [distractionAlertShown, setDistractionAlertShown] = useState(false);

  // Contadores
  const [contadorPiscadas, setContadorPiscadas] = useState(0);
  const [contadorEAR, setContadorEAR] = useState(0);
  const [contadorMAR, setContadorMAR] = useState(0);
  const [contadorOrientacao, setContadorOrientacao] = useState(0);

  // Solicita permissão para acessar a câmera
  useEffect(() => {
    (async () => {
      const { status } = await CameraView.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera para continuar.');
      }
    })();
  }, []);

  // Função para capturar e enviar o frame
  const capturarEEnviarFrame = async () => {
    if (cameraRef.current) {
      try {
        // Captura a foto
        const photo = await cameraRef.current.takePictureAsync({ base64: true });

        // Verifica se photo.uri está definido
        if (!photo.uri) {
          console.error('Erro: photo.uri não está definido.');
          return;
        }

        // Envia a foto para a API
        const response = await FileSystem.uploadAsync(API_URL, photo.uri, {
          httpMethod: 'POST',
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: 'image',
        });

        // Processa a resposta da API
        if (response && response.body) {
          const data = JSON.parse(response.body);
          setResultados(data);
          console.log(data);

          // Atualiza os contadores
          setContadorPiscadas(data.blink_count || 0);
          setContadorEAR(data.ear_value || 0);
          setContadorMAR(data.mar_value || 0);
          setContadorOrientacao(data.orientation_value || 0);

          // Exibe alertas apenas se não estiverem bloqueados
          if (data.drowsiness_alert && !drowsinessAlertShown) {
            setDrowsinessAlertShown(true); // Bloqueia o alerta de sonolência imediatamente
            Alert.alert('Alerta de Sonolência', 'O motorista parece estar com sono!', [
              { text: 'OK', onPress: () => {
                setTimeout(() => setDrowsinessAlertShown(false), 10000); // Desbloqueia após 10 segundos
              }},
            ]);
          } else if (data.distraction_alert && !distractionAlertShown) {
            setDistractionAlertShown(true); // Bloqueia o alerta de distração imediatamente
            Alert.alert('Alerta de Distração', 'O motorista parece distraído!', [
              { text: 'OK', onPress: () => {
                setTimeout(() => setDistractionAlertShown(false), 10000); // Desbloqueia após 10 segundos
              }},
            ]);
          }
        } else {
          console.error('Erro: Resposta da API inválida.');
        }
      } catch (error) {
        console.error('Erro ao enviar o frame:', error);
      }
    }
  };

  // Inicia/para a captura automática de frames
  const toggleCapturaAutomatica = () => {
    if (isCapturing) {
      // Se a captura está sendo parada, reinicia os contadores
      setContadorPiscadas(0);
      setContadorEAR(0);
      setContadorMAR(0);
      setContadorOrientacao(0);
      setDrowsinessAlertShown(false);
      setDistractionAlertShown(false);
    }
    setIsCapturing((prev) => !prev);
  };

  // Efeito para captura automática de frames
  useEffect(() => {
    let intervalId;
    if (isCapturing) {
      intervalId = setInterval(capturarEEnviarFrame, 1000); // Captura e envia frames a cada 1 segundo
    }
    return () => {
      if (intervalId) clearInterval(intervalId); // Limpa o intervalo quando o componente é desmontado ou a captura é parada
    };
  }, [isCapturing, drowsinessAlertShown, distractionAlertShown]);

  // Monitora o estado do app (primeiro/segundo plano)
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'background') {
        // App entrou em segundo plano: pausa a câmera
        setIsCapturing(false);
      } else if (nextAppState === 'active') {
        // App voltou ao primeiro plano: reinicia a câmera
        setIsCapturing(true);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, []);

  if (!permission) {
    // Permissões da câmera ainda estão carregando.
    return <View />;
  }

  if (!permission.granted) {
    // Permissões da câmera não foram concedidas ainda.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Precisamos de sua permissão para acessar a câmera</Text>
        <Button onPress={requestPermission} title="Conceder Permissão" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Câmera no canto inferior direito */}
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={cameraRef}
        />
      </View>

      {/* Botões e resultados */}
      <View style={styles.content}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCapturaAutomatica}>
            <Text style={styles.text}>{isCapturing ? 'Parar Captura' : 'Iniciar Captura'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}>
            <Text style={styles.text}>Trocar Câmera</Text>
          </TouchableOpacity>
        </View>

        {resultados && (
          <View style={styles.resultados}>
            <Text>EAR: {contadorEAR.toFixed(2)}</Text>
            <Text>MAR: {contadorMAR.toFixed(2)}</Text>
            <Text>Orientação: {contadorOrientacao.toFixed(2)}</Text>
            <Text>Piscadas: {contadorPiscadas}</Text>
            <Text>Alerta de Sonolência: {resultados.drowsiness_alert ? 'Sim' : 'Não'}</Text>
            <Text>Alerta de Distração: {resultados.distraction_alert ? 'Sim' : 'Não'}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  cameraContainer: {
    position: 'absolute', // Posiciona a câmera absolutamente
    bottom: 20, // Distância do fundo
    right: 20, // Distância da direita
    width: 100, // Largura da câmera
    height: 150, // Altura da câmera
    borderRadius: 10, // Bordas arredondadas
    overflow: 'hidden', // Garante que a câmera não ultrapasse os limites
    zIndex: 1, // Garante que a câmera fique acima de outros elementos
  },
  camera: {
    flex: 1, // Ocupa todo o espaço do container
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
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
  resultados: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
});
