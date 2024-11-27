import * as admin from 'firebase-admin';
import * as servieAccount from './keyBd.json';

admin.initializeApp({
    credential : admin.credential.cert(servieAccount as any),
    databaseURL : "https://realtime-practice-de43c-default-rtdb.firebaseio.com"
});

const dbFirebase = admin.firestore();

const rtdb = admin.database();

export { dbFirebase , rtdb}