import BackButton from '@/components/Backbutton';
import { auth } from '@/firebaseConfig';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MusicianProfile = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saindo, setSaindo] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const user = auth.currentUser;

        if (user) {
          await user.reload();
          setNome(user.displayName || '');
          setEmail(user.email || '');
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          try {
            setSaindo(true);
            await signOut(auth);
            router.replace('/');
          } catch (error) {
            console.error('Erro ao sair:', error);
            Alert.alert('Erro', 'Não foi possível sair');
          } finally {
            setSaindo(false);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#00FFFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BackButton />

      <View style={styles.content}>
        <View style={styles.avatar}>
          <Feather name="user" size={40} color="#0d0d0d" />
        </View>

        <Text style={styles.nome}>{nome || 'Usuário'}</Text>
        <Text style={styles.email}>{email || 'Sem email'}</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Local</Text>
          <Text style={styles.value}>GastroBar</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Tipo</Text>
          <Text style={styles.value}>Músico</Text>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, saindo && { opacity: 0.6 }]}
          onPress={handleLogout}
          disabled={saindo}
        >
          {saindo ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Feather name="log-out" size={18} color="#fff" />
              <Text style={styles.logoutText}>Sair da conta</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MusicianProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  content: {
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#00FFFF',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  nome: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  email: {
    color: '#999',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#111',
    width: '100%',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00FFFF',
    marginBottom: 10,
  },
  label: {
    color: '#999',
    fontSize: 12,
  },
  value: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#c62828',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    gap: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});