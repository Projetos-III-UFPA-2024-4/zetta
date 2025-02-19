import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const HomeUSER = () => {
  return (
    <View style={styles.container}>
      {/* Image Logo */}
      <Image source={require('../assets/logo.png')} style={styles.logo} />

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

        {/* Select Date */}
        <TouchableOpacity onPress={showDatePicker} style={styles.selectDateButton}>
          <Text style={styles.date}>{selectedDate ? selectedDate : currentDate.format('DD/MM/YYYY')}</Text>
        </TouchableOpacity>

        {/* Date Picker Modal */}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
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

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  logo: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 50,
    height: 50,
    resizeMode: 'contain',
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
  selectDateButton: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  date: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    fontSize: 18,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default HomeUSER;