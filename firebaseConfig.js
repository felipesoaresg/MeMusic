import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth/react-native';

const firebaseConfig = {
  apiKey: "AIzaSyCCNFS79X8ZVetsF3KAo1D3Nvr-oXd2b8E",
  authDomain: "memusicas-12ba2.firebaseapp.com",
  projectId: "memusicas-12ba2",
  storageBucket: "memusicas-12ba2.firebasestorage.app",
  messagingSenderId: "440014822742",
  appId: "1:440014822742:web:60ecfb69b523f13af74af7",
};

const appAlreadyInitialized = getApps().length > 0;
export const app = appAlreadyInitialized ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = appAlreadyInitialized
  ? getAuth(app)
  : initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });