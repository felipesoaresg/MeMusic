import BackButton from '@/components/Backbutton';
import { auth } from '@/firebaseConfig';
import { deletarPedidoMusico, listarPedidos } from '@/services/api';
import type { ListarPedidosResponse, PedidoFila } from '@/types/pedido';
import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

type PedidoComStatus = PedidoFila & {
  tocada?: boolean;
};

const MusicianQueue = () => {
  const [busca, setBusca] = useState('');
  const [pedidos, setPedidos] = useState<PedidoComStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarPedidos = async () => {
      try {
        setLoading(true);

        const user = auth.currentUser;

        if (!user) {
          console.log('Usuário não autenticado');
          return;
        }

        const response = (await listarPedidos(user)) as ListarPedidosResponse;

        const pedidosFormatados = (response.pedidos || []).map((item: PedidoFila) => ({
          ...item,
          tocada: false,
        }));

        setPedidos(pedidosFormatados);
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarPedidos();
  }, []);

  const marcarComoTocada = (id: number) => {
    setPedidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, tocada: true } : p))
    );

    setTimeout(() => {
      setPedidos((prev) => prev.filter((p) => p.id !== id));
    }, 1500);
  };

  const deletarPedido = async (id: number) => {
    try {
      await deletarPedidoMusico(id);
      setPedidos((prev) => prev.filter((p) => p.id !== id));
    } catch (error: any) {
      Alert.alert('Erro', error?.message || 'Erro ao deletar');
    }
  };

  const renderRightActions = (id: number) => (
    <TouchableOpacity
      style={styles.deleteAction}
      onPress={() =>
        Alert.alert('Excluir', 'Deseja excluir esse pedido?', [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Excluir',
            style: 'destructive',
            onPress: () => deletarPedido(id),
          },
        ])
      }
    >
      <Feather name="trash" size={20} color="#fff" />
      <Text style={styles.deleteText}>Excluir</Text>
    </TouchableOpacity>
  );

  const pedidosFiltrados = pedidos.filter((p) =>
    (p.musica?.toLowerCase() || '').includes(busca.toLowerCase()) ||
    (p.artista?.toLowerCase() || '').includes(busca.toLowerCase()) ||
    (p.genero?.toLowerCase() || '').includes(busca.toLowerCase()) ||
    (p.cliente?.toLowerCase() || '').includes(busca.toLowerCase())
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

      {loading ? (
        <ActivityIndicator size="large" color="#00FFFF" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {pedidosFiltrados.length > 0 ? (
            pedidosFiltrados.map((item) => (
              <Swipeable
                key={item.id}
                renderRightActions={() => renderRightActions(item.id)}
              >
                <View style={[styles.item, item.tocada && styles.itemTocada]}>
                  <View style={styles.info}>
                    <Text style={styles.musica}>{item.musica}</Text>
                    <Text style={styles.cantor}>
                      {item.artista} • {item.genero}
                    </Text>
                    <Text style={styles.cliente}>Pedido por: {item.cliente}</Text>

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
              </Swipeable>
            ))
          ) : (
            <Text style={styles.empty}>Nenhum pedido encontrado</Text>
          )}
        </ScrollView>
      )}
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
    marginBottom: 4,
  },
  cliente: {
    color: '#999',
    fontSize: 13,
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
  deleteAction: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    borderRadius: 10,
    marginBottom: 12,
  },
  deleteText: {
    color: '#fff',
    marginTop: 4,
    fontWeight: 'bold',
  },
});