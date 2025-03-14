import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

const EditarMotorista = ({ navigation }) => {
    const route = useRoute();
    const { userId } = route.params; // Pega o userId passado

    // Estados para os campos do formulário
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [tipoCarteira, setTipoCarteira] = useState('');
    const [placaVeiculo, setPlacaVeiculo] = useState('');
    const [senha, setSenha] = useState('');

    // Busca os dados do motorista ao carregar a tela
    useEffect(() => {
        const buscarMotorista = async () => {
            try {
                const response = await fetch(`http://192.168.100.8:5000/usuario/${userId}`);
                const data = await response.json();
                console.log('Dados do motorista:', data);

                // Preenche os estados com os dados do motorista
                setNome(data.nome);
                setEmail(data.email);
                setDataNascimento(data.dataNascimento);
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
            email,
            dataNascimento,
            tipoCarteira,
            placaVeiculo,
            senha,
        };

        try {
            const response = await fetch(`http://192.168.100.8:5000/atualizar-usuario/${userId}`, {
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
            navigation.goBack(); // Volta para a tela anterior após salvar
        } catch (error) {
            console.error('Erro ao salvar alterações:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Editar Motorista</Text>
            <Text style={styles.subtitulo}>ID do motorista: {userId}</Text>

            {/* Campo Nome */}
            <TextInput
                style={styles.input}
                placeholder="Nome"
                placeholderTextColor="#999"
                value={nome}
                onChangeText={setNome}
            />

            {/* Campo Email */}
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
            />

            {/* Campo Data de Nascimento */}
            <TextInput
                style={styles.input}
                placeholder="Data de Nascimento"
                placeholderTextColor="#999"
                value={dataNascimento}
                onChangeText={setDataNascimento}
            />

            {/* Campo Tipo de Carteira */}
            <TextInput
                style={styles.input}
                placeholder="Tipo de Carteira"
                placeholderTextColor="#999"
                value={tipoCarteira}
                onChangeText={setTipoCarteira}
            />

            {/* Campo Placa do Veículo */}
            <TextInput
                style={styles.input}
                placeholder="Placa do Veículo"
                placeholderTextColor="#999"
                value={placaVeiculo}
                onChangeText={setPlacaVeiculo}
            />

            {/* Campo Senha */}
            <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#999"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry // Oculta a senha
            />

            {/* Botão para salvar as alterações */}
            <TouchableOpacity style={styles.botao} onPress={salvarAlteracoes}>
                <Text style={styles.textoBotao}>Salvar Alterações</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#000', // Cor do título
    },
    subtitulo: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
        color: '#000', // Cor do texto digitado
    },
    botao: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    textoBotao: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default EditarMotorista;