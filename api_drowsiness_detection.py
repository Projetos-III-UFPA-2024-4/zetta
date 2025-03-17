from flask import Flask, jsonify, request
import cv2
import numpy as np
import logging
from scipy.spatial import distance as dist
import mediapipe as mp

app = Flask(__name__)

# Configurações
LIMIAR_EAR = 0.19  # Limiar para detecção de olhos fechados
LIMIAR_MAR = 0.9   # Limiar para detecção de bocejos
LIMIAR_ORIENTACAO = 0.4  # Limiar para detecção de distração

def calcular_ear(olho):
    """Calcula a relação de aspecto dos olhos (EAR)."""
    A = dist.euclidean(olho[1], olho[5])
    B = dist.euclidean(olho[2], olho[4])
    C = dist.euclidean(olho[0], olho[3])
    ear = (A + B) / (2.0 * C)
    return ear

def calcular_mar(boca):
    """Calcula a relação de aspecto da boca (MAR) usando pontos específicos do MediaPipe Face Mesh."""
    A = dist.euclidean(boca[5], boca[14])
    B = dist.euclidean(boca[4], boca[13])
    C = dist.euclidean(boca[6], boca[15])
    D = dist.euclidean(boca[0], boca[19])
    mar = (A + B + C) / (3.0 * D)
    return mar

def calcular_orientacao(shape):
    """Calcula a orientação da cabeça com base nos landmarks faciais."""
    nariz = shape[1]
    queixo = shape[152]
    olho_esq = shape[33]
    olho_dir = shape[263]
    dist_nariz_queixo = dist.euclidean(nariz, queixo)
    dist_olhos = dist.euclidean(olho_esq, olho_dir)
    orientacao = dist_nariz_queixo / dist_olhos
    return orientacao

def processar_frame(frame):
    """Processa um frame e retorna os resultados."""
    # Inicializa o MediaPipe Face Mesh dentro da função para evitar problemas de estado
    mp_face_mesh = mp.solutions.face_mesh
    face_mesh = mp_face_mesh.FaceMesh(
        max_num_faces=1,
        refine_landmarks=True,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    )

    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    resultados_face_mesh = face_mesh.process(frame_rgb)
    resultados = {
        "drowsiness_alert": False,
        "yawning_alert": False,
        "distraction_alert": False,
        "ear_value": 0.0,
        "mar_value": 0.0,
        "orientation_value": 0.0
    }

    if resultados_face_mesh.multi_face_landmarks:
        for face_landmarks in resultados_face_mesh.multi_face_landmarks:
            # Extrai os landmarks faciais
            shape = np.array([[lm.x * frame.shape[1], lm.y * frame.shape[0]] for lm in face_landmarks.landmark])

            # Cálculo do EAR, MAR e orientação da cabeça
            olho_esq = shape[[33, 160, 158, 133, 153, 144]]  # Pontos do olho esquerdo
            olho_dir = shape[[263, 387, 385, 362, 380, 373]]  # Pontos do olho direito
            boca = shape[[61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291]]  # Pontos da boca
            ear_esq = calcular_ear(olho_esq)
            ear_dir = calcular_ear(olho_dir)
            mar = calcular_mar(boca)
            orientacao = calcular_orientacao(shape)
            ear = (ear_esq + ear_dir) / 2.0

            resultados["ear_value"] = ear
            resultados["mar_value"] = mar
            resultados["orientation_value"] = orientacao

            # Verifica se os limiares foram ultrapassados
            if ear < LIMIAR_EAR:
                resultados["drowsiness_alert"] = True
            if mar > LIMIAR_MAR:
                resultados["yawning_alert"] = True
            if orientacao < LIMIAR_ORIENTACAO:
                resultados["distraction_alert"] = True

    # Libera os recursos do MediaPipe Face Mesh
    face_mesh.close()
    return resultados

@app.route('/detectar_fadiga', methods=['POST'])
def detectar_fadiga():
    """Endpoint para detectar fadiga a partir de uma imagem enviada."""
    try:
        # Verifica se a imagem foi enviada
        if 'image' not in request.files:
            return jsonify({"error": "Nenhuma imagem enviada."}), 400

        # Lê a imagem enviada
        file = request.files['image']
        image_bytes = file.read()
        nparr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if frame is None:
            return jsonify({"error": "Não foi possível decodificar a imagem."}), 400

        # Processa o frame
        resultados = processar_frame(frame)

        # Retorna os resultados
        return jsonify(resultados)

    except Exception as e:
        logging.error(f"Erro ao processar a imagem: {e}")
        return jsonify({"error": "Erro interno ao processar a imagem."}), 500

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)  # Configuração básica de logging
    print("API rodando em: http://192.168.1.4:5002/detectar_fadiga")
    app.run(debug=False, host='192.168.1.4', port=5002)  # Execução do Flask para ser acessível externamente