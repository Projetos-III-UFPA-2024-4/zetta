import React, { useState, useEffect, useRef } from 'react';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

export default function CameraFunction() {
  const [facing, setFacing] = useState('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [detector, setDetector] = useState(null);
  const cameraRef = useRef(null);

  // Carregar o modelo de detecção facial
  useEffect(() => {
    const loadModel = async () => {
      const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
      const detectorConfig = {
        runtime: 'mediapipe',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
      };
      const detector = await faceLandmarksDetection.createDetector(model, detectorConfig);
      setDetector(detector);
    };

    loadModel();
  }, []);

  // Verificar permissões da câmera
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

  // Trocar entre câmera frontal e traseira
  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  // Processar frames da câmera
  const handleCameraStream = async () => {
    if (cameraRef.current && detector) {
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      const image = new Image();
      image.src = `data:image/jpeg;base64,${photo.base64}`;

      image.onload = async () => {
        const faces = await detector.estimateFaces(image);
        console.log(faces); // Exibe os landmarks no console
      };
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
        onCameraReady={handleCameraStream}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Trocar Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleCameraStream}>
            <Text style={styles.text}>Detectar Rosto</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
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
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
