import React, { useState, useEffect, useRef } from 'react';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import Svg, { Line } from 'react-native-svg';
import * as FileSystem from 'expo-file-system';

export default function CameraFunction() {
  const [facing, setFacing] = useState('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [detector, setDetector] = useState(null);
  const [faces, setFaces] = useState([]);
  const cameraRef = useRef(null);

  // Carregar o modelo de detecção facial
  useEffect(() => {
    const loadModel = async () => {
      await tf.ready(); // Certifique-se de que o TensorFlow.js está pronto
      const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
      const detectorConfig = {
        runtime: 'tfjs', // Usar o runtime do TensorFlow.js
      };
      const detector = await faceLandmarksDetection.createDetector(model, detectorConfig);
      setDetector(detector); // Atualiza o estado do detector
    };

    loadModel();
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

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const handleCameraStream = async () => {
    if (cameraRef.current && detector) {
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      const imageUri = `${FileSystem.documentDirectory}photo.jpg`;
      await FileSystem.writeAsStringAsync(imageUri, photo.base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const image = { uri: imageUri };
      const detectedFaces = await detector.estimateFaces(image);
      setFaces(detectedFaces);
    }
  };

  const renderFaceConnections = () => {
    return faces.map((face, index) => {
      const keypoints = face.keypoints;

      // Pontos dos olhos
      const leftEye = [
        keypoints[33], keypoints[246], keypoints[161], keypoints[160], keypoints[159],
        keypoints[158], keypoints[157], keypoints[173], keypoints[133], keypoints[155],
        keypoints[154], keypoints[153], keypoints[145], keypoints[144], keypoints[163],
        keypoints[7], keypoints[33]
      ];

      const rightEye = [
        keypoints[263], keypoints[388], keypoints[387], keypoints[386], keypoints[385],
        keypoints[384], keypoints[398], keypoints[362], keypoints[382], keypoints[381],
        keypoints[380], keypoints[374], keypoints[373], keypoints[390], keypoints[249],
        keypoints[263]
      ];

      // Pontos da boca
      const mouth = [
        keypoints[61], keypoints[185], keypoints[40], keypoints[39], keypoints[37],
        keypoints[0], keypoints[267], keypoints[269], keypoints[270], keypoints[409],
        keypoints[291], keypoints[375], keypoints[321], keypoints[405], keypoints[314],
        keypoints[17], keypoints[84], keypoints[181], keypoints[91], keypoints[146],
        keypoints[61]
      ];

      return (
        <Svg key={index} style={styles.overlay}>
          {leftEye.map((point, i) => (
            <Line
              key={`leftEye-${i}`}
              x1={leftEye[i].x}
              y1={leftEye[i].y}
              x2={leftEye[(i + 1) % leftEye.length].x}
              y2={leftEye[(i + 1) % leftEye.length].y}
              stroke="green"
              strokeWidth="2"
            />
          ))}
          {rightEye.map((point, i) => (
            <Line
              key={`rightEye-${i}`}
              x1={rightEye[i].x}
              y1={rightEye[i].y}
              x2={rightEye[(i + 1) % rightEye.length].x}
              y2={rightEye[(i + 1) % rightEye.length].y}
              stroke="green"
              strokeWidth="2"
            />
          ))}
          {mouth.map((point, i) => (
            <Line
              key={`mouth-${i}`}
              x1={mouth[i].x}
              y1={mouth[i].y}
              x2={mouth[(i + 1) % mouth.length].x}
              y2={mouth[(i + 1) % mouth.length].y}
              stroke="white"
              strokeWidth="2"
            />
          ))}
        </Svg>
      );
    });
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
      {renderFaceConnections()}
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
