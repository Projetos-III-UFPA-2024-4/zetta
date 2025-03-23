import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Modal, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const CadastroMotorista = ({ navigation }) => {
    const [user_id, setId] = useState('');
    const [tipoId, setTipoId] = useState('');
    const [nome, setNome] = useState('');
    const [emailOuNumero, setEmailOuNumero] = useState('');
    const [dataNascimento, setDataNascimento] = useState(new Date());
    const [tipoCarteira, setTipoCarteira] = useState('');
    const [showTipoCarteira, setShowTipoCarteira] = useState(false); 
    const [showDataNascimento, setShowDataNascimento] = useState(false);
    const [placaVeiculo, setPlacaVeiculo] = useState(''); 
    const [showTipoId, setShowTipoId] = useState(false);
    const [senha, setSenha] = useState(''); // Estado para o campo de senha

      
    const handleDateChange = (event, selectedDate) => {
        setShowDataNascimento(false); // Fecha o modal ou o picker
    if (selectedDate) {
        setDataNascimento(selectedDate); // Atualiza a data selecionada
          }
    };

    
// Função para gerar o próximo ID
    const gerarId = async (tipo) => {
        try {
            const response = await fetch(`http://44.196.219.45:5000/ultimo-id/${tipo}`);
            const data = await response.json();
            const ultimoId = data.ultimoId || `${tipo === 'admin' ? 'ADM' : 'USER'}0`; // Caso não haja IDs, comece com USER0 ou ADM0

            // Extrai o número do último ID
            const prefixo = tipo === 'admin' ? 'ADM' : 'USER';
            const ultimoNumero = parseInt(ultimoId.replace(prefixo, ''), 10);

            // Verifica se o número foi extraído corretamente
            if (isNaN(ultimoNumero)) {
                console.error('Erro ao extrair número do último ID:', ultimoId);
                return `${prefixo}1`; // Retorna USER1 ou ADM1 em caso de erro
            }

            // Incrementa o número
            const novoNumero = ultimoNumero + 1;

            // Retorna o novo ID no formato USERX ou ADMX
            return `${prefixo}${novoNumero}`;
        } catch (error) {
            console.error('Erro ao gerar ID:', error);
            return `${tipo === 'admin' ? 'ADM' : 'USER'}1`; // Retorna USER1 ou ADM1 em caso de erro
        }
    };

    // Gera o ID quando o tipo de usuário é selecionado
    useEffect(() => {
        if (tipoId) {
            gerarId(tipoId).then(id => setId(id));
        }
    }, [tipoId]);


    // Verifica se o ID já existe no banco de dados
    const verificarIdExistente = async (novoId) => {
        try {
            const response = await fetch(`http://44.196.219.45:5000/verificar-id/${novoId}`);
            const data = await response.json();
            return data.exists;
        } catch (error) {
            console.error('Erro ao verificar ID existente:', error);
            return false;
        }
    };

    const salvarNoBanco = async () => {
        const idExists = await verificarIdExistente(user_id);
        
        if (idExists) {
            console.error('O user_id já existe. Tente novamente.');
            return;
        }

        const usuario = {
            user_id,
            tipo: tipoId,
            nome,
            emailOuNumero,
            dataNascimento,
            tipoCarteira,
            placaVeiculo: tipoId === 'user' ? placaVeiculo : null,
            senha,
        };
    
        try {
            const response = await fetch('http://44.196.219.45:5000/criar-usuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(usuario),
            });

            if (!response.ok) {
                throw new Error('Erro ao cadastrar o motorista');
            }
    
            const data = await response.json();
            console.log('Cadastro realizado com sucesso:', data);
            navigation.goBack();
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('../assets/logocadastro.png')} style={styles.logoImage} />
            <Image source={require('../assets/quadro1.png')} style={styles.quadroImage} />

            <TextInput
                style={styles.inputA}
                placeholder="Nome Completo"
                placeholderTextColor="#fff"
                value={nome}
                onChangeText={setNome}
            />

            <TextInput
                style={styles.inputA1}
                placeholder="Email ou número"
                placeholderTextColor="#fff"
                value={emailOuNumero}
                onChangeText={setEmailOuNumero}
            />

      {/* Botão para abrir o seletor de data */}
      <TouchableOpacity onPress={() => setShowDataNascimento(true)} style={styles.inputB}>
        <Text style={styles.inputC1}>
          {dataNascimento ? `Data de Nascimento: ${dataNascimento.toLocaleDateString()}` : 'Selecione a Data de Nascimento'}
        </Text>
      </TouchableOpacity>

      {/* Modal para exibir o DateTimePicker */}
      {showDataNascimento && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showDataNascimento}
          onRequestClose={() => setShowDataNascimento(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <DateTimePicker
                value={dataNascimento || new Date()} // Valor inicial (data atual se não houver seleção)
                mode="date" // Modo de seleção (data)
                display={Platform.OS === 'ios' ? 'spinner' : 'default'} // Estilo do picker (spinner no iOS)
                onChange={handleDateChange}
              />
            </View>
          </View>
        </Modal>
      )}
    
            

            {tipoId === 'user' && (
                <Image source={require('../assets/quadro2.png')} style={styles.quadroImage2} /> 
            )} 

            {/* Campo para tipo de usuário */}
            <TouchableOpacity onPress={() => setShowTipoId(!showTipoId)} style={styles.inputD}>
                <Text style={styles.inputC2}>Tipo de Usuário: {tipoId === 'user' ? 'User' : 'Admin'}</Text>
            </TouchableOpacity>
            {showTipoId && (
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={tipoId}
                        style={styles.picker}
                        onValueChange={(itemValue) => setTipoId(itemValue)}
                        itemStyle={{ fontSize: 18, color: '#fff' }}
                    >
                        <Picker.Item label="User" value="user" />
                        <Picker.Item label="Admin" value="admin" />
                    </Picker>
                </View>
            )}

            {/* Campos específicos para o tipo de usuário "user" */}
            {tipoId === 'user' && (
                <>
                    {/* Campo Tipo de Carteira */}
                    <TouchableOpacity onPress={() => setShowTipoCarteira(!showTipoCarteira)} style={styles.inputE1}>
                        <Text style={styles.inputC2}>
                            {tipoCarteira ? `Tipo de Veículo: ${tipoCarteira}` : 'Selecione o Tipo de Veículo'}
                        </Text>
                    </TouchableOpacity>
                    {showTipoCarteira && (
                        <View style={styles.pickerContainer}>
                            <Picker
                            selectedValue={tipoCarteira}
                            style={styles.picker}
                            onValueChange={(itemValue) => setTipoCarteira(itemValue)}
                            >
                                <Picker.Item label="2 Eixos" value="A" />
                                <Picker.Item label="3 Eixos" value="B" />
                                <Picker.Item label="Cavalo Trucado" value="C" />
                                <Picker.Item label="Bitrem" value="D" />
                                <Picker.Item label="Tritrem" value="E" />
                                <Picker.Item label="Rodotrem" value="F" />
                            </Picker>
                        </View>
                    )}

                    <TextInput
                        style={styles.inputE}
                        placeholder="Placa do Veículo"
                        placeholderTextColor="#fff"
                        value={placaVeiculo}
                        onChangeText={setPlacaVeiculo}
                    />
                </>
            )} 

            
            <Image source={require('../assets/quadro2.png')} style={styles.quadroImage3} /> 


            <TextInput
                style={styles.inputF1}
                placeholder="Senha"
                placeholderTextColor="#fff"
                secureTextEntry={true} // Para ocultar a senha
                value={senha}
                onChangeText={setSenha}
            />

            <TextInput
                style={styles.inputF2}
                placeholder="ID"
                placeholderTextColor="#fff"
                value={user_id}
                editable={false} // Impede a edição manual
            />

            <TouchableOpacity style={styles.button} onPress={salvarNoBanco}>
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
        top: 35,
    },
    inputA: {
        position: 'absolute',
        padding: 10,
        width: '80%',
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        marginBottom: 20,
        top: 180,
        color: '#fff',
    },
    inputA1: {
        position: 'absolute',
        padding: 10,
        width: '80%',
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        marginBottom: 20,
        top: 230,
        color: '#fff',
    },
    inputB: {
        position: 'absolute',
        width: '80%',
        marginBottom: 20,
        top: 280,
    },
    inputC1: {
        position: 'absolute',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        color: '#fff',
        marginBottom: 10,
    },
    inputC2: {
        position: 'absolute',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        color: '#fff',
        marginBottom: 10,
    },
    inputD: {
        position: 'absolute',
        width: '80%',
        marginBottom: 20,
        top: 330,
    },
    inputE: {
        position: 'absolute',
        padding: 10,
        width: '80%',
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        marginBottom: 20,
        top: 460,
        color: '#fff',
    },  
    inputE1: {
        position: 'absolute',
        padding: 10,
        width: '80%',
        marginBottom: 20,
        top: 410,
        color: '#fff',
    },
    inputF1: {
        position: 'absolute',
        padding: 10,
        width: '40%',
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        marginBottom: 20,
        right: 207,
        top: 570,
        color: '#fff',
    },
    inputF2: {
        position: 'absolute',
        padding: 10,
        width: '30%',
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        marginBottom: 20,
        right: 70,
        top: 570,
        color: '#fff',
    },
    datePicker: {
        width: '80%',
        marginBottom: -35,
        left: 85,
        top: -90,
    },
    pickerContainer: {
        position: 'absolute',
        top: 100,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        zIndex: 1000,
      },
    picker1: {
        color: '#fff',
        height: 0,
        width: 120,
        top: -150,
        left: 200,
    },
    button: {
        position: 'absolute',
        backgroundColor: '#61B8D8',
        padding: 10,
        top: 670,
        borderRadius: 15,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    voltarButton: {
        position: 'absolute',
        top: 700,
        marginTop: 20,
    },
    voltarText: {
        color: '#61B8D8',
    },
    quadroImage: {
        position: 'absolute',
        top: 170,
        width: 360,
        height: 220,
        marginBottom: 20,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 0,
    },
    quadroImage2: {
        position: 'absolute',
        top: 400,
        padding: 5,
        width: 360,
        height: 140,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 0,
    },
    quadroImage3: {
        position: 'absolute',
        top: 550,
        padding: 5,
        width: 360,
        height: 100,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 0,
    },
});

export default CadastroMotorista;