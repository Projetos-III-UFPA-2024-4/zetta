import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';  // Mudando para BarChart
import { Dimensions } from 'react-native';

const IA_USER = ({ navigation }) => {
  const [sonolenciaData] = useState([60, 30, 70, 80, 40, 60, 90, 100, 50, 70, 30, 40]); // Dados fictícios
  const [alertas, setAlertas] = useState([
    { descricao: 'Aumentar o uso do cinto de segurança', tipo: 'alerta' },
    { descricao: 'Evitar dirigir entre os horários 2h-4h', tipo: 'alerta' },
    { descricao: 'Condução prudente', tipo: 'geral' },
  ]);

  const showAlert = () => {
    Alert.alert('Recomendações', 'Aumentar a atenção enquanto dirige em horários críticos.');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header com botão de voltar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Análise da IA</Text>
      </View>

      {/* Gráfico de Sonolência */}
      <View style={styles.graphContainer}>
        <Text style={styles.graphTitle}>Níveis de Sonolência</Text>
        <BarChart
          data={{
            labels: ['00h', '04h', '08h', '12h', '16h', '20h','24h',''],
            datasets: [
              {
                data: sonolenciaData,
                color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // Cor das barras
                barPercentage: 0.5,  // Tamanho das barras
              },
            ],
          }}
          width={Dimensions.get('window').width - 40} // Largura do gráfico ajustada
          height={220} // Altura do gráfico
          yAxisLabel="%"
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // Cor do gráfico
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Cor dos rótulos
          }}
          verticalLabelRotation={30} // Gira os rótulos no eixo X
          style={{
            marginLeft: 10,
            marginRight: 10,
            alignSelf: 'center', // Centraliza o gráfico
          }} 
        />
      </View>

      {/* Lista de alertas */}
      <View style={styles.alertContainer}>
        <Text style={styles.sectionTitle}>Alertas e Recomendações</Text>
        {alertas.map((alerta, index) => (
          <View key={index} style={styles.alertBox}>
            <Ionicons
              name={alerta.tipo === 'alerta' ? 'alert-circle' : 'information-circle'}
              size={20}
              color={alerta.tipo === 'alerta' ? '#FF3B30' : '#4CD964'}
            />
            <Text style={styles.alertText}>{alerta.descricao}</Text>
          </View>
        ))}
      </View>

      {/* Botões personalizados */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={showAlert}>
          <Text style={styles.buttonText}>Ver Alertas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={showAlert}>
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Recomendação</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f6f9', // Cor de fundo suave
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  backButton: {
    padding: 8,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  graphContainer: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginVertical: 20,
    elevation: 3, // Sombra suave
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#007AFF', // Cor do título do gráfico
  },
  alertContainer: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    elevation: 3, // Sombra suave
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  alertText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#FF3B30', // Cor vibrante para o botão de alerta
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    top: -15
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#FF3B30',
    top: -15
  },
  secondaryButtonText: {
    color: '#FF3B30', // Cor do texto do botão secundário
  },
});

export default IA_USER;
