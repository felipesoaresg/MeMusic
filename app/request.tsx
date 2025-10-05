import BackButton from '@/components/Backbutton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const Request = () => {
  const [musica, setMusica] = useState('');
  const [cantor, setCantor] = useState('');
  const [genero, setGenero] = useState('');

  const enviarPedido = async () => {
    if (!musica.trim() || !cantor.trim() || !genero.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha nome da música, cantor e gênero');
      return;
    }

    const novoPedido = {
      id: Date.now().toString(),
      musica,
      cantor,
      genero,
    };

    try {
      const pedidosExistentes = await AsyncStorage.getItem('pedidos');
      const pedidos = pedidosExistentes ? JSON.parse(pedidosExistentes) : [];
      pedidos.push(novoPedido);
      await AsyncStorage.setItem('pedidos', JSON.stringify(pedidos));

      Alert.alert('Pedido enviado', ` Música: ${musica}\n Cantor: ${cantor}\n Gênero: ${genero}`);
      setMusica('');
      setCantor('');
      setGenero('');
    } catch (error) {
      console.error('Erro ao salvar pedido:', error);
    }
  };

  return (
    <View style={styles.container}>
      <BackButton />
      <View style={styles.form}>
        <Text style={styles.label}>Nome da música</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Evidências"
          placeholderTextColor="#999"
          value={musica}
          onChangeText={setMusica}
        />
        <Text style={styles.label}>Cantor</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Chitãozinho & Xororó"
          placeholderTextColor="#999"
          value={cantor}
          onChangeText={setCantor}
        />
        <Text style={styles.label}>Gênero musical</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Sertanejo"
          placeholderTextColor="#999"
          value={genero}
          onChangeText={setGenero}
        />
        <TouchableOpacity style={styles.button} onPress={enviarPedido}>
          <Text style={styles.buttonText}>Enviar pedido</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Request;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
    marginTop: 20,
  },
  input: {
    backgroundColor: '#111',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#FFB052',
  },
  button: {
    backgroundColor: '#FFB052',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#0d0d0d',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
