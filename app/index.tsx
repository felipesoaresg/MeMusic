import { Link } from 'expo-router';
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} resizeMode="contain"/>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Login:"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha:"
        placeholderTextColor="#aaa"
        secureTextEntry
      />

      <Link href="/identification" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
      </Link>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logoContainer: {
    marginBottom: 30,
    padding: 20,
  },
  logo: {
    width: 400,
    height: 200,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderColor: '#3D3778',
    borderWidth: 2,
    paddingHorizontal: 15,
    color: '#fff',
    marginBottom: 15,
  },
  button: {
    width: '100%',
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
});
