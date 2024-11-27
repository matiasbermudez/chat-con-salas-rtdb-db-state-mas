import { Router } from '@vaadin/router'
import { state } from '../state';

type Mensajes = {
    from : string,
    menssage: string
}
class Chat extends HTMLElement{
    nombreUsuario = state.data.nombre;
  
 
    connectedCallback(){
        state.subscribe(()=>{
            const currentState = state.getState();
            this.messages = currentState.messages;
            this.idSalaAmigable = currentState.idSalaAmigable;
            this.render();
        })
        this.render();
       
        
    }
    messages :[] = [];
    idSalaAmigable : "";
    //SI NO HAGO ESTE METODO Y LO INICIALIZO LUEGO DEL INNER NO SE VUELVE A ENGANCHAR EL EVENTLISTENER
    addListener(){
        const formEl = this.querySelector('.form');
        this.messages = state.getState();
        formEl.addEventListener('submit', (e)=>{
            e.preventDefault();
            const eventTarget = e.target as any;
            state.pushMessages(eventTarget.mensaje.value);
        })
    }
    render(){
        this.innerHTML = `
        <div class="contenedor__general-chat">
            <div class="contenedor__chat-id">
                <h1 class="h1__bienvenido">Chat</h1>
                <h2>Id sala: ${this.idSalaAmigable} </h2>
            </div>
            <div class="chat__contenedor">
            ${ this.messages.map(m => 
                { return `<div class="${(m.nombre).trim() === this.nombreUsuario ? 'usurio_local' : 'usuario_visitante'}">${m.message} : ${m.nombre}</div>`}).join(' ')}
            </div>
            <form class="form">
                <input class="input_text" name="mensaje">
                <button class="boton">Enviar</button>
            </form>
        </div>
        `;
        this.addListener();
    }
}
customElements.define('chat-page', Chat)