import React, { useEffect } from 'react';
import { View, Text, Button, Alert, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';

const ExcluirMotorista = () => {
  const route = useRoute();
  const { userId } = route.params;  // Pega o userId passado

  useEffect(() => {
    // Aqui você pode buscar os dados do motorista usando o userId
    console.log(`Excluindo motorista com ID: ${userId}`);
  }, [userId]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://192.168.1.4:5000/usuarios/${userId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.mensagem);
        // Aqui você pode atualizar a lista de usuários ou navegar para outra tela
      } else {
        alert(result.mensagem);
      }
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      alert('Erro ao excluir usuário');
    }
  };

  return (
    <View>
      <Text>Excluir Motorista</Text>
      <Text>ID do motorista: {userId}</Text>
      <TouchableOpacity onPress={handleDelete}>
        <Text>Excluir</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ExcluirMotorista;