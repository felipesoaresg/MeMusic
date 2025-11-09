import { zodResolver } from '@hookform/resolvers/zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { z } from 'zod';

const loginSchema = z.object({
  nome: z.string().min(1, 'Login obrigatório'),
  senha: z.string().min(1, 'Senha obrigatória'),
});

type LoginData = z.infer<typeof loginSchema>;

const Login = () => {
  const router = useRouter();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data: LoginData) => {
    try {
      await AsyncStorage.setItem('userName', data.nome);
      router.push('/identification');
    } catch (error) {
      console.error('Erro ao salvar nome:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Login:"
        placeholderTextColor="#aaa"
        onChangeText={text => setValue('nome', text)}
        {...register('nome')}
      />
      {errors.nome && <Text style={styles.error}>{errors.nome.message}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Senha:"
        placeholderTextColor="#aaa"
        secureTextEntry
        onChangeText={text => setValue('senha', text)}
        {...register('senha')}
      />
      {errors.senha && <Text style={styles.error}>{errors.senha.message}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSubmit(handleLogin)}>
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
  error: {
    color: '#FF6B6B',
    alignSelf: 'flex-start',
    marginBottom: 8,
    marginTop: -10,
  },
});
