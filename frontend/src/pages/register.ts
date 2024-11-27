import { Router } from '@vaadin/router'
import { state } from '../state';
class Register extends HTMLElement {
    connectedCallback() {
        this.render();
        const formEl = this.querySelector('.form')
        formEl.addEventListener('submit', (e) => {
            e.preventDefault();
            const eventTarget = e.target as any;
            const eventoNombre = eventTarget.nombre.value;
            const eventoEmail = eventTarget.email.value
            
             state.singUp(eventoNombre, eventoEmail).then( (respuesta) =>{
                if(respuesta == 'ok'){
                    alert('Usuario registrado');
                    Router.go('/ingresar')
                }else{
                    alert('Email ya en uso, intente con otro')
                }
             });
           
            
        })
        
    }
    render() {
        this.innerHTML = `
        <div class="contenedor__register">
            <h1 class="h1__bienvenido">Registrate</h1>

            <form class="form">

                    <div class="div__label__text">
                        <label class="label__text">Email</label>
                    </div>
                    <input class="input_text" name="email" required>

                    <div class="div__label__text">
                        <label class="label__text">Nombre</label>
                    </div>
                    <input class="input_text" name="nombre" required >

                <button class="boton" type="submit">Comenzar</button>
            </form>
        </div>
           
        `

    }
}
customElements.define('register-page', Register)