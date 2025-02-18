import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import 'moment/locale/pt-br';
import 'moment-timezone';

const timeZone = 'America/Sao_Paulo';

const HomeUSER = () => {
  const navigation = useNavigation();
  const [currentDate, setCurrentDate] = useState(moment().tz(timeZone));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(moment().tz(timeZone));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="menu" size={30} color="#fff" />
        <Text style={styles.headerText}>Iniciar Viagem</Text>
      </View>

      <View style={styles.tripsContainer}>
        <Text style={styles.tripsTitle}>Minhas Viagens</Text>
        <View style={styles.monthsContainer}>
          {[...Array(3)].map((_, index) => {
            const month = moment().add(index, 'months').locale('pt-br').format('MMMM');
            return <Text key={index} style={styles.month}>{month}</Text>;
          })}
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.date}>{currentDate.format('DD')}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <StatBox label="Tempo:" value={currentDate.format('HH:mm:ss')} />
        <StatBox label="Distância:" value="5.14 km" />
      </View>

      <View style={styles.statsContainer}>
        <StatBox label="Sonolência:" value="23,3%" />
        <StatBox label="Velocidade:" value="54,27%" />
      </View>

      <TouchableOpacity style={styles.generalContainer} onPress={() => navigation.navigate('ConducaoUSER')}>
        <Text style={styles.generalText}>Comportamento Perigoso</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.startButton}>
        <Ionicons name="play" size={50} color="#fff" />
        <Text style={styles.startButtonText}>Iniciar Viagem</Text>
      </TouchableOpacity>
    </View>
  );
};

const StatBox = ({ label, value }) => (
  <View style={styles.statBox}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
  },
  tripsContainer: {
    marginTop: 30,
  },
  tripsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  monthsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  month: {
    marginRight: 10,
    fontSize: 16,
    color: '#1E90FF',
    textTransform: 'capitalize',
  },
  dateContainer: {
    marginTop: 20,
  },
  date: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1E90FF',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  statBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 16,
    color: '#000',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E90FF',
  },
  generalContainer: {
    marginTop: 30,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  generalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF4500',
  },
  startButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  }
});

export default HomeUSER;
