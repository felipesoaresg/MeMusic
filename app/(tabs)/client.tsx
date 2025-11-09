import { searchTrack } from '@/api/spotifySearch';
import HeaderBar from '@/components/HeaderBar';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Client = () => {
  const [userName, setUserName] = useState('');
  const [musicaAtual, setMusicaAtual] = useState<{
    name: string;
    artist: string;
    albumImage: string;
  }>({
    name: '',
    artist: '',
    albumImage: '',
  });

  useEffect(() => {
    const loadUserName = async () => {
      try {
        const storedName = await AsyncStorage.getItem('userName');
        if (storedName) setUserName(storedName);
      } catch (error) {
        console.error('Erro ao carregar nome:', error);
      }
    };

    const carregarMusicaAtual = async () => {
      try {
        const resultados = await searchTrack('Pink + White Frank Ocean');
        if (resultados.length > 0) {
          const musica = resultados[0];
          setMusicaAtual({
            name: musica.name,
            artist: musica.artist,
            albumImage: musica.albumImage,
          });
        }
      } catch (error) {
        console.error('Erro ao buscar música atual:', error);
      }
    };

    loadUserName();
    carregarMusicaAtual();
  }, []);

  return (
    <View style={styles.container}>
      <HeaderBar name={userName} place="GastroBar" />

      <View style={styles.content}>
        <View style={styles.eventBox}>
          <Text style={styles.eventTitle}>Evento: Aniversário Yuri</Text>
          <Text style={styles.eventDetails}>Início: 21h00 | Fim: 00h00</Text>
          <Text style={styles.eventDetails}>Data: 04/10/2025</Text>
        </View>

        <View style={styles.nowPlaying}>
          {musicaAtual.albumImage ? (
            <Image source={{ uri: musicaAtual.albumImage }} style={styles.albumImage} />
          ) : null}
          <Text style={styles.nowPlayingLabel}>Tocando agora</Text>
          <Text style={styles.songTitle}>{musicaAtual.name}</Text>
          <Text style={styles.artist}>{musicaAtual.artist}</Text>
        </View>

        <Link href="/request" asChild>
          <TouchableOpacity style={styles.requestButton}>
            <Feather name="plus-circle" size={20} color="#0d0d0d" style={{ marginRight: 8 }} />
            <Text style={styles.requestText}>Fazer pedido de música</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

export default Client;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    paddingHorizontal: 20,
    paddingTop: 30,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  eventBox: {
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFB052',
    marginBottom: 20,
    width: '100%',
  },
  eventTitle: {
    color: '#FFB052',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  eventDetails: {
    color: '#ccc',
    fontSize: 14,
  },
  nowPlaying: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#00FFFF',
    marginBottom: 30,
    alignItems: 'center',
    width: '100%',
  },
  albumImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 10,
  },
  nowPlayingLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  songTitle: {
    fontSize: 18,
    color: '#FFB052',
    fontWeight: 'bold',
  },
  artist: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
  },
  requestButton: {
    flexDirection: 'row',
    backgroundColor: '#FFB052',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  requestText: {
    color: '#0d0d0d',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
