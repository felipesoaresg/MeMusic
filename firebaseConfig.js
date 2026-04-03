import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Optionally import the services that you want to use
// import {...} from 'firebase/auth';
// import {...} from 'firebase/database';
// import {...} from 'firebase/firestore';
// import {...} from 'firebase/functions';
// import {...} from 'firebase/storage';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCCNFS79X8ZVetsF3KAo1D3Nvr-oXd2b8E",
  authDomain: "memusicas-12ba2.firebaseapp.com",
  projectId: "memusicas-12ba2",
  storageBucket: "memusicas-12ba2.firebasestorage.app",
  messagingSenderId: "440014822742",
  appId: "1:440014822742:web:60ecfb69b523f13af74af7",
  measurementId: "G-GGSYJWYVF2"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
