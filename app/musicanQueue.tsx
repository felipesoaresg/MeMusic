import BackButton from '@/components/Backbutton';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Pedido = {
  id: string;
  musica: string;
  cantor: string;
  genero: string;
  tocada?: boolean;
};

const MusicianQueue = () => {
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

  const marcarComoTocada = async (id: string) => {
    const atualizados = pedidos.map(p =>
      p.id === id ? { ...p, tocada: true } : p
    );
    setPedidos(atualizados);
    await AsyncStorage.setItem('pedidos', JSON.stringify(atualizados));
  };

  const pedidosFiltrados = pedidos.filter(p =>
    p.musica.toLowerCase().includes(busca.toLowerCase()) ||
    p.cantor.toLowerCase().includes(busca.toLowerCase()) ||
    p.genero.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Pedidos recebidos</Text>

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
            <View key={item.id} style={[styles.item, item.tocada && styles.itemTocada]}>
              <FontAwesome name="music" size={24} color="#00FFFF" style={styles.icon} />
              <View style={styles.info}>
                <Text style={styles.musica}>{item.musica}</Text>
                <Text style={styles.cantor}>{item.cantor} • {item.genero}</Text>
                {!item.tocada ? (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => marcarComoTocada(item.id)}
                  >
                    <Text style={styles.buttonText}>Marcar como tocada</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.tocada}>Já tocada</Text>
                )}
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

export default MusicianQueue;

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
    borderColor: '#00FFFF',
    marginBottom: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#111',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  itemTocada: {
    opacity: 0.5,
  },
  icon: {
    marginRight: 16,
    marginTop: 6,
  },
  info: {
    flex: 1,
  },
  musica: {
    color: '#00FFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cantor: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#00FFFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#0d0d0d',
    fontWeight: 'bold',
  },
  tocada: {
    color: '#00FFFF',
    fontWeight: 'bold',
  },
  empty: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});
