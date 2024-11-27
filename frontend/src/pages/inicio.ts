import { Router } from "@vaadin/router";
import { state } from "../state";

class Inicio extends HTMLElement{
    connectedCallback(){
        this.render();
        const formEl = this.querySelector('.form');
        formEl.addEventListener('submit', (e)=>{
            e.preventDefault();
            const evento = e.submitter as any;
            evento.value === 'registrarse' ? Router.go('/register' ) : Router.go('/ingresar')
        })
    }
    render(){
        this.innerHTML = `
        <div class="contenedor__inicio">
            <h1>Bienvenido</h1>
            <h2>Estas registrado? </h1>
            <form class="form">
                <button class="boton" name="registrarse" value="registrarse">Registrarse</button>
                <button class="boton" name="ingresar" value="ingresar"> Ingresar</button>
            </form>
        </div>
        `
    }
}

customElements.define('inicio-page', Inicio)