import React from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';

// Função para lidar com a visualização do motorista
const handleView = async (userId) => {
    try {
        const response = await fetch(`http://192.168.1.4:5000/visualizar-motorista/${userId}`);
        
        // Verifica se o tipo de conteúdo é JSON
        const contentType = response.headers.get("content-type");
        
        if (contentType && contentType.includes("application/json")) {
            const motorista = await response.json();

            if (response.ok) {
                console.log('Motorista:', motorista);
                // Exibe ou faz algo com os dados do motorista
            } else {
                // Caso haja um erro no backend (como 404 ou 500)
                console.error('Erro:', motorista);
                alert(motorista.mensagem || "Erro ao visualizar motorista");
            }
        } else {
            // Se não for JSON, provavelmente é HTML (erro de página)
            const errorText = await response.text();
            console.error('Erro inesperado:', errorText);
            alert('Erro inesperado no servidor');
        }
    } catch (error) {
        console.error('Erro ao visualizar motorista:', error);
        alert('Erro ao visualizar motorista');
    }
};

const VisualizarMotorista = ({ item }) => {
    return (
        <View style={styles.container}>
            {/* Exemplo de botão para visualizar motorista */}
            <TouchableOpacity style={styles.button} onPress={() => handleView(item.user_id)}>
                <Image source={require('../assets/visu.png')} style={styles.acaoVisu} />
                <Text style={styles.buttonText}>Visualizar Motorista</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    acaoVisu: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default VisualizarMotorista;
