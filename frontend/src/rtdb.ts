import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, set, update } from "firebase/database";

const firebaseConfig = {
    apiKey: "colocar Api key aca ",
  authDomain: "realtime-practice-de43c.firebaseapp.com",
  databaseURL: "https://realtime-practice-de43c-default-rtdb.firebaseio.com",
  };

  //INICIALIZO LA CONEX A LA BD
const app = initializeApp(firebaseConfig);

const rtdb = getDatabase(app);


export {rtdb}