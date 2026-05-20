import BackButton from '@/components/Backbutton';
import Constants from 'expo-constants';
import { Image, StyleSheet, Text, View } from 'react-native';

const COMMIT_HASH = process.env.EXPO_PUBLIC_COMMIT_HASH ?? 'desconhecido';

const About = () => {
  const appVersion = Constants.manifest?.version ?? '1.0.0';

  return (  
    <View style={styles.container}>
      <BackButton variant="login"/>

      <View style={styles.content}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.appName}>MeMusicas</Text>
        <Text style={styles.description}>
          Plataforma de pedidos musicais que conecta clientes e músicos em tempo real.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Versão</Text>
          <Text style={styles.cardValue}>{appVersion}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Commit de referência</Text>
          <Text style={styles.commitHash}>{COMMIT_HASH}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Desenvolvido por</Text>
          <Text style={styles.cardValue}>Felipe Soares</Text>
        </View>
      </View>
    </View>
  );
};

export default About;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 280,
    height: 140,
    marginBottom: 10,
  },
  appName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#111',
    width: '100%',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 12,
  },
  cardLabel: {
    color: '#999',
    fontSize: 12,
    marginBottom: 4,
  },
  cardValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  commitHash: {
    color: '#FFB052',
    fontSize: 13,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
});
