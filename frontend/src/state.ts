import { rtdb } from "./rtdb";
import { onValue, ref } from "firebase/database";
import map from "lodash/map"

const API_BASE_URL = "http://localhost:3000";
type Mensajes = {
  from: string,
  menssage: string
}
const state = {
  data: {
    nombre: "",
    idUsuario: "",
    idSalaAmigable: "",
    idSalaComplicada: "",
    email: "",
    messages: [],
  },

  listeners: [], // los callbacks

  Init() {
    //ME ENGANCHO A LA RTDB
    const starCountRef = ref(rtdb, `rooms/${this.data.idSalaComplicada}`);
    console.log(starCountRef)
    const currentState = this.getState();
    onValue(starCountRef, (snapShot) => {
      const data = snapShot.val();

      //MAPEO CON LODASH PARA HACERLO UN ARRAY DE OBJETOS
      const mensajeArray = map(data.messages);
      currentState.messages = mensajeArray;
      console.log("current state", currentState)
      this.setState(currentState)
    });

  },
  getState() {
    return this.data;
  },
  setState(newState) {
    this.data = newState;
    console.log("El estado cambio: ", this.getState())
    for (const cb of this.listeners) {
      cb()
    }
  },
  subscribe(callback: (any) => any) {
    this.listeners.push(callback)
  },
  setSalaNueva(userId) {
    return fetch(API_BASE_URL + "/rooms", {
      method: "post",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        userId
      })
    }).then((res) => {
      return res.json()
    }).then((data) => {
      this.setIdSalaAmigable(data.idAmigable) 
      this.setIdSalaComplicada(data.idComplicada);
      this.Init();
    })
  },
  setSalaConocida(idSala) {
    return fetch(API_BASE_URL + `/rooms/${idSala}`, {
      method: "get",
    }).then((res) => {
      return res.json()
    }).then((data) => {
      this.setIdSalaComplicada(data.roomId);
      this.Init();
    })
  }
  ,
  setNombreAndEmail(nombre: string, email: string) {
    const currentState = this.getState();
    currentState.nombre = nombre;
    currentState.email = email;
    this.setState(currentState);
  },
  setIdSalaAmigable(idSalaAmigable: string) {
    const currentState = this.getState();
    currentState.idSalaAmigable = idSalaAmigable;
    this.setState(currentState);
  }
  ,
  setIdSalaComplicada(idSalaComplicada: string) {
    const currentState = this.getState();
    currentState.idSalaComplicada = idSalaComplicada;
    this.setState(currentState);
  }
  ,
  setIdUsuario(idUsuario) {
    const currentState = this.getState();
    currentState.idUsuario = idUsuario;
    this.setState(currentState);
  }
  ,
  pushMessages(message: string) {
    console.log('Pushea los Msjs ? : ', message)
    const nombreDelState = this.data.nombre;
    fetch(API_BASE_URL + `/rooms/${this.data.idSalaComplicada}`, {
      method: "post",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        nombre: nombreDelState,
        message: message
      }),
    })
  },
  singUp(nombre, email) {
    return fetch(API_BASE_URL + "/signup", {
      method: "post",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        nombre,
        email
      }),
    }).then(respuesta => {
      return respuesta.json();
    }).then(data => {
      console.log("DatA? : ", data);
      return "ok"
    }).catch(error => {
      console.error("Error en el registro:", error);
      return "no"
    })
  }
  ,
  Auth(email) {
    return fetch(API_BASE_URL + "/auth", {
      method: "post",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        email
      }),
    }).then(respuesta => {
      return respuesta.json();
    }).then(data => {
      return data
    }).catch(error => {
      return error
    })
  },
  crearRoom(userId) {

    fetch(API_BASE_URL + `/rooms`, {
      method: "post",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        userId
      }),
    }).then(respuesta => {
      return respuesta.json();
    }).then(data => {
      console.log("data del room creado : ", data)
    })
  }
}

export { state }
