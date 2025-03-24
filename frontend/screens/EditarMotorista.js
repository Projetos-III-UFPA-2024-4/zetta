import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Modal, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoute } from '@react-navigation/native';

const EditarMotorista = ({ navigation }) => {
    const route = useRoute();
    const { userId } = route.params;

    // Estados para os campos do formulário
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [dataNascimento, setDataNascimento] = useState(new Date());
    const [showDataNascimento, setShowDataNascimento] = useState(false);
    const [tipoCarteira, setTipoCarteira] = useState('');
    const [showTipoCarteira, setShowTipoCarteira] = useState(false);
    const [placaVeiculo, setPlacaVeiculo] = useState('');
    const [senha, setSenha] = useState('');

    // Função para formatar a data para YYYY-MM-DD
    const formatarData = (data) => {
        const dataObj = new Date(data);
        return dataObj.toISOString().split('T')[0];
    };

    // Busca os dados do motorista ao carregar a tela
    useEffect(() => {
        const buscarMotorista = async () => {
            try {
                const response = await fetch(`http://44.196.219.45:5000/usuario/${userId}`);
                const data = await response.json();
                console.log('Dados do motorista:', data);

                // Preenche os estados com os dados do motorista
                setNome(data.nome);
                setEmail(data.emailOuNumero || '');
                setDataNascimento(new Date(data.dataNascimento));
                setTipoCarteira(data.tipoCarteira);
                setPlacaVeiculo(data.placaVeiculo);
                setSenha(data.senha);
            } catch (error) {
                console.error('Erro ao buscar motorista:', error);
            }
        };

        buscarMotorista();
    }, [userId]);

    // Função para salvar as alterações
    const salvarAlteracoes = async () => {
        const dadosAtualizados = {
            nome,
            emailOuNumero: email,
            dataNascimento: formatarData(dataNascimento),
            tipoCarteira,
            placaVeiculo,
            senha,
        };

        try {
            const response = await fetch(`http://44.196.219.45:5000/atualizar-usuario/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosAtualizados),
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar motorista');
            }

            const result = await response.json();
            console.log('Motorista atualizado com sucesso:', result);
            navigation.goBack();
        } catch (error) {
            console.error('Erro ao salvar alterações:', error);
        }
    };

    // Função para lidar com a mudança de data
    const handleDateChange = (event, selectedDate) => {
        setShowDataNascimento(false);
        if (selectedDate) {
            setDataNascimento(selectedDate);
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
                value={email}
                onChangeText={setEmail}
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
                                value={dataNascimento || new Date()}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={handleDateChange}
                            />
                        </View>
                    </View>
                </Modal>
            )}

            <Image source={require('../assets/quadro1.png')} style={styles.quadroImage2} />

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

            <TextInput
                style={styles.inputF1}
                placeholder="Senha"
                placeholderTextColor="#fff"
                secureTextEntry={true}
                value={senha}
                onChangeText={setSenha}
            />

            <TouchableOpacity style={styles.button} onPress={salvarAlteracoes}>
                <Text style={styles.buttonText}>Salvar Alterações</Text>
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
        top: 240,
        color: '#fff',
    },
    inputB: {
        position: 'absolute',
        width: '80%',
        marginBottom: 20,
        top: 300,
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
    inputE: {
        position: 'absolute',
        padding: 10,
        width: '80%',
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        marginBottom: 20,
        top: 480,
        color: '#fff',
    },
    inputE1: {
        position: 'absolute',
        padding: 10,
        width: '80%',
        marginBottom: 20,
        top: 420,
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
        top: 535,
        color: '#fff',
    },
    pickerContainer: {
        position: 'absolute',
        top: 100,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        zIndex: 1000,
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
        top: 410,
        width: 360,
        height: 190,
        marginBottom: 20,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 0,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
});

export default EditarMotorista;
