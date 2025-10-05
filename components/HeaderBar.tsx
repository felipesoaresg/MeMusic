import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type HeaderBarProps = {
  name: string;
  place: string;
};

const HeaderBar = ({ place }: HeaderBarProps) => {
  const router = useRouter();
  const [name, setName] = useState('');

  useEffect(() => {
    const loadName = async () => {
      const storedName = await AsyncStorage.getItem('userName');
      if (storedName) setName(storedName);
    };
    loadName();
  }, []);

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <View style={styles.backCircle}>
          <Feather name="arrow-left" size={20} color="#0d0d0d" />
        </View>
      </TouchableOpacity>

      <View>
        <Text style={styles.greeting}>
          Olá, <Text style={styles.name}>{name}</Text>
        </Text>
        <Text style={styles.location}>
          Você se encontra em: <Text style={styles.place}>{place}</Text>
        </Text>
      </View>
    </View>
  );
};

export default HeaderBar;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
});
