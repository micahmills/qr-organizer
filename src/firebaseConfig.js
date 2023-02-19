import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyD6xtWsMnxdZjLzlpUW1PVB3lxeDsS915E',
  authDomain: 'qr-organizer-14e12.firebaseapp.com',
  projectId: 'qr-organizer-14e12',
  storageBucket: 'qr-organizer-14e12.appspot.com',
  messagingSenderId: '737464270821',
  appId: '1:737464270821:web:68e8ef84ea775a4e1af90c',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const containersRef = collection(db, 'Containers');
const itemsRef = collection(db, 'Items');
const auth = getAuth(app);

export {
  firebaseConfig,
  app,
  db,
  containersRef,
  itemsRef,
  auth,
  doc,
  deleteDoc,
};
