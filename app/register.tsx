import { zodResolver } from '@hookform/resolvers/zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { z } from 'zod';
import { auth } from '../firebaseConfig';
import { registrarCantorNaApi } from '../services/api';

const registerSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

type RegisterData = z.infer<typeof registerSchema>;

const Register = () => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

const handleRegister = async (data: RegisterData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.senha
    );

    const user = userCredential.user;

    await updateProfile(user, { displayName: data.nome });
    await user.reload();

    const updatedUser = auth.currentUser;
    if (!updatedUser) {
      throw new Error('Usuário não encontrado após cadastro');
    }

    const token = await updatedUser.getIdToken(true);

    await AsyncStorage.setItem('firebaseToken', token);
    await AsyncStorage.setItem('userName', data.nome);

    await registrarCantorNaApi(updatedUser);

    Alert.alert('Sucesso', 'Conta criada com sucesso!', [
      { text: 'OK', onPress: () => router.push('/') }
    ]);
  } catch (error: any) {
    Alert.alert(
      'Erro no cadastro',
      error?.message || 'Não foi possível criar a conta'
    );
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

      <Controller
        control={control}
        name="nome"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Nome:"
            placeholderTextColor="#aaa"
            autoCapitalize="words"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
          />
        )}
      />
      {errors.nome && <Text style={styles.error}>{errors.nome.message}</Text>}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Email:"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Controller
        control={control}
        name="senha"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Senha:"
            placeholderTextColor="#aaa"
            secureTextEntry
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
          />
        )}
      />
      {errors.senha && <Text style={styles.error}>{errors.senha.message}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSubmit(handleRegister)}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/')}>
        <Text style={styles.loginText}>
          Já tem uma conta? <Text style={styles.loginLink}>Entrar</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Register;

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
  loginText: {
    color: '#aaa',
    fontSize: 14,
  },
  loginLink: {
    color: '#3597A6',
    fontWeight: 'bold',
  },
});