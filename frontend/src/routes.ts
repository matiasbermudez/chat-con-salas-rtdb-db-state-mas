import {Router} from '@vaadin/router';

const router = new Router(document.getElementById('root'));
router.setRoutes([
  {path: '/' , component: 'inicio-page'},
  {path: '/ingresar', component: 'home-page'},
  {path: '/chat', component: 'chat-page'},
  {path : '/register', component : 'register-page'}
]);