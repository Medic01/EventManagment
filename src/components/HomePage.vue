<template>
  <div :class="['home-container', { 'dark-theme': isDarkTheme }]">
    <header class="header">
      <div class="header-content">
        <h1>Event Management</h1>
        <p>Your ultimate event management tool</p>
        <nav class="nav-menu">
          <!-- Favorites button -->
          <router-link to="/favorites" class="nav-item">Favourites</router-link>
          
          <!-- Button for adding new event, visible only for 'ADMIN' users -->
          <router-link v-if="userRole === 'ADMIN'" to="/add-event" class="nav-item">
            Add New Event
          </router-link>
          <button @click="logout" class="logout-button">Logout</button>
          <button @click="toggleDarkTheme" class="dark-mode-toggle">
            {{ isDarkTheme ? 'Light Mode' : 'Dark Mode' }}
          </button>
        </nav>
        <div class="user-info">
          <p>{{ userName }} {{ userSurname }}</p>
        </div>
      </div>
    </header>

    <section class="main-content">
      <div class="filter-menu">
        <div class="icon-container">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="filterEvents(cat)"
            :class="{'active': selectedCategory === cat}"
          >
            <i :class="categoryIcons[cat]" aria-hidden="true"></i>
            <span>{{ cat }}</span>
          </button>
        </div>
        <button @click="filterEvents(null)" :class="{'active': selectedCategory === null}">
          <i class="fa fa-list" aria-hidden="true"></i>
          <span>All</span>
        </button>
      </div>
      <div class="card-container">
        <div class="card" v-for="event in filteredEvents" :key="event.id">
          <div class="event-content">
            <img v-if="event.imageUrl" :src="event.imageUrl" alt="Event Image" class="event-image" />
            <div class="event-details">
              <h2>{{ event.name }}</h2>
              <p>Date: {{ event.date }}</p>
              <p>Time: {{ event.time }}</p>
              <p>Location: {{ event.location }}</p>
              <p>Category: {{ event.category }}</p>
              
              <!-- Button to add/remove event from favorites -->
              <button @click="toggleFavorite(event)" class="favorite-button">
  {{ isFavorite(event) ? '❤️ Remove from Favorites' : '🤍 Add to Favorites' }}
</button>

            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { db, auth } from "../firebase";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "vue-router";

export default {
  name: "HomePage",
  setup() {
    const events = ref([]);
    const userName = ref("");
    const userSurname = ref("");
    const userRole = ref(""); 
    const selectedCategory = ref(null);
    const favorites = ref([]);
    const isDarkTheme = ref(false); // New reactive property for dark theme
    const categories = ["Music", "Art", "Nightlife", "Hobbies", "Food & Drink"];
    const categoryIcons = {
      Music: "fa fa-music",
      Art: "fa fa-paint-brush",
      Nightlife: "fa fa-glass-martini-alt",
      Hobbies: "fa fa-sun",
      "Food & Drink": "fa fa-utensils"
    };
    const router = useRouter();

    const fetchEvents = async () => {
      try {
        const eventsCollection = collection(db, "events");
        const eventSnapshot = await getDocs(eventsCollection);
        events.value = eventSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    };

    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = doc(db, "users", user.uid);
          const docSnap = await getDoc(userDoc);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            userName.value = userData.name;
            userSurname.value = userData.surname;
            userRole.value = userData.role;
            favorites.value = userData.favorites || []; // Load favorites from Firestore
          }
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    onMounted(() => {
      fetchEvents();
      fetchUserData();
    });

    const filterEvents = (category) => {
      selectedCategory.value = category;
    };

    const filteredEvents = computed(() => {
      if (!selectedCategory.value) {
        return events.value;
      }
      return events.value.filter(event => event.category === selectedCategory.value);
    });

    const logout = () => {
      auth
        .signOut()
        .then(() => {
          router.push("/"); 
        })
        .catch((error) => {
          console.error("Error signing out: ", error);
        });
    };

    // Check if the event is in the user's favorites
    const isFavorite = (event) => {
      return favorites.value.includes(event.id);
    };

    // Toggle favorite status of an event
    const toggleFavorite = async (event) => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = doc(db, "users", user.uid);
        if (isFavorite(event)) {
          // Remove from favorites
          favorites.value = favorites.value.filter(fav => fav !== event.id);
        } else {
          // Add to favorites
          favorites.value.push(event.id);
        }
        // Update user's favorites in Firestore
        await updateDoc(userDoc, { favorites: favorites.value });
      }
    };

    // Toggle dark theme
    const toggleDarkTheme = () => {
      isDarkTheme.value = !isDarkTheme.value;
    };

    return {
      events,
      logout,
      userName,
      userSurname,
      userRole, 
      categories,
      filterEvents,
      filteredEvents,
      selectedCategory,
      categoryIcons,
      isFavorite,
      toggleFavorite,
      toggleDarkTheme,
      isDarkTheme,
    };
  },
};
</script>

<style scoped>
.home-container {
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: 100vh;
  font-family: "Arial", sans-serif;
  color: #333;
  background: #f9f9f9;
  transition: background-color 0.3s, color 0.3s;
}

.dark-theme {
  background: #121212;
  color: #e0e0e0;
}

.header {
  background: #343a40;
  color: white;
  padding: 20px;
  text-align: center;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.header h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.header p {
  margin: 10px 0;
  font-size: 1.2rem;
}

.nav-menu {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
}

.nav-item {
  color: white;
  text-decoration: none;
  background: #007bff;
  padding: 10px 20px;
  border-radius: 5px;
  transition: background 0.3s;
}

.nav-item:hover {
  background: #0056b3;
}

.logout-button {
  position: absolute;
  right: 120px;
  top: 20px;
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.logout-button:hover {
  background: #c82333;
}

.dark-mode-toggle {
  position: absolute;
  right: 20px;
  top: 20px;
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.dark-mode-toggle:hover {
  background: #0056b3;
}

.user-info {
  position: absolute;
  top: 20px;
  left: 20px;
  color: white;
  font-size: 1rem;
}

.main-content {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.filter-menu {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.filter-menu .icon-container {
  display   : flex;
  gap: 10px;
}

.filter-menu button {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  font-size: 0.9rem;
}

.filter-menu button i {
  margin-right: 8px;
}

.filter-menu button.active,
.filter-menu button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.card-container {
  display: grid;
  gap: 20px;
}

.card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: box-shadow 0.3s, transform 0.3s;
}

.card:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  transform: translateY(-5px);
}

.event-content {
  display: flex;
  gap: 20px;
  align-items: center;
}

.event-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 10px;
}

.event-details {
  flex: 1;
  text-align: left;
}

.card h2 {
  margin-top: 0;
  font-size: 1.6rem;
  font-weight: 600;
}

.card p {
  font-size: 1rem;
  margin: 5px 0;
}

/* Dark mode styles */
.dark-theme .card {
  background: #1e1e1e;
  border-color: #333;
}

.dark-theme .event-details {
  color: #e0e0e0;
}

.dark-theme .nav-item,
.dark-theme .logout-button,
.dark-theme .dark-mode-toggle {
  background: #444;
  color: #fff;
}

.dark-theme .nav-item:hover,
.dark-theme .logout-button:hover,
.dark-theme .dark-mode-toggle:hover {
  background: #555;
}

.favorite-button {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: transform 0.2s;
}

.favorite-button:hover {
  transform: scale(1.1);
}

</style>

