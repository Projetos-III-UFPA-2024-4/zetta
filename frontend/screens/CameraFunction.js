import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';

const API_URL = 'http://192.168.1.4:5002/detectar_fadiga'; // Substitua pelo IP da sua API

export default function CameraFunction() {
  const [facing, setFacing] = useState('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [resultados, setResultados] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false); // Estado para controlar a captura automática
  const cameraRef = useRef(null);

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

          // Exibe alertas
          if (data.drowsiness_alert) {
            Alert.alert('Alerta de Sonolência', 'O motorista parece estar com sono!');
          }
          if (data.yawning_alert) {
            Alert.alert('Alerta de Bocejo', 'O motorista está bocejando!');
          }
          if (data.distraction_alert) {
            Alert.alert('Alerta de Distração', 'O motorista parece distraído!');
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
  }, [isCapturing]);

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
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCapturaAutomatica}>
            <Text style={styles.text}>{isCapturing ? 'Parar Captura' : 'Iniciar Captura'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}>
            <Text style={styles.text}>Trocar Câmera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      {resultados && (
        <View style={styles.resultados}>
          <Text>EAR: {resultados.ear_value.toFixed(2)}</Text>
          <Text>MAR: {resultados.mar_value.toFixed(2)}</Text>
          <Text>Orientação: {resultados.orientation_value.toFixed(2)}</Text>
          <Text>Alerta de Sonolência: {resultados.drowsiness_alert ? 'Sim' : 'Não'}</Text>
          <Text>Alerta de Bocejo: {resultados.yawning_alert ? 'Sim' : 'Não'}</Text>
          <Text>Alerta de Distração: {resultados.distraction_alert ? 'Sim' : 'Não'}</Text>
        </View>
      )}
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
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
    justifyContent: 'space-between',
  },
  button: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  resultados: {
    padding: 20,
    backgroundColor: '#fff',
  },
});
