import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

type BackButtonProps = {
  variant?: 'internal' | 'login';
};

const BackButton = ({ variant = 'internal' }: BackButtonProps) => {
  const router = useRouter();

  const isLogin = variant === 'login';
  const circleStyle = isLogin ? loginStyles.backCircle : internalStyles.backCircle;
  const headerStyle = isLogin ? loginStyles.header : internalStyles.header;
  const iconColor = '#0d0d0d';

  return (
    <View style={headerStyle}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <View style={circleStyle}>
          <Feather name="arrow-left" size={20} color={iconColor} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  backButton: {
    marginLeft: 0,
  },
});

const internalStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#00FFFF',
    marginBottom: 1,
  },
  backCircle: {
    backgroundColor: '#00FFFF',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const loginStyles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 40,              
    left: 20,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backCircle: {
    backgroundColor: '#FFB052',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
