// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Importuj router
import AppHeader from './components/AppHeader.vue'; // Importuj AppHeader komponentu

// Kreiraj aplikaciju
const app = createApp(App);

// Registruj AppHeader kao globalnu komponentu
app.component('AppHeader', AppHeader);

// Koristi Vue Router
app.use(router);

// Montiraj aplikaciju na DOM element sa ID-jem 'app'
app.mount('#app');
