import { Link } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Identification = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Quem é você?</Text>

      <Link href="/client" asChild>
          <TouchableOpacity style={styles.buttonCliente}>
            <Text style={styles.buttonText}>Cliente</Text>
          </TouchableOpacity>
      </Link>

        <Link href="/musican" asChild>
          <TouchableOpacity style={styles.buttonMusico}>
            <Text style={styles.buttonText}>Músico</Text>
          </TouchableOpacity>
        </Link>
    </View>
  );
};

export default Identification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 400,
    height: 200,
    marginBottom: 30,
  },
  title: {
    fontSize: 18,
    color: '#8c83d6ff',
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'flex-start', 
    paddingLeft: 45,   
  },
  buttonCliente: {
    width: '80%',
    height: 50,
    backgroundColor: '#3597A6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#0d0d0d',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonMusico: {
    width: '80%',
    height: 50,
    backgroundColor: '#FFB052',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
});
