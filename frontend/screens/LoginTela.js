import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginTela = ({ navigation }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Verifica se os campos estão vazios
    if (id === '' || password === '') {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      // Faz a requisição para o servidor
      const response = await fetch('http://44.196.219.45:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: id, senha: password }), // Usa o valor de `id`
      });

      const data = await response.json();

      // Verifica se a resposta foi bem-sucedida
      if (response.ok) {
        // Salva o user_id no AsyncStorage
        await AsyncStorage.setItem('user_id', id);

        // Navega para a tela correta com base no tipo de usuário
        if (data.redirectTo === '/HomeADM') {
          navigation.navigate('HomeADM', { userId: id }); // Passa o userId como parâmetro
        } else if (data.redirectTo === '/HomeUSER') {
          navigation.navigate('HomeUSER', { userId: id }); // Passa o userId como parâmetro
        }
      } else {
        // Exibe uma mensagem de erro se a autenticação falhar
        Alert.alert('Erro', data.mensagem || 'Falha ao autenticar.');
      }
    } catch (error) {
      // Exibe uma mensagem de erro se houver problemas de conexão
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
      console.error(error);
    }
  };

  const handleCadastrarEmpresa = () => {
    // Navega para a tela de CadastroMotorista
    navigation.navigate('CadastroMotorista');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/appazulescuro.png')} // Caminho da imagem
        style={styles.logo}
      />
      <Text style={styles.title}>Número do ID</Text>
      <TextInput
        style={styles.input}
        placeholder="ID"
        value={id}
        onChangeText={setId}
        keyboardType="default"
      />
      <Text style={styles.title}>Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity onPress={() => Alert.alert('Esqueceu a senha?', 'Funcionalidade de recuperação de senha.')}>
        <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.confirmButton} onPress={handleLogin}>
        <Text style={styles.confirmButtonText}>Confirmar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cadastrarButton} onPress={handleCadastrarEmpresa}>
        <Text style={styles.cadastrButtonText}>Cadastrar Empresa</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Image
          source={require('../assets/rodape.png')} // Caminho da imagem
          style={styles.footerImage}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 150,
    paddingHorizontal: 16,
    backgroundColor: '#61B8D8', // Cor de fundo
  },
  logo: {
    alignSelf: 'center',
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    left: 58,
    marginBottom: 5,
    textAlign: 'left',
    color: '#fff',
  },
  input: {
    height: 40,
    width: 280,
    alignSelf: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  forgotPassword: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
  },
  confirmButton: {
    width: 150,
    height: 45,
    backgroundColor: '#042B3D',
    alignSelf: 'center',
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 16, // Espaçamento entre os botões
  },
  cadastrarButton: {
    width: 200,
    height: 45,
    alignSelf: 'center',
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2, // Adiciona uma borda
    borderColor: '#042B3D', // Cor da borda (azul escuro)
    top: 180,
  },
  confirmButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cadastrButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    alignItems: 'center',
  },
  footerImage: {
    width: 70,
    height: 30,
    left: 168,
  },
});

export default LoginTela;
