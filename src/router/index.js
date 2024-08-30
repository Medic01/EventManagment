import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomePage.vue';
import EventList from '../components/EventList.vue';
import AddEvent from '../components/AddEvent.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/events', component: EventList },
  { path: '/add-event', component: AddEvent }
];


const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
