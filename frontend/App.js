import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import LoginTela from './screens/LoginTela';
import HomeADM from './screens/HomeADM';
import HomeUSER from './screens/HomeUSER';

const Stack = createStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const backendUrl = 'http://192.168.100.7:5000/login';

  const handleLogin = (credentials, navigation) => {
    setLoading(true);
    setError(null);

    fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(`Erro na resposta do servidor: ${response.status} - ${text}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        setLoading(false);
        // Navegar para a tela correta com base no tipo de usuário
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
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          options={{ title: 'Login' }}
        >
          {props => <LoginTela {...props} onLogin={(credentials) => handleLogin(credentials, props.navigation)} />}
        </Stack.Screen>
        <Stack.Screen
          name="HomeADM"
          component={HomeADM}
          options={{ title: 'Início' }}
        />
        <Stack.Screen
          name="HomeUSER"
          component={HomeUSER}
          options={{ title: 'Início' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: 'red',
  },
});