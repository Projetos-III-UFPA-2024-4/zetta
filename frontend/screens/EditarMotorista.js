import React, { useEffect, useState } from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';

const EditarMotorista = () => {
  const route = useRoute();
  const { userId } = route.params;  // Pega o userId passado

  useEffect(() => {
    // Aqui você pode buscar os dados do motorista usando o userId
    console.log(`Editando motorista com ID: ${userId}`);
  }, [userId]);

  return (
    <View>
      <Text>Editar Motorista</Text>
      <Text>ID do motorista: {userId}</Text>
      {/* Aqui você pode implementar o formulário para editar os dados */}
    </View>
  );
};

export default EditarMotorista;
