import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type HeaderMusicianProps = {
  name: string;
  place: string;
};

const HeaderMusician = ({ name, place }: HeaderMusicianProps) => {
  return (
    <View style={styles.header}>
      <Link href="/musicianProfile" asChild>
        <TouchableOpacity style={styles.profileButton}>
          <Feather name="user" size={20} color="#0d0d0d" />
        </TouchableOpacity>
      </Link>

      <View style={styles.info}>
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

export default HeaderMusician;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 60,
  },
  profileButton: {
    backgroundColor: '#00FFFF',
    padding: 10,
    borderRadius: 10,
    marginRight: 12,
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
});