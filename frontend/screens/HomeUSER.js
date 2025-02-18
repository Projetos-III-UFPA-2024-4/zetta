import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const HomeUSER = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Página HomeUSER</Text>
      {Array.from({ length: 50 }).map((_, index) => (
        <Text key={index} style={styles.item}>
          Item {index + 1}
        </Text>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
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