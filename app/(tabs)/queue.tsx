import { searchTrack } from '@/api/spotifySearch';
import BackButton from '@/components/Backbutton';
import {
  atualizarPedidoCliente,
  deletarPedidoCliente,
  listarPedidosCliente,
} from '@/services/api';
import type {
  ListarPedidosClienteResponse,
  PedidoFila,
} from '@/types/pedido';
import type { TrackInfo } from '@/types/trackInfo';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

const Queue = () => {
  const { clientId } = useLocalSearchParams();

  const [busca, setBusca] = useState('');
  const [pedidos, setPedidos] = useState<PedidoFila[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editMusica, setEditMusica] = useState('');
  const [editArtista, setEditArtista] = useState('');
  const [editGenero, setEditGenero] = useState('');
  const [editSugestoes, setEditSugestoes] = useState<TrackInfo[]>([]);

  const carregarPedidos = async () => {
    try {
      setLoading(true);

      if (!clientId) return;

      const response = await listarPedidosCliente(
        Number(clientId)
      ) as ListarPedidosClienteResponse;

      const pedidosFormatados: PedidoFila[] = response.pedidos || [];
      setPedidos(pedidosFormatados);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarPedidos();
    }, [clientId])
  );

  const buscarSugestoesEdicao = async (texto: string) => {
    setEditMusica(texto);

    if (texto.length < 3) {
      setEditSugestoes([]);
      return;
    }

    try {
      const resultados = await searchTrack(texto);
      setEditSugestoes(resultados.slice(0, 3));
    } catch (error) {
      console.error('Erro Spotify edição:', error);
      setEditSugestoes([]);
    }
  };

  const iniciarEdicao = (item: PedidoFila) => {
    setEditingId(item.id);
    setEditMusica(item.musica);
    setEditArtista(item.artista);
    setEditGenero(item.genero);
    setEditSugestoes([]);
  };

  const cancelarEdicao = () => {
    setEditingId(null);
    setEditMusica('');
    setEditArtista('');
    setEditGenero('');
    setEditSugestoes([]);
  };

  const salvarEdicao = async (id: number) => {
    try {
      setSalvando(true);

      await atualizarPedidoCliente(id, {
        titulo: editMusica,
        artista: editArtista,
        genero: editGenero,
      });

      Alert.alert('Sucesso', 'Pedido atualizado!');
      cancelarEdicao();
      carregarPedidos();
    } catch (error: any) {
      Alert.alert('Erro', error?.message || 'Erro ao atualizar');
    } finally {
      setSalvando(false);
    }
  };

  const deletarPedido = async (id: number) => {
    try {
      await deletarPedidoCliente(id);
      setPedidos((prev) => prev.filter((p) => p.id !== id));
    } catch (error: any) {
      Alert.alert('Erro', error?.message || 'Erro ao deletar');
    }
  };

  const renderRightActions = (id: number) => (
    <TouchableOpacity
      style={styles.deleteAction}
      onPress={() =>
        Alert.alert('Excluir', 'Deseja excluir este pedido?', [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Excluir', style: 'destructive', onPress: () => deletarPedido(id) },
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
    (p.genero?.toLowerCase() || '').includes(busca.toLowerCase())
  );

  const renderItem = ({ item }: { item: PedidoFila }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(item.id)}
    >
      <View style={styles.item}>
        {editingId === item.id ? (
          <>
            <TextInput
              style={styles.input}
              value={editMusica}
              onChangeText={buscarSugestoesEdicao}
              placeholder="Música"
              placeholderTextColor="#999"
            />

            {editSugestoes.length > 0 && (
              <View style={styles.sugestoesBox}>
                {editSugestoes.map((track, index) => (
                  <TouchableOpacity
                    key={`sugestao-${index}`}
                    style={styles.sugestaoItem}
                    onPress={() => {
                      setEditMusica(track.name);
                      setEditArtista(track.artist);
                      setEditSugestoes([]);
                    }}
                  >
                    <Text style={styles.sugestaoMusica}>{track.name}</Text>
                    <Text style={styles.sugestaoArtista}>{track.artist}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <TextInput
              style={styles.input}
              value={editArtista}
              onChangeText={setEditArtista}
              placeholder="Artista"
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              value={editGenero}
              onChangeText={setEditGenero}
              placeholder="Gênero"
              placeholderTextColor="#999"
            />

            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.saveBtn, salvando && { opacity: 0.6 }]}
                onPress={() => salvarEdicao(item.id)}
                disabled={salvando}
              >
                {salvando ? (
                  <ActivityIndicator size="small" color="#0d0d0d" />
                ) : (
                  <Text style={styles.darkText}>Salvar</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={cancelarEdicao}
                disabled={salvando}
              >
                <Text style={styles.lightText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.cardRow}>
            <View style={styles.textContent}>
              <Text style={styles.musica}>{item.musica}</Text>
              <Text style={styles.cantor}>
                {item.artista} • {item.genero}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => iniciarEdicao(item)}
            >
              <Feather name="edit" size={16} color="#0d0d0d" />
              <Text style={styles.darkText}>Editar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Swipeable>
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

      {loading ? (
        <ActivityIndicator size="large" color="#FFB052" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={pedidosFiltrados}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhum pedido encontrado</Text>
          }
        />
      )}
    </View>
  );
};

export default Queue;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  search: {
    backgroundColor: '#111',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFB052',
  },
  item: {
    backgroundColor: '#111',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
    paddingRight: 12,
  },
  musica: {
    color: '#FFB052',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cantor: {
    color: '#ccc',
    marginTop: 4,
    fontSize: 14,
  },
  editBtn: {
    flexDirection: 'row',
    backgroundColor: '#FFB052',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    gap: 6,
  },
  saveBtn: {
    backgroundColor: '#FFB052',
    padding: 10,
    borderRadius: 6,
    minWidth: 90,
    alignItems: 'center',
  },
  cancelBtn: {
    borderColor: '#555',
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    minWidth: 90,
    alignItems: 'center',
  },
  darkText: {
    color: '#0d0d0d',
    fontWeight: 'bold',
  },
  lightText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#444',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  deleteAction: {
    backgroundColor: '#c62828',
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    borderRadius: 10,
    marginBottom: 12,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 4,
  },
  sugestoesBox: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  sugestaoItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  sugestaoMusica: {
    color: '#FFB052',
    fontWeight: 'bold',
  },
  sugestaoArtista: {
    color: '#ccc',
    marginTop: 2,
  },
  empty: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});