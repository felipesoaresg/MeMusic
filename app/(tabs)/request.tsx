import { searchTrack } from '@/api/spotifySearch';
import BackButton from '@/components/Backbutton';
import { TrackInfo } from '@/types/trackInfo';
import { zodResolver } from '@hookform/resolvers/zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { z } from 'zod';

const schema = z.object({
  musica: z.string().min(1, 'Nome da música obrigatório'),
  cantor: z.string().min(1, 'Cantor obrigatório'),
  genero: z.string().min(1, 'Gênero obrigatório'),
});

type FormData = z.infer<typeof schema>;

const Request = () => {
  const [sugestoes, setSugestoes] = useState<TrackInfo[]>([]);

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const musica = watch('musica');
  const cantor = watch('cantor');
  const genero = watch('genero');

  const buscarSugestoes = async (texto: string) => {
    setValue('musica', texto);
    if (texto.length < 3) {
      setSugestoes([]);
      return;
    }

    try {
      const resultados = await searchTrack(texto);
      setSugestoes(resultados.slice(0, 3));
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
      setSugestoes([]);
    }
  };

  const enviarPedido = async (data: FormData) => {
    try {
      const resultados = await searchTrack(data.musica);

      if (resultados.length === 0) {
        Alert.alert('Nenhum resultado encontrado', 'Verifique o nome da música e tente novamente.');
        return;
      }

      const musicaEncontrada = resultados[0];

      const novoPedido = {
        id: Date.now().toString(),
        musica: musicaEncontrada.name,
        cantor: musicaEncontrada.artist,
        genero: data.genero,
        capa: musicaEncontrada.albumImage,
        ano: musicaEncontrada.releaseYear,
      };

      const pedidosExistentes = await AsyncStorage.getItem('pedidos');
      const pedidos = pedidosExistentes ? JSON.parse(pedidosExistentes) : [];
      pedidos.push(novoPedido);
      await AsyncStorage.setItem('pedidos', JSON.stringify(pedidos));

      Alert.alert(
        'Pedido enviado',
        `Música: ${novoPedido.musica}\nCantor: ${novoPedido.cantor}\nAno: ${novoPedido.ano}`
      );

      reset();
      setSugestoes([]);
    } catch (error) {
      console.error('Erro ao buscar música ou salvar pedido:', error);
      Alert.alert('Erro', 'Não foi possível buscar a música ou salvar o pedido.');
    }
  };

  return (
    <View style={styles.container}>
      <BackButton />

      {sugestoes.length > 0 && (
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.label}>Sugestões:</Text>
          <FlatList
            data={sugestoes}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback
                onPress={() => {
                  setValue('musica', item.name);
                  setValue('cantor', item.artist);
                  setSugestoes([]);
                }}
              >
                <View style={styles.item}>
                  <Image source={{ uri: item.albumImage }} style={styles.icon} />
                  <View style={styles.info}>
                    <Text style={styles.musica}>{item.name}</Text>
                    <Text style={styles.cantor}>{item.artist}</Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            )}
          />
        </View>
      )}

      <View style={styles.form}>
        <Text style={styles.label}>Nome da música</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Evidências"
          placeholderTextColor="#999"
          value={musica}
          onChangeText={buscarSugestoes}
          {...register('musica')}
        />
        {errors.musica && <Text style={styles.error}>{errors.musica.message}</Text>}

        <Text style={styles.label}>Cantor</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Chitãozinho & Xororó"
          placeholderTextColor="#999"
          value={cantor}
          onChangeText={text => setValue('cantor', text)}
          {...register('cantor')}
        />
        {errors.cantor && <Text style={styles.error}>{errors.cantor.message}</Text>}

        <Text style={styles.label}>Gênero musical</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Sertanejo"
          placeholderTextColor="#999"
          value={genero}
          onChangeText={text => setValue('genero', text)}
          {...register('genero')}
        />
        {errors.genero && <Text style={styles.error}>{errors.genero.message}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleSubmit(enviarPedido)}>
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
    paddingTop: 10,
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
  error: {
    color: '#FF6B6B',
    marginTop: 4,
    marginBottom: 8,
  },
});
