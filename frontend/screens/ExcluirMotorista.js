import React, { useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';

const handleDelete = async (userId) => {
    try {
      const response = await fetch(`http://192.168.100.8:5000/usuarios/${userId}`, {
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
  
  // Exemplo de uso no componente onde você lista os usuários
  <TouchableOpacity onPress={() => handleDelete(item.user_id)}>
    <Text>Excluir</Text>
  </TouchableOpacity>
  

export default ExcluirMotorista;
