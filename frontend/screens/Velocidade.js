import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

// Função para calcular a classificação final (velocidade + fadiga)
function calcularClassificacaoFinal(ocorrencias75, ocorrencias85, ocorrencias90, ocorrencias100, total_sono, total_dist) {
    let classificacaoVelocidade;
    let classificacaoFadiga;

    // Classificação baseada na velocidade
    if (ocorrencias100 >= 1 || ocorrencias90 >= 5) {
        classificacaoVelocidade = "Condução muito perigosa";
    } else if (ocorrencias85 >= 5 || ocorrencias90 >= 4) {
        classificacaoVelocidade = "Condução agressiva";
    } else if (ocorrencias75 >= 5 || ocorrencias85 >= 4) {
        classificacaoVelocidade = "Condução moderada";
    } else {
        classificacaoVelocidade = "Condução segura";
    }

    // Classificação baseada na fadiga (sonolência e distração)
    if (total_sono > 10 || total_dist > 10) {
        classificacaoFadiga = "Condução muito perigosa";
    } else if (total_sono > 5 || total_dist > 5) {
        classificacaoFadiga = "Condução agressiva";
    } else if (total_sono > 2 || total_dist > 2) {
        classificacaoFadiga = "Condução moderada";
    } else {
        classificacaoFadiga = "Condução segura";
    }

    // Combina as classificações (prioriza a pior classificação)
    if (classificacaoVelocidade === "Condução muito perigosa" || classificacaoFadiga === "Condução muito perigosa") {
        return "Condução muito perigosa";
    } else if (classificacaoVelocidade === "Condução agressiva" || classificacaoFadiga === "Condução agressiva") {
        return "Condução agressiva";
    } else if (classificacaoVelocidade === "Condução moderada" || classificacaoFadiga === "Condução moderada") {
        return "Condução moderada";
    } else {
        return "Condução segura";
    }
}

const Velocidade = () => {
    const route = useRoute();
    const [loading, setLoading] = useState(true);
    const [dados, setDados] = useState(null);
    const [error, setError] = useState(null);

    // Dados passados da tela da câmera
    const {
        userId,
        velocidade,
        maior_velocidade,
        cont_velocidade,
        horario_inicio,
        horario_termino,
        duracao,
        dadosGrafico,
        total_sono, // Recebe o total de alertas de sono
        total_dist, // Recebe o total de alertas de distração
    } = route.params;

    // Calcular ocorrências de velocidade
    const ocorrencias75 = dadosGrafico.filter((v) => v > 75).length;
    const ocorrencias85 = dadosGrafico.filter((v) => v > 85).length;
    const ocorrencias90 = dadosGrafico.filter((v) => v > 90).length;
    const ocorrencias100 = dadosGrafico.filter((v) => v > 100).length;

    // Calcular a classificação final (velocidade + fadiga)
    const classificacaoFinal = calcularClassificacaoFinal(
        ocorrencias75,
        ocorrencias85,
        ocorrencias90,
        ocorrencias100,
        total_sono,
        total_dist
    );

    // Salvar os dados no banco
    useEffect(() => {
        const salvarDados = async () => {
            try {
                const payload = {
                    user_id: userId,
                    velocidade: velocidade || 0,
                    duracao: duracao || 0,
                    maior_velocidade: maior_velocidade || 0,
                    cont_velocidade: cont_velocidade || 0,
                    total_sono: total_sono || 0, // Usa o valor de total_sono
                    total_dist: total_dist || 0, // Usa o valor de total_dist
                    media_orient: 0, // Exemplo, ajuste conforme necessário
                    classificacao: classificacaoFinal, // Usa a classificação final
                    horario_inicio: horario_inicio,
                    horario_termino: horario_termino,
                    data: new Date().toISOString().split('T')[0],
                };

                console.log('Payload enviado:', payload); // Log para depuração

                // Enviar dados para o backend
                const response = await axios.post('http://44.196.219.45:5000/salvar-velocidade', payload, {
                    timeout: 10000, // 10 segundos
                });
                console.log('Resposta do servidor:', response.data); // Log para depuração

                setDados(payload);
                setLoading(false);
            } catch (error) {
                console.error('Erro ao salvar os dados:', error);

                // Exibir detalhes do erro
                if (error.response) {
                    // Erro retornado pelo servidor
                    console.error('Resposta do servidor:', error.response.data);
                    console.error('Status do erro:', error.response.status);
                    setError(`Erro no servidor: ${error.response.data.message || error.response.status}`);
                } else if (error.request) {
                    // Erro de conexão
                    console.error('Erro de conexão:', error.request);
                    setError('Erro de conexão: Não foi possível se conectar ao servidor.');
                } else {
                    // Outros erros
                    console.error('Erro:', error.message);
                    setError(`Erro: ${error.message}`);
                }

                setLoading(false);
            }
        };

        salvarDados();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#61B8D8" />
                <Text style={styles.carregandoTexto}>Carregando...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.erro}>Erro: {error}</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.titulo}>Relatório de Viagem</Text>

                <View style={styles.card}>
                    <Text style={styles.cardTitulo}>Velocidade Média</Text>
                    <Text style={styles.cardTexto}>
                        {velocidade !== undefined && velocidade !== null ? velocidade.toFixed(2) : 'N/A'} km/h
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitulo}>Maior Velocidade</Text>
                    <Text style={styles.cardTexto}>
                        {maior_velocidade !== undefined && maior_velocidade !== null ? maior_velocidade.toFixed(2) : 'N/A'} km/h
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitulo}>Vezes acima de 90 km/h</Text>
                    <Text style={styles.cardTexto}>{cont_velocidade}</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitulo}>Duração da Corrida</Text>
                    <Text style={styles.cardTexto}>{duracao} segundos</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitulo}>Horário de Início</Text>
                    <Text style={styles.cardTexto}>{horario_inicio}</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitulo}>Horário de Término</Text>
                    <Text style={styles.cardTexto}>{horario_termino}</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitulo}>Total de Sono</Text>
                    <Text style={styles.cardTexto}>{total_sono}</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitulo}>Total de Distração</Text>
                    <Text style={styles.cardTexto}>{total_dist}</Text>
                </View>

                <View style={[styles.card, styles.cardClassificacao]}>
                    <Text style={styles.cardTitulo}>Classificação Final</Text>
                    <Text style={styles.cardTextoClassificacao}>{classificacaoFinal}</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: '#042B3D', // Fundo azul escuro
    },
    container: {
        flex: 1,
        backgroundColor: '#042B3D', // Fundo azul escuro
        padding: 20,
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF', // Texto branco para contraste
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#8BC9DD', // Card azul claro
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 0,
    },
    cardTitulo: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF', // Texto azul escuro
        marginBottom: 5,
    },
    cardTexto: {
        fontSize: 14,
        color: '#FFFFFF', // Texto azul escuro
    },
    cardClassificacao: {
        backgroundColor: '#61B8D8', // Card azul médio
    },
    cardTextoClassificacao: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#042B3D', // Texto azul escuro
    },
    carregandoTexto: {
        marginTop: 10,
        fontSize: 16,
        color: '#FFFFFF', // Texto branco para contraste
    },
    erro: {
        color: '#FF6B6B', // Texto vermelho para erros
        fontSize: 18,
        marginBottom: 20,
    },
});

export default Velocidade;