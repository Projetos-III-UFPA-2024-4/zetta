from scipy.spatial import distance as dist
from imutils.video import VideoStream
from threading import Thread
import numpy as np
import playsound
import argparse
import imutils
import time
import cv2
import mediapipe as mp  # Importando MediaPipe

# Função para tocar alarme com verificação global de alarme tocando
def tocar_alarme(caminho):
    global ALARME_TOCANDO
    if not ALARME_TOCANDO:
        ALARME_TOCANDO = True
        playsound.playsound(caminho)
        ALARME_TOCANDO = False

def calcular_ear(olho):
    """Calcula a relação de aspecto dos olhos (EAR)."""
    A = dist.euclidean(olho[1], olho[5])
    B = dist.euclidean(olho[2], olho[4])
    C = dist.euclidean(olho[0], olho[3])
    ear = (A + B) / (2.0 * C)
    return ear

def calcular_mar(boca):
    """Calcula a relação de aspecto da boca (MAR) usando pontos específicos do MediaPipe Face Mesh."""
    # Pontos da boca no MediaPipe Face Mesh
    A = dist.euclidean(boca[5], boca[14])  # Distância vertical entre os lábios superior e inferior
    B = dist.euclidean(boca[4], boca[13])  # Distância vertical entre os lábios superior e inferior
    C = dist.euclidean(boca[6], boca[15])  # Distância vertical adicional entre os lábios
    D = dist.euclidean(boca[0], boca[19])  # Distância horizontal entre os cantos da boca

    mar = (A + B + C) / (3.0 * D)
    return mar

def calcular_orientacao(shape):
    """Calcula a orientação da cabeça com base nos landmarks faciais."""
    nariz = shape[1]  # Ponto do nariz
    queixo = shape[152]  # Ponto do queixo
    olho_esq = shape[33]  # Ponto do olho esquerdo
    olho_dir = shape[263]  # Ponto do olho direito

    # Distância vertical entre o nariz e o queixo
    dist_nariz_queixo = dist.euclidean(nariz, queixo)

    # Distância horizontal entre os olhos
    dist_olhos = dist.euclidean(olho_esq, olho_dir)

    # Razão entre a distância vertical e horizontal
    orientacao = dist_nariz_queixo / dist_olhos
    return orientacao

def desenhar_ligacoes_faciais(frame, shape):
    """Desenha linhas conectando os pontos faciais."""
    # Conectar pontos dos olhos
    olho_esq = shape[[33, 246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144, 163, 7, 33]]  # Pontos do olho esquerdo
    olho_dir = shape[[263, 388, 387, 386, 385, 384, 398, 362, 382, 381, 380, 374, 373, 390, 249, 263]]  # Pontos do olho direito

    for i in range(len(olho_esq) - 1):
        cv2.line(frame, tuple(olho_esq[i].astype(int)), tuple(olho_esq[i + 1].astype(int)), (0, 255, 0), 1)  
    for i in range(len(olho_dir) - 1):
        cv2.line(frame, tuple(olho_dir[i].astype(int)), tuple(olho_dir[i + 1].astype(int)), (0, 255, 0), 1)

    # Conectar pontos da boca
    boca = shape[[61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146, 61]]  # Pontos da boca
    for i in range(len(boca) - 1):
        cv2.line(frame, tuple(boca[i].astype(int)), tuple(boca[i + 1].astype(int)), (255, 255, 255), 1) 

# Configurações
ap = argparse.ArgumentParser()
ap.add_argument("-a", "--alarme", type=str, default="alarm.wav", help="Caminho do arquivo de alarme sonoro.")
ap.add_argument("-w", "--webcam", type=int, default=0, help="Índice da webcam no sistema.")
ap.add_argument("-f", "--fps", type=int, default=30, help="Taxa de frames por segundo (FPS) desejada.")
args = vars(ap.parse_args())

LIMIAR_EAR = 0.19  # Limiar para detecção de olhos fechados
LIMIAR_MAR = 0.9   # Limiar para detecção de bocejos (ajustado)
LIMIAR_ORIENTACAO = 0.4  # Limiar para detecção de distração (ajuste conforme necessário)
QTD_CONSEC_FRAMES = 60  # Número de frames consecutivos para acionar o alarme

CONTADOR_EAR = 0  # Contador de frames com olhos fechados
CONTADOR_MAR = 0  # Contador de frames com bocejos
CONTADOR_ORIENTACAO = 0  # Contador de frames com distração
CONTADOR_PISCADAS = 0  # Contador de piscadas
ALARME_ON = False  # Estado do alarme
ALARME_TOCANDO = False  # Estado do som do alarme
DISTRACAO_ALARME_ON = False  # Estado do alarme de distração
tempo_alarme_distracao = 0  # Tempo em que o alarme de distração foi acionado

# Inicializa o MediaPipe Face Mesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    max_num_faces=1,  # Número máximo de faces a serem detectadas
    refine_landmarks=True,  # Refina os landmarks para maior precisão
    min_detection_confidence=0.5,  # Confiança mínima para detecção
    min_tracking_confidence=0.5,  # Confiança mínima para rastreamento
)

# Inicializa a captura de vídeo
print("[INFO] Iniciando thread de fluxo de vídeo...")
vs = VideoStream(src=args["webcam"]).start()
time.sleep(1.0)  # Aguarda a câmera inicializar

# Loop principal
while True:
    frame = vs.read()
    if frame is None:
        print("[ERRO] Não foi possível capturar o quadro da câmera.")
        continue

    # Reduz a resolução do frame para melhorar o desempenho
    frame = imutils.resize(frame, width=720) 
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)  # Converte para RGB (necessário para o MediaPipe)

    # Detecção de faces e marcos faciais com MediaPipe Face Mesh
    resultados_face_mesh = face_mesh.process(frame_rgb)

    if resultados_face_mesh.multi_face_landmarks:
        for face_landmarks in resultados_face_mesh.multi_face_landmarks:
            # Extrai os landmarks faciais
            shape = np.array([[lm.x * frame.shape[1], lm.y * frame.shape[0]] for lm in face_landmarks.landmark])

            # Desenha todos os pontos faciais no frame
            desenhar_ligacoes_faciais(frame, shape)

            # Cálculo do EAR, MAR e orientação da cabeça
            olho_esq = shape[[33, 160, 158, 133, 153, 144]]  # Pontos do olho esquerdo
            olho_dir = shape[[263, 387, 385, 362, 380, 373]]  # Pontos do olho direito
            boca = shape[[61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291]]  # Pontos da boca            
            ear_esq = calcular_ear(olho_esq)
            ear_dir = calcular_ear(olho_dir)
            mar = calcular_mar(boca)
            orientacao = calcular_orientacao(shape)
            
            ear = (ear_esq + ear_dir) / 2.0

            # Verifica se o EAR está abaixo do limiar (olhos fechados)
            if ear < LIMIAR_EAR:
                CONTADOR_EAR += 1
                if CONTADOR_EAR >= QTD_CONSEC_FRAMES:
                    if not ALARME_ON:
                        ALARME_ON = True
                        if args["alarme"] != "":
                            t = Thread(target=tocar_alarme, args=(args["alarme"],))
                            t.daemon = True
                            t.start()
                    cv2.putText(frame, "[ALERTA] SONOLENCIA!", (10, frame.shape[0] - 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            else:
                if CONTADOR_EAR >= 1:
                    CONTADOR_PISCADAS += 1
                CONTADOR_EAR = 0
                if ALARME_ON:
                    ALARME_ON = False

            # Verifica se o MAR está acima do limiar (bocejo)
            if mar > LIMIAR_MAR:
                CONTADOR_MAR += 1
                if CONTADOR_MAR >= QTD_CONSEC_FRAMES:
                    cv2.putText(frame, "[ALERTA] BOCEJO DETECTADO!", (10, frame.shape[0] - 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
            else:
                CONTADOR_MAR = 0

            # Verifica se a orientação da cabeça indica distração
            if orientacao < LIMIAR_ORIENTACAO:
                CONTADOR_ORIENTACAO += 1
                if CONTADOR_ORIENTACAO >= QTD_CONSEC_FRAMES:
                    if not ALARME_ON and not ALARME_TOCANDO:
                        DISTRACAO_ALARME_ON = True
                        tempo_alarme_distracao = time.time()
                        if args["alarme"] != "":
                            t = Thread(target=tocar_alarme, args=(args["alarme"],))
                            t.daemon = True
                            t.start()
            else:
                CONTADOR_ORIENTACAO = 0
                if DISTRACAO_ALARME_ON:
                    DISTRACAO_ALARME_ON = False

            # Exibe informações no frame
            cv2.putText(frame, "EAR: {:.2f}".format(ear), (300, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            cv2.putText(frame, "Piscadas: {}".format(CONTADOR_PISCADAS), (300, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            cv2.putText(frame, "MAR: {:.2f}".format(mar), (300, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            cv2.putText(frame, "Orientacao: {:.2f}".format(orientacao), (300, 120), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)

    if DISTRACAO_ALARME_ON:
        cv2.putText(frame, "[ALERTA] DISTRACAO DETECTADA!", (10, frame.shape[0] - 150), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 0, 0), 2)
        if time.time() - tempo_alarme_distracao >= 2:  # Verifica se passaram 2 segundos
            DISTRACAO_ALARME_ON = False  # Desativa o alarme

    # Exibe o frame processado
    cv2.imshow("Monitoramento em Tempo Real", frame)
    tecla = cv2.waitKey(1) & 0xFF

    # Encerra o loop se a tecla 'q' for pressionada
    if tecla == ord("q"):
        break

# Libera recursos
cv2.destroyAllWindows()
vs.stop()