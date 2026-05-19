import { app } from '@/firebaseConfig';
import { zodResolver } from '@hookform/resolvers/zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'Senha obrigatória'),
});

type LoginData = z.infer<typeof loginSchema>;

export default function MusicianLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data: LoginData) => {
    setLoading(true);
    try {
      const auth = getAuth(app);
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.senha);
      const token = await userCredential.user.getIdToken();

      await AsyncStorage.setItem('firebaseToken', token);

      router.push('/musician');
    } catch (error: any) {
      let errorMessage = 'Não foi possível fazer o login.';
      
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'E-mail ou senha incorretos.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Sem conexão com a internet.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Acesso bloqueado temporariamente por muitas tentativas fracassadas.';
      }
      
      Alert.alert('Erro no login', errorMessage);
    } finally {
      setLoading(false);
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
            editable={!loading}
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
            editable={!loading}
          />
        )}
      />
      {errors.senha && <Text style={styles.error}>{errors.senha.message}</Text>}

      <TouchableOpacity 
        style={[styles.button, loading && { opacity: 0.7 }]} 
        onPress={handleSubmit(handleLogin)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#0d0d0d" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/register')} disabled={loading}>
        <Text style={styles.registerText}>
          Não tem uma conta? <Text style={styles.registerLink}>Crie conta</Text>
        </Text>
      </TouchableOpacity>

      {/* Nota de Teste */}
      <Text style={styles.testNote}>
        Para testes: admin@teste.com Senha: Admin123
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0d0d0d', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 30 
  },
  logoContainer: { 
    marginBottom: 30, 
    padding: 20 
  },
  logo: { 
    width: 400, 
    height: 200 
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
    marginBottom: 15 
  },
  button: { 
    width: '100%', 
    height: 50, 
    backgroundColor: '#3597A6', 
    borderRadius: 8, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 20 
  },
  buttonText: { 
    color: '#0d0d0d', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  error: { 
    color: '#FF6B6B', 
    alignSelf: 'flex-start', 
    marginBottom: 8, 
    marginTop: -10 
  },
  registerText: { 
    color: '#aaa', 
    fontSize: 14,
    textAlign: 'center'
  },
  registerLink: { 
    color: '#3597A6', 
    fontWeight: 'bold' 
  },
  testNote: {
    marginTop: 30, 
    fontSize: 12, 
    color: '#555',
    textAlign: 'center'
  }
});