import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeADM = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.menuButton} onPress={() => alert('Menu clicado!')}>
        <Text style={styles.menuText}>☰</Text>
      </TouchableOpacity>

      <Image source={require('../assets/logo.png')} style={styles.logoImage} />
      <View style={styles.bolaAzulClaro} />
      <View style={styles.bolaAzul} />

      <View style={styles.mainContent}>
        <Text style={styles.title}>Consultar Motorista</Text>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Digite o nome do motorista"
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity style={styles.searchButton} onPress={() => alert(`Buscando: ${search}`)}>
            <Text style={styles.searchButtonText}>Buscar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CadastroMotorista')}>
            <Image source={require('../assets/add.png')} style={styles.addIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bolaAzulFinal} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    position: 'absolute',
    top: 10,
    left: 345,
    padding: 15,
    borderRadius: 50,
  },
  menuText: {
    fontSize: 45,
    color: '#fff',
  },
  logoImage: {
    position: 'absolute',
    width: 130,
    height: 130,
    top: 50,
  },
  bolaAzulClaro: {
    position: 'absolute',
    width: 600,
    height: 700,
    borderRadius: 500,
    backgroundColor: '#8BC9DD',
    top: -450,
    left: -89.7,
    zIndex: -1,
  },
  bolaAzul: {
    position: 'absolute',
    width: 600,
    height: 700,
    borderRadius: 500,
    backgroundColor: '#61B8D8',
    top: -476,
    left: -89.7,
    zIndex: -1,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingTop: 100,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
  },
  searchInput: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderRadius: 20,
    marginRight: 8,
    paddingHorizontal: 8,
    backgroundColor: 'white',
  },
  searchButton: {
    height: 40,
    width: '20%',
    backgroundColor: '#61B8D8',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  addIcon: {
    width: 50,
    height: 50,
    position: 'absolute',
    bottom: -260,
    right: 50,
  },
  bolaAzulFinal: {
    position: 'absolute',
    width: 600,
    height: 700,
    borderRadius: 500,
    backgroundColor: '#61B8D8',
    bottom: -590,
    left: -89.7,
    zIndex: -1,
  },
});

export default HomeADM;
