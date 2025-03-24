import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeUSER = () => {
  const [ultimaCorrida, setUltimaCorrida] = useState({
    duracao: '', // Inicializado como vazio
    velocidadeMedia: '', // Inicializado como vazio
    maiorVelocidade: '', // Inicializado como vazio
    vezesAcimaLimite: '', // Inicializado como vazio
    classificacao: '', // Adicionado campo de classificação
  });
  const [isLoading, setIsLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState(null); // Estado para erros

  // Acessa o user_id passado como parâmetro de navegação
  const route = useRoute();
  const userId = route.params?.userId;

  // Hook de navegação
  const navigation = useNavigation();

  // Verifica se o userId está definido
  if (!userId) {
    console.error('User ID não definido.');
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro: User ID não definido.</Text>
      </View>
    );
  }

  useEffect(() => {
    const buscarUltimaCorrida = async () => {
      try {
        const response = await axios.get(`http://44.196.219.45:5000/ultima-corrida/${userId}`);
        console.log('Resposta completa da API:', response); // Log completo da resposta

        const data = response.data; // Acessa os dados diretamente

        console.log('Dados retornados pela API:', data); // Log dos dados

        // Verifica se os dados estão presentes e são válidos
        if (!data) {
          console.log('Nenhuma corrida encontrada para o user_id:', userId);
          // Não exibe a mensagem de erro, apenas campos vazios
          setUltimaCorrida({
            duracao: '', // Deixa vazio
            velocidadeMedia: '', // Deixa vazio
            maiorVelocidade: '', // Deixa vazio
            vezesAcimaLimite: '', // Deixa vazio
            classificacao: '', // Deixa vazio
          });
          return;
        }

        // Converte a duração de segundos para o formato HH:MM
        const horas = Math.floor(data.duracao / 3600);
        const minutos = Math.floor((data.duracao % 3600) / 60);
        const duracaoFormatada = `${horas}:${minutos.toString().padStart(2, '0')}`;

        // Verifica e formata os valores numéricos
        const velocidadeMedia = parseFloat(data.velocidade || 0).toFixed(2);
        const maiorVelocidade = parseFloat(data.maior_velocidade || 0).toFixed(2);
        const vezesAcimaLimite = data.cont_velocidade || 0;
        const classificacao = data.classificacao || 'N/A'; // Adicionado campo de classificação

        setUltimaCorrida({
          duracao: duracaoFormatada,
          velocidadeMedia: `${velocidadeMedia} km/h`,
          maiorVelocidade: `${maiorVelocidade} km/h`,
          vezesAcimaLimite: vezesAcimaLimite,
          classificacao: classificacao, // Adicionado campo de classificação
        });
      } catch (error) {
        console.error('Erro ao buscar última corrida:', error);
        setError('Erro ao carregar dados da última corrida.');
      } finally {
        setIsLoading(false); // Finaliza o carregamento
      }
    };

    buscarUltimaCorrida();
  }, [userId]);

  const handlePress = () => {
    navigation.navigate('CameraFunction', { userId }); // Passa o userId para a tela da câmera
  };


  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} style={styles.logoImage}>
        <Image source={require('../assets/play.png')} style={styles.logoImage} />
      </TouchableOpacity>

      <View style={styles.bolaAzulClaro} />
      <View style={styles.bolaAzul} />
      <Text style={styles.headerText}></Text>
      <Text style={styles.viagemText}>Tempo: {ultimaCorrida.duracao} horas</Text>
      <Text style={styles.distanciaText}>Velocidade Média: {ultimaCorrida.velocidadeMedia}</Text>
      <Text style={styles.sonolenciaText}>Maior Velocidade: {ultimaCorrida.maiorVelocidade}</Text>
      <Text style={styles.velocidadeText}>Vezes acima de 90 km/h: {ultimaCorrida.vezesAcimaLimite}</Text>
      <Text style={styles.geral}>GERAL:</Text>
      <Text style={styles.classificacaoText}>{ultimaCorrida.classificacao}</Text> 
      


      <Image source={require('../assets/cima.png')} style={styles.cima} />
      <Image source={require('../assets/meio1.png')} style={styles.meio1} />
      <Image source={require('../assets/baixo.png')} style={styles.baixo} />
      <Image source={require('../assets/barra.png')} style={styles.barradenavegacao} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  bolaAzulClaro: {
    position: 'absolute',
    width: 600,
    height: 700,
    borderRadius: 500,
    backgroundColor: '#8BC9DD',
    top: -500,
    left: -89.7,
    zIndex: -1,
  },
  bolaAzul: {
    position: 'absolute',
    width: 600,
    height: 700,
    borderRadius: 500,
    backgroundColor: '#61B8D8',
    top: -520,
    left: -89.7,
    zIndex: -1,
  },
  logoImage: {
    position: 'absolute',
    width: 101,
    height: 100,
    top: 10,
  },
  cima: {
    position: 'absolute',
    width: 300,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    height: 95,
    top: 239,
  },
  meio1: {
    position: 'absolute',
    width: 300,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    height: 90,
    top: 340,
  },
  baixo: {
    position: 'absolute',
    width: 300,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    height: 95,
    top: 440,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    top: -50,
    color: '#FFF',
  },
  viagemText: {
    position: 'absolute',
    top: 255,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    zIndex: 2,
  },
  distanciaText: {
    position: 'absolute',
    top: 290,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    zIndex: 2,
  },
  sonolenciaText: {
    position: 'absolute',
    top: 360,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    zIndex: 2,
  },
  velocidadeText: {
    position: 'absolute',
    top: 390,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    zIndex: 2,
  },
  classificacaoText: {
    position: 'absolute',
    top: 480,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    zIndex: 2,
  },
  geral: {
    position: 'absolute',
    left: 70,
    top: 450,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    zIndex: 2,
  },
  barradenavegacao: {
    position: 'absolute',
    left: 0,
    width: 502,
    height: 70,
    top: 733,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default HomeUSER;
