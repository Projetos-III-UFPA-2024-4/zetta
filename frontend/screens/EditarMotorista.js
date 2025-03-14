import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DatePicker from '@react-native-community/datetimepicker';
import { useRoute } from '@react-navigation/native';

const EditarMotorista = ({ navigation }) => {
    const route = useRoute();
    const { userId } = route.params; // Recebe o ID do motorista a ser editado

    const [user_id, setId] = useState('');
    const [tipoId, setTipoId] = useState('');
    const [nome, setNome] = useState('');
    const [emailOuNumero, setEmailOuNumero] = useState('');
    const [dataNascimento, setDataNascimento] = useState(new Date());
    const [tipoCarteira, setTipoCarteira] = useState('');
    const [showTipoCarteira, setShowTipoCarteira] = useState(false);
    const [showDataNascimento, setShowDataNascimento] = useState(false);
    const [placaVeiculo, setPlacaVeiculo] = useState('');
    const [senha, setSenha] = useState('');

    // Busca os dados do motorista ao carregar a tela
    useEffect(() => {
        const buscarMotorista = async () => {
            try {
                const response = await fetch(`http://192.168.100.8:5000/usuario/${userId}`);
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Erro na requisição: ${response.status} - ${errorText}`);
                }
                const data = await response.json();
                console.log('Dados do usuário recebidos:', data); // Log para depuração
                setId(data.user_id);
                setTipoId(data.tipo);
                setNome(data.nome);
                setEmailOuNumero(data.emailOuNumero);
                setDataNascimento(new Date(data.dataNascimento));
                setTipoCarteira(data.tipoCarteira);
                setPlacaVeiculo(data.placaVeiculo || '');
                setSenha(data.senha);
            } catch (error) {
                console.error('Erro ao buscar motorista:', error);
                Alert.alert('Erro', 'Não foi possível conectar ao servidor. Verifique a conexão e tente novamente.');
            }
        };

        buscarMotorista();
    }, [userId]);

    // Função para atualizar os dados do motorista
    const atualizarMotorista = async () => {
        const motoristaAtualizado = {
            user_id,
            nome,
            emailOuNumero,
            dataNascimento,
            tipoCarteira,
            placaVeiculo: tipoId === 'user' ? placaVeiculo : null,
            senha,
        };

        try {
            const response = await fetch(`http://192.168.100.8:5000/atualizar-usuario/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(motoristaAtualizado),
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar o motorista');
            }

            const data = await response.json();
            console.log('Motorista atualizado com sucesso:', data);
            navigation.goBack();
        } catch (error) {
            console.error('Erro:', error);
            Alert.alert('Erro', 'Não foi possível atualizar o motorista. Verifique a conexão e tente novamente.');
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

            <TouchableOpacity onPress={() => setShowDataNascimento(!showDataNascimento)} style={styles.inputB}>
                <Text style={styles.inputC1}>
                    {dataNascimento ? `Data de Nascimento: ${dataNascimento.toLocaleDateString()}` : 'Selecione a Data de Nascimento'}
                </Text>
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

            {/* Campo Tipo de Carteira */}
            <TouchableOpacity onPress={() => setShowTipoCarteira(!showTipoCarteira)} style={styles.inputD1}>
                <Text style={styles.inputC2}>
                    {tipoCarteira ? `Tipo de Carteira: ${tipoCarteira}` : 'Selecione o Tipo de Carteira'}
                </Text>
            </TouchableOpacity>
            {showTipoCarteira && (
                <View style={styles.pickerContainer2}>
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

            <TextInput
                style={styles.inputE}
                placeholder="Placa do Veículo"
                placeholderTextColor="#fff"
                value={placaVeiculo}
                onChangeText={setPlacaVeiculo}
            />

            <Image source={require('../assets/quadro2.png')} style={styles.quadroImage3} />

            <TextInput
                style={styles.inputF1}
                placeholder="Senha"
                placeholderTextColor="#fff"
                secureTextEntry={true}
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

            <TouchableOpacity style={styles.button} onPress={atualizarMotorista}>
                <Text style={styles.buttonText}>Atualizar</Text>
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
        top: 200,
        color: '#fff',
    },
    inputA1: {
        position: 'absolute',
        padding: 10,
        width: '80%',
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        marginBottom: 20,
        top: 256,
        color: '#fff',
    },
    inputB: {
        position: 'absolute',
        width: '80%',
        marginBottom: 20,
        top: 315,
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
    inputD1: {
        width: '80%',
        marginBottom: 20,
        top: 20,
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
        width: '70%',
        marginBottom: -35,
        left: 85,
        top: -90,
    },
    pickerContainer2: {
        position: 'absolute',
        width: '30%',
        marginBottom: 1,
        left: 270,
        top: 320,
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

export default EditarMotorista;