import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const CadastroMotorista = ({ navigation }) => {
  const [nome, setNome] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Motorista</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do motorista"
        value={nome}
        onChangeText={setNome}
      />
      <TouchableOpacity style={styles.button} onPress={() => alert('Motorista cadastrado!')}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.voltarButton}>
        <Text style={styles.voltarText}>Voltar</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    borderBottomWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
  button: {
    backgroundColor: '#61B8D8',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  voltarButton: {
    marginTop: 20,
  },
  voltarText: {
    color: '#61B8D8',
  },
});

export default CadastroMotorista;
