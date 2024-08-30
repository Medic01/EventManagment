import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Importuj router
import AppHeader from './components/AppHeader.vue'; // Importuj Header komponentu

const app = createApp(App);

// Registruj Header kao globalnu komponentu
app.component('AppHeader', AppHeader);

// Koristi router u aplikaciji
app.use(router);

// Montiraj aplikaciju
app.mount('#app');
