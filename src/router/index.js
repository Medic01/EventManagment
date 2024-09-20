import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '../firebase'; // Importuj Firebase Authentication
import HomePage from '../components/HomePage.vue';
import EventList from '../components/EventList.vue';
import AddEvent from '../components/AddEvent.vue';
import LoginUser from '../components/LoginUser.vue';
import RegisterUser from '../components/RegisterUser.vue';
import AuthPage from '../components/AuthPage.vue'; // Dodaj novu komponentu
import EventFavourites from '../components/EventFavourites.vue'; // Importuj Favorites komponentu

const routes = [
  { path: '/', component: AuthPage }, // Postavi AuthPage kao početnu stranicu
  { path: '/login', component: LoginUser },
  { path: '/register', component: RegisterUser },
  { 
    path: '/home', 
    component: HomePage,
    meta: { requiresAuth: true }  // Zaštićena ruta
  },
  { 
    path: '/events', 
    component: EventList,
    meta: { requiresAuth: true }  // Zaštićena ruta
  },
  { 
    path: '/add-event', 
    component: AddEvent,
    meta: { requiresAuth: true }  // Zaštićena ruta
  },
  { 
    path: '/favorites', 
    component: EventFavourites,  // Dodaj Favorites komponentu
    meta: { requiresAuth: true }  // Zaštićena ruta za Favorites
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guard za zaštitu ruta
router.beforeEach((to, from, next) => {
  const user = auth.currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !user) {
    // Ako ruta zahteva autentifikaciju i korisnik nije prijavljen, redirektuj na login
    next('/login');
  } else if (!requiresAuth && user && (to.path === '/login' || to.path === '/register')) {
    // Ako je korisnik već prijavljen i pokuša da pristupi login ili registracionoj strani, redirektuj ga na home
    next('/home');
  } else {
    next(); // Nastavi na sledeću rutu
  }
});

export default router;
