import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
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
import { loginCliente } from '../services/api';
import type { ClienteResponse } from '../types/cliente';

const clientSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
});

type ClientData = z.infer<typeof clientSchema>;

const ClientLogin = () => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientData>({
    resolver: zodResolver(clientSchema),
  });

  const handleClientLogin = async (data: ClientData) => {
    try {
      const response = await loginCliente(data.nome) as ClienteResponse;

      const clientId = String(response.cliente.id_cliente);
      const clientName = data.nome.trim();

      router.push({
        pathname: '/client',
        params: {
          clientId,
          clientName,
        },
      });
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error?.message || 'Não foi possível entrar como cliente'
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

      <TouchableOpacity style={styles.button} onPress={handleSubmit(handleClientLogin)}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ClientLogin;

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