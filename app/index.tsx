import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const Login = () => {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!nome.trim() || !senha.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha o login e a senha para continuar.');
      return;
    }

    try {
      await AsyncStorage.setItem('userName', nome);
      router.push('/identification');
    } catch (error) {
      console.error('Erro ao salvar nome:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} resizeMode="contain"/>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Login:"
        placeholderTextColor="#aaa"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha:"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

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
