import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, ActivityIndicator, View, Text } from 'react-native';
import LoginTela from './screens/LoginTela';
import HomeADM from './screens/HomeADM';
import HomeUSER from './screens/HomeUSER';
import CadastroMotorista from './screens/CadastroMotorista'; // Adicionado


const Stack = createStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const backendUrl = 'http://192.168.1.242:5000/login';
  const handleLogin = (credentials, navigation) => {
    setLoading(true);
    setError(null);

    fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(`Erro: ${response.status} - ${text}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        setLoading(false);
        if (data.isAdmin) {
          navigation.navigate('HomeADM');
        } else {
          navigation.navigate('HomeUSER');
        }
      })
      .catch((error) => {
        console.error('Erro ao conectar com o backend:', error);
        setError(error.message);
        setLoading(false);
      });
  };

  return (
    <NavigationContainer>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" options={{ title: 'Login' }}>
          {(props) => <LoginTela {...props} onLogin={(credentials) => handleLogin(credentials, props.navigation)} />}
        </Stack.Screen>
        <Stack.Screen name="HomeADM" component={HomeADM} options={{ title: 'Admin' }} />
        <Stack.Screen name="HomeUSER" component={HomeUSER} options={{ title: 'Usuário' }} />
        <Stack.Screen name="CadastroMotorista" component={CadastroMotorista} options={{ title: 'Cadastro Motorista' }} />
      </Stack.Navigator>
      {error && <Text style={styles.error}>{error}</Text>}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

