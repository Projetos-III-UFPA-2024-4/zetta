import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av'; // Importe a biblioteca expo-av

const API_URL = 'http://44.196.219.45:5002/detectar_fadiga'; // Substitua pelo IP da sua API

export default function CameraFunction() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false); // Estado para controlar a captura automática
  const cameraRef = useRef(null);
  const soundRef = useRef(null); // Referência para o objeto de som

  // Estados para controlar se os alertas já foram exibidos
  const [lastAlertTime, setLastAlertTime] = useState({
    drowsiness: 0,
    distraction: 0,
    yawning: 0,
  });

  // Referência para o intervalo de captura de frames
  const capturaIntervalRef = useRef(null);

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

  // Solicita permissão para acessar a câmera
  useEffect(() => {
    (async () => {
      const { status } = await CameraView.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera para continuar.');
      }
    })();
  }, []);

  // Função para reproduzir o som de alarme
  const playAlarm = async () => {
    if (soundRef.current) {
      await soundRef.current.replayAsync(); // Reproduz o som do início
    }
  };

  // Função para capturar e enviar o frame
  const capturarEEnviarFrame = async () => {
    if (cameraRef.current && isCapturing) {
      try {
        // Captura a foto com qualidade reduzida e sem som
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.5, // Reduz a qualidade da imagem para 50%
          mute: true, // Desativa o som de captura
        });

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

        // Processa a resposta da API apenas se a captura ainda estiver ativa
        if (isCapturing && response && response.body) {
          const data = JSON.parse(response.body);
          console.log(data);

          const now = Date.now();

          // Prioridade: Sonolência > Distração > Bocejo
          if (data.drowsiness_alert && now - lastAlertTime.drowsiness >= 10000) {
            Alert.alert('Alerta de Sonolência', 'O motorista parece estar com sono!');
            setLastAlertTime((prev) => ({ ...prev, drowsiness: now }));
            playAlarm(); // Reproduz o som de alarme
          } else if (data.distraction_alert && now - lastAlertTime.distraction >= 10000) {
            Alert.alert('Alerta de Distração', 'O motorista parece distraído!');
            setLastAlertTime((prev) => ({ ...prev, distraction: now }));
            playAlarm(); // Reproduz o som de alarme
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

  // Inicia/para a captura automática de frames
  const toggleCapturaAutomatica = () => {
    if (isCapturing) {
      // Parar a captura
      setIsCapturing(false);
      if (capturaIntervalRef.current) {
        clearInterval(capturaIntervalRef.current);
        capturaIntervalRef.current = null;
      }
      // Resetar os estados de alertas
      setLastAlertTime({
        drowsiness: 0,
        distraction: 0,
        yawning: 0,
      });
    } else {
      // Iniciar a captura
      setIsCapturing(true);
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
        facing="front"
        ref={cameraRef}
        mute={true} // Desativa o som da câmera
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCapturaAutomatica}>
            <Text style={styles.text}>{isCapturing ? 'Parar Captura' : 'Iniciar Captura'}</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

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
});
