import BackButton from '@/components/Backbutton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

type Pedido = {
  id: string;
  musica: string;
  cantor: string;
  genero: string;
  capa?: string;
  ano?: string;
};

const Queue = () => {
  const [busca, setBusca] = useState('');
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    const carregarPedidos = async () => {
      try {
        const pedidosSalvos = await AsyncStorage.getItem('pedidos');
        const lista = pedidosSalvos ? JSON.parse(pedidosSalvos) : [];
        setPedidos(lista);
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
      }
    };
    carregarPedidos();
  }, []);

  const pedidosFiltrados = pedidos.filter(p =>
    (p.musica?.toLowerCase() || '').includes(busca.toLowerCase()) ||
    (p.cantor?.toLowerCase() || '').includes(busca.toLowerCase()) ||
    (p.genero?.toLowerCase() || '').includes(busca.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Fila de pedidos</Text>

      <TextInput
        style={styles.search}
        placeholder="Pesquisar"
        placeholderTextColor="#999"
        value={busca}
        onChangeText={setBusca}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {pedidosFiltrados.length > 0 ? (
          pedidosFiltrados.map(item => (
            <View key={item.id} style={styles.item}>
              {item.capa ? (
                <Image source={{ uri: item.capa }} style={styles.icon} />
              ) : (
                <View style={[styles.icon, { backgroundColor: '#333' }]} />
              )}
              <View style={styles.info}>
                <Text style={styles.musica}>{item.musica}</Text>
                <Text style={styles.cantor}>{item.cantor} • {item.genero}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.empty}>Nenhum pedido encontrado</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default Queue;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    marginTop: 20,
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  search: {
    backgroundColor: '#111',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#FFB052',
    marginBottom: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  musica: {
    color: '#FFB052',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cantor: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 4,
  },
  empty: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});
