import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeADM = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [usuarios, setUsuarios] = useState([]); // Estado para armazenar os usuários
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]); // Estado para armazenar os usuários filtrados

  // Função para buscar os usuários do banco de dados
  const buscarUsuarios = async () => {
    try {
      const response = await fetch('http://192.168.100.8:5000/usuarios');

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro na requisição: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      setUsuarios(data);
      setUsuariosFiltrados(data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  // Função para filtrar os usuários com base na pesquisa
  const filtrarUsuarios = (texto) => {
    setSearch(texto); // Atualiza o estado da pesquisa
    if (texto) {
      const filtrados = usuarios.filter(
        (usuario) =>
          (usuario.user_id && usuario.user_id.toLowerCase().includes(texto.toLowerCase())) ||
          (usuario.nome && usuario.nome.toLowerCase().includes(texto.toLowerCase()))
      );
      setUsuariosFiltrados(filtrados); // Atualiza a lista filtrada
    } else {
      setUsuariosFiltrados(usuarios); // Se o campo de pesquisa estiver vazio, exibe todos os usuários
    }
  };

  // Busca os usuários ao carregar a tela
  useEffect(() => {
    buscarUsuarios();
  }, []);

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
            placeholder="Digite o nome ou ID do motorista"
            value={search}
            onChangeText={filtrarUsuarios} // Filtra os usuários conforme o texto digitado
          />
          <TouchableOpacity style={styles.searchButton} onPress={() => alert(`Buscando: ${search}`)}>
            <Text style={styles.searchButtonText}>Buscar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CadastroMotorista')}>
            <Image source={require('../assets/add.png')} style={styles.addIcon} />
          </TouchableOpacity>
        </View>

        {/* Tabela de usuários */}
        <View style={styles.tabelaContainer}>
          <View style={styles.tabelaHeader}>
            <Text style={styles.headerText}>ID</Text>
            <Text style={styles.headerText}>Nome</Text>
            <Text style={styles.headerText}>Ações</Text>
          </View>
          <FlatList
            data={usuariosFiltrados}
            keyExtractor={(item) => item.user_id || Math.random().toString()} // Garante uma chave única
            renderItem={({ item }) => (
              <View style={styles.tabelaLinha}>
                <Text style={styles.linhaText}>{item.user_id || 'N/A'}</Text>
                <Text style={styles.linhaText}>{item.nome || 'N/A'}</Text>
                <View style={styles.acoesContainer}>
                  <TouchableOpacity
                    style={styles.acaoButton}
                    onPress={() => navigation.navigate('EditarMotorista', { userId: item.user_id })}
                  >
                    <Image source={require('../assets/edit.png')} style={styles.acaoEdit} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.acaoButton}
                    onPress={() => navigation.navigate('ExcluirMotorista', { userId: item.user_id })}
                  >
                    <Image source={require('../assets/lixo.png')} style={styles.acaoLixo} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.acaoButton}
                    onPress={() => navigation.navigate('VisualizarMotorista', { userId: item.user_id })}
                  >
                    <Image source={require('../assets/visu.png')} style={styles.acaoVisu} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
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
    top: -100,
    left: -90,
    color: '#042B3D',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
  },
  searchInput: {
    height: 40,
    top: -125,
    width: '80%',
    borderColor: 'gray',
    borderRadius: 20,
    marginRight: 8,
    paddingHorizontal: 8,
    backgroundColor: 'white',
  },
  searchButton: {
    top: -125,
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
    bottom: -320,
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
  tabelaContainer: {
    top: -125,
    width: '100%',
    marginTop: 20,
  },
  tabelaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#61B8D8',
    borderRadius: 5,
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tabelaLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  linhaText: {
    fontSize: 14,
  },
  acoesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  acaoButton: {
    marginLeft: 10,
  },
  acaoEdit: {
    width: 18,
    height: 18,
  },
  acaoLixo: {
    width: 18,
    height: 18,
  },
  acaoVisu: {
    width: 18,
    height: 18,
  },
});

export default HomeADM;