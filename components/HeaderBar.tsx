import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type HeaderBarProps = {
  name: string;
  place: string;
  onLogout?: () => void;
};

const HeaderBar = ({ name, place, onLogout }: HeaderBarProps) => {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          if (onLogout) {
            onLogout();
          } else {
            router.replace('/');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <View style={styles.backCircle}>
          <Feather name="arrow-left" size={20} color="#0d0d0d" />
        </View>
      </TouchableOpacity>

      <View style={styles.info}>
        <Text style={styles.greeting}>
          Olá, <Text style={styles.name}>{name}</Text>
        </Text>
        <Text style={styles.location}>
          Você se encontra em: <Text style={styles.place}>{place}</Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Feather name="log-out" size={18} color="#0d0d0d" />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderBar;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 60,
  },
  backButton: {
    marginRight: 12,
  },
  backCircle: {
    backgroundColor: '#00FFFF',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  name: {
    color: '#00FFFF',
    fontWeight: 'bold',
  },
  location: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
  },
  place: {
    color: '#00FFFF',
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FFB052',
    padding: 10,
    borderRadius: 10,
    marginLeft: 12,
  },
});