import { Router } from '@vaadin/router'
import { state } from '../state';
class Home extends HTMLElement {
    connectedCallback() {
        this.render();
        const formEl = this.querySelector('.form')
        formEl.addEventListener('submit', (e) => {
            e.preventDefault();
            const eventTarget = e.target as any;
            const eventoNombre = eventTarget.nombre.value;
            const eventoEmail = eventTarget.email.value;
            const eventoOpcion = eventTarget.opcionroom.value;
            const roomIdOpc = eventTarget.room__id.value;
            
//SEGUIR ACA INGRESA Y GUARDA BIEN EL USUARIO CON SU ID AHORA TENGO QUE CREAR EL ROOM EN CASO DE SER "NUEVO" O INGRESAR A UNO EXISTENTE EN CASO DE PASAR UN ID
            state.Auth(eventoEmail).then( response => {
                console.log(response)
                console.log(`Nombre : ${eventoNombre}   Email: ${eventoEmail}`)
                if (!response.ok){
                    alert('Usuario no registrado, registrate por favor!');
                    Router.go('/register')
                }else{
                    state.setNombreAndEmail(eventoNombre, eventoEmail);
                    state.setIdUsuario(response.id);
                   
                    if(eventoOpcion === "nuevo"){
                        state.setSalaNueva(state.data.idUsuario);
                    }else{
                        state.setIdSalaAmigable(roomIdOpc)
                        state.setSalaConocida(roomIdOpc);
                    }
                       Router.go('/chat')
                }
            })
            
        })
        const selectEl = this.querySelector('#opcion__room');
        selectEl.addEventListener('change', (e)=>{
            const evento = e.target as any
            const valorEvento = evento.value ;
            const roomIdEl = this.querySelector('.room__id');
            const labelRoomIdEl = this.querySelector('.label__room-id');
            valorEvento == "nuevo" ? 
                                    (roomIdEl.classList.add('ocultar'), roomIdEl.removeAttribute('required'),labelRoomIdEl.classList.add('ocultar'))
                                    : 
                                    (roomIdEl.classList.remove('ocultar'), roomIdEl.setAttribute('required', ''), labelRoomIdEl.classList.remove('ocultar'))
        })
    }
    render() {
        this.innerHTML = `
        <div class="contenedor__formHome">
            <h1 class="h1__bienvenido">Bienvenido</h1>

            <form class="form">

                    <div class="div__label__text">
                        <label class="label__text">Email</label>
                    </div>
                    <input class="input_text" name="email" required>

                    <div class="div__label__text">
                        <label class="label__text">Nombre</label>
                    </div>
                    <input class="input_text" name="nombre" required >

                    <div class="div__label__text">
                        <label class="label__text">Room</label>
                    </div>
                    <select class="input_text" name="opcionroom" id="opcion__room" required>
                        <option disabled selected >Seleccione un room</option>
                        <option value="nuevo">Nuevo room</option>
                        <option value="existente">Room Existente</option>
                    </select>

                    <div class="div__label__text label__room-id ocultar">
                        <label class="label__text">Room Id</label>
                    </div>
                    <input class="input_text room__id ocultar" name="room__id">

                <button class="boton" type="submit">Comenzar</button>
            </form>
           </div>
        `

    }
}
customElements.define('home-page', Home)