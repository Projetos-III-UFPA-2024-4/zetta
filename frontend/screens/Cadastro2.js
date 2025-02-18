import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DatePicker from '@react-native-community/datetimepicker';

const CadastroMotorista = ({ navigation }) => {
    const [id, setId] = useState('');
    const [tipoId, setTipoId] = useState('');
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [emailOuNumero, setEmailOuNumero] = useState('');
    const [dataNascimento, setDataNascimento] = useState(new Date());
    const [tipoCarteira, setTipoCarteira] = useState('');
    const [genero, setGenero] = useState('');
    const [showTipoCarteira, setShowTipoCarteira] = useState(false); 
    const [showGenero, setShowGenero] = useState(false); 
    const [showDataNascimento, setShowDataNascimento] = useState(false);
    const [usaVeiculo, setUsaVeiculo] = useState('Não');
    const [placaVeiculo, setPlacaVeiculo] = useState('');

  const gerarId = (tipo) => {
    const prefixo = tipo === 'Admin' ? 'ADM' : 'USER';
    return `${prefixo}${Math.floor(Math.random() * 10000)}`;
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logocadastro.png')} style={styles.logoImage} />
      <Image source={require('../assets/quadro1.png')} style={styles.quadroImage} />
     

      <TextInput
        style={styles.inputA}
        placeholder="Nome Completo"
        placeholderTextColor="#fff"
        value={nomeCompleto}
        onChangeText={setNomeCompleto}
      />

      <TextInput
        style={styles.inputA}
        placeholder="Email ou número"
        placeholderTextColor="#fff"
        value={emailOuNumero}
        onChangeText={setEmailOuNumero}
      />

      {/* Mostrar Picker de Data de Nascimento somente se a seleção estiver ativa */}
      <TouchableOpacity onPress={() => setShowDataNascimento(!showDataNascimento)} style={styles.inputB}>
        <Text style={styles.inputA}>{dataNascimento ? `Data de Nascimento: ${dataNascimento.toLocaleDateString()}` : 'Selecione a Data de Nascimento'}</Text>
      </TouchableOpacity>
      {showDataNascimento && (
        <DatePicker
          style={styles.datePicker}
          value={dataNascimento}
          mode="date"
          placeholder="Data de Nascimento"
          format="DD/MM/YYYY"
          minDate="01-01-1900"
          maxDate={new Date()}
          confirmBtnText="Confirmar"
          cancelBtnText="Cancelar"
          customStyles={{
            dateIcon: {
              display: 'none',
            },
            dateInput: {
              borderWidth: 0,
              alignItems: 'flex-start',
            },
            placeholderText: {
              color: '#fff',
              fontSize: 16,
            },
            dateText: {
              color: '#fff',
              fontSize: 16,
            },
          }}
          onChange={(event, selectedDate) => setDataNascimento(selectedDate || dataNascimento)}
        />
      )}

      <Image source={require('../assets/quadro2.png')} style={styles.quadroImage2} />

      {/* Mostrar Picker de Tipo de Carteira somente se a seleção estiver ativa */}
      <TouchableOpacity onPress={() => setShowTipoCarteira(!showTipoCarteira)} style={styles.pickerContainer}>
        <Text style={styles.inputA}>{tipoCarteira ? `Tipo de Carteira: ${tipoCarteira}` : 'Selecione o Tipo de Carteira'}</Text>
      </TouchableOpacity>
      {showTipoCarteira && (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={tipoCarteira}
            style={styles.picker}
            onValueChange={(itemValue) => setTipoCarteira(itemValue)}
            itemStyle={{ fontSize: 18, color: '#fff' }}
          >
            <Picker.Item label="Tipo A" value="A" />
            <Picker.Item label="Tipo B" value="B" />
            <Picker.Item label="Tipo C" value="C" />
            <Picker.Item label="Tipo D" value="D" />
          </Picker>
        </View>
      )}

      {/* Mostrar Picker de Gênero somente se a seleção estiver ativa */}
      <TouchableOpacity onPress={() => setShowGenero(!showGenero)} style={styles.pickerContainer}>
        <Text style={styles.inputA}>{genero ? `Gênero: ${genero}` : 'Selecione o Gênero'}</Text>
      </TouchableOpacity>
      {showGenero && (
        <View style={styles.pickerContainer}>
            <Picker
            selectedValue={genero}
            style={styles.picker}
            onValueChange={(itemValue) => setGenero(itemValue)}
            itemStyle={{ fontSize: 15, color: '#fff' }} 
            >
            <Picker.Item label="Masculino" value="Masculino" />
            <Picker.Item label="Feminino" value="Feminino" />
            <Picker.Item label="Outro" value="Outro" />
          </Picker>
        </View>
      )}

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
    backgroundColor: '#042B3D',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoImage: {
    position: 'absolute',
    width: 100,
    height: 100,
    top: 50,
  },
  inputA: {
    width: '80%',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    marginBottom: 20,
    top: -40,
    padding: 10,
    color: '#fff',
  },
  inputB: {
    width: '106%',
    marginBottom: 20,
    left: 40,
    top: -10,
    padding: 10,
  },
  datePicker: {
    width: '70%',
    marginBottom: -35,
    left: 85,
    top: -100,
  },
  pickerContainer: {
    width: '70%',
    marginBottom: 1,
    left: -15,
    top: 30,
  },
  picker: {
    color: '#fff',
    height: 0,
    width: 120,
    top: -175,
    left: 200,
  },
  button: {
    backgroundColor: '#61B8D8',
    padding: 10,
    top: 40,
    borderRadius: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  voltarButton: {
    top: 25,
    marginTop: 20,
  },
  voltarText: {
    color: '#61B8D8',
  },
  quadroImage: {
    position: 'absolute',
    top: 150,
    width: 340,
    height: 190,
    marginBottom: 20,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 0,
  },
  quadroImage2: {
    position: 'absolute',
    top: 400,
    width: 340,
    height: 120,
    marginBottom: 20,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 0,
  },
});

export default CadastroMotorista;
