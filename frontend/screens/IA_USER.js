import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const IA_USER = ({ navigation }) => {
  const [sonolenciaData] = useState([60, 30, 70, 80, 40, 60, 90, 100, 50, 70, 30, 40]); // Dados fictícios
  const [alertas, setAlertas] = useState([
    { descricao: 'Aumentar o uso do cinto de segurança', tipo: 'alerta' },
    { descricao: 'Evitar dirigir entre os horários 2h-4h', tipo: 'alerta' },
    { descricao: 'Condução imprudente', tipo: 'geral' },
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
        <LineChart
          data={{
            labels: ['00h', '04h', '08h', '12h', '16h', '20h', '24h'],
            datasets: [{ data: sonolenciaData }],
          }}
          width={Dimensions.get('window').width - 40} // Largura do gráfico
          height={200}
          yAxisLabel="%"
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            propsForDots: { r: '5', strokeWidth: '2', stroke: '#007AFF' },
          }}
          withVerticalLabels={false}
          withInnerLines={false}
          bezier
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
              color={alerta.tipo === 'alerta' ? '#8BC9DD' : '8BC9DD'}
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
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Recomendações</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8BC9DD',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  graphContainer: {
    left: -5,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginVertical: 20,
    elevation: 2,
  },
  graphTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  alertContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  alertText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  secondaryButtonText: {
    color: '#007AFF',
  },
});

export default IA_USER;
