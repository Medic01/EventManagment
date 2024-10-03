<template>
  <div :class="['home-container', { 'dark-theme': isDarkTheme }]">
    <!-- Hero Section -->
    <header class="header">
      <div class="header-content">
        <h1>Discover Your Next Event</h1>
        <p>Explore music, art, nightlife, and more</p>
        <nav class="nav-menu">
          <router-link to="/favorites" class="nav-item">Favourites</router-link>
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

    <!-- Main Content -->
    <section class="main-content">
      <div class="filter-menu">
        <div class="icon-container">
          <button v-for="cat in categories" :key="cat" @click="filterEvents(cat)"
            :class="{'active': selectedCategory === cat}">
            <i :class="categoryIcons[cat]" aria-hidden="true"></i>
            <span>{{ cat }}</span>
          </button>
        </div>
        <button @click="filterEvents(null)" :class="{'active': selectedCategory === null}">
          <i class="fa fa-list" aria-hidden="true"></i>
          <span>All</span>
        </button>
      </div>

      <!-- Event Cards -->
      <div class="card-container">
        <div 
          class="card" 
          v-for="event in filteredEvents" 
          :key="event.id" 
          :class="{'finished-event': isEventFinished(event.date)}"
        >
          <div class="event-content">
            <img v-if="event.imageUrl" :src="event.imageUrl" alt="Event Image" class="event-image" />
            <div class="event-details">
              <h2>{{ event.name }}</h2>
              <p>Date: {{ event.date }}</p>
              <p>Time: {{ event.time }}</p>
              <p>Location: {{ event.location }}</p>
              <p>Category: {{ event.category }}</p>

              <!-- Finished Event Label -->
              <p v-if="isEventFinished(event.date)" class="finished-label">Event Finished</p>

              <!-- Button to add/remove from favorites -->
              <button @click="toggleFavorite(event)" class="favorite-button">
                {{ isFavorite(event) ? '❤️ Remove from Favorites' : '🤍 Add to Favorites' }}
              </button>

              <!-- Button to delete event (Visible only for admin) -->
              <button v-if="userRole === 'ADMIN'" @click="deleteEvent(event.id)" class="delete-button">
                <i class="fa fa-trash" aria-hidden="true"></i>
              </button>

              <!-- Button to edit event (Visible only for admin) -->
              <button v-if="userRole === 'ADMIN'" @click="openEditModal(event)" class="edit-button">
                <i class="fa fa-edit" aria-hidden="true"></i> Edit Event
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <div v-if="showEditModal" class="modal-overlay">
        <div class="modal-content">
          <h2>Edit Event</h2>
          <form @submit.prevent="updateEvent">
            <div class="form-group">
              <label for="name">Event Name:</label>
              <input type="text" v-model="editEventData.name" id="name" required />
            </div>
            <div class="form-group">
              <label for="date">Event Date:</label>
              <input type="date" v-model="editEventData.date" id="date" required />
            </div>
            <div class="form-group">
              <label for="time">Event Time:</label>
              <input type="time" v-model="editEventData.time" id="time" required />
            </div>
            <div class="form-group">
              <label for="location">Location:</label>
              <input type="text" v-model="editEventData.location" id="location" required />
            </div>
            <div class="form-group">
              <label for="category">Category:</label>
              <select v-model="editEventData.category" id="category" required>
                <option value="Music">Music</option>
                <option value="Art">Art</option>
                <option value="Nightlife">Nightlife</option>
                <option value="Hobbies">Hobbies</option>
                <option value="Food & Drink">Food & Drink</option>
              </select>
            </div>
            <button type="submit" class="submit-button">Save Changes</button>
            <button type="button" class="cancel-button" @click="closeEditModal">Cancel</button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { db, auth } from "../firebase";
import { collection, getDocs, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
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
    const isDarkTheme = ref(false);
    const showEditModal = ref(false);
    const editEventData = ref({});
    const categories = ["Music", "Art", "Nightlife", "Hobbies", "Food & Drink"];
    const categoryIcons = {
      Music: "fa fa-music",
      Art: "fa fa-paint-brush",
      Nightlife: "fa fa-glass-martini-alt",
      Hobbies: "fa fa-sun",
      "Food & Drink": "fa fa-utensils",
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
            favorites.value = userData.favorites || [];
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
      return events.value.filter((event) => event.category === selectedCategory.value);
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

    const isFavorite = (event) => {
      return favorites.value.includes(event.id);
    };

    const toggleFavorite = async (event) => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = doc(db, "users", user.uid);
        if (isFavorite(event)) {
          favorites.value = favorites.value.filter((fav) => fav !== event.id);
        } else {
          favorites.value.push(event.id);
        }
        await updateDoc(userDoc, { favorites: favorites.value });
      }
    };

    const toggleDarkTheme = () => {
      isDarkTheme.value = !isDarkTheme.value;
    };

    // Check if the event date is in the past (for finished events)
    const isEventFinished = (eventDate) => {
      const today = new Date();
      const eventDateObj = new Date(eventDate);
      return eventDateObj < today;
    };

    // Function to delete event
    const deleteEvent = async (eventId) => {
      try {
        const eventDoc = doc(db, "events", eventId);
        await deleteDoc(eventDoc);
        events.value = events.value.filter((event) => event.id !== eventId);
      } catch (error) {
        console.error("Error deleting event: ", error);
      }
    };

    // Open the modal to edit the event
    const openEditModal = (event) => {
      editEventData.value = { ...event };
      showEditModal.value = true;
    };

    // Close the edit modal
    const closeEditModal = () => {
      showEditModal.value = false;
    };

    // Update the event
    const updateEvent = async () => {
      try {
        const eventDoc = doc(db, "events", editEventData.value.id);
        await updateDoc(eventDoc, {
          name: editEventData.value.name,
          date: editEventData.value.date,
          time: editEventData.value.time,
          location: editEventData.value.location,
          category: editEventData.value.category,
        });
        // Update local events data
        const index = events.value.findIndex((event) => event.id === editEventData.value.id);
        if (index !== -1) {
          events.value[index] = { ...editEventData.value };
        }
        closeEditModal();
      } catch (error) {
        console.error("Error updating event: ", error);
      }
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
      deleteEvent,
      openEditModal,
      closeEditModal,
      showEditModal,
      editEventData,
      updateEvent,
      isEventFinished,
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
  background-image: url('https://static.vecteezy.com/system/resources/thumbnails/008/011/877/small_2x/event-management-creation-and-development-personal-and-corporate-events-photo.jpg'); /* Putanja do tvoje slike */
  background-size: cover; /* Automatski prilagođava sliku prema veličini prozora */
  background-position: center; /* Postavlja sliku u centar */
  background-attachment: fixed; /* Pozadina ostaje fiksna prilikom skrolanja */
}

.dark-theme {
  background: #121212;
  color: #e0e0e0;
  background-image: url('https://t3.ftcdn.net/jpg/07/91/15/44/360_F_791154427_3eKfohowxkPxtrlObabnwGPYOIV5UFQS.jpg'); /* Različita slika za tamni mod */
  background-size: cover; /* Automatski prilagođava sliku prema veličini prozora */
  background-position: center; /* Postavlja sliku u centar */
  background-attachment: fixed; /* Pozadina ostaje fiksna prilikom skrolanja */
}

.header {
  background: #343a40;
  color: white;
  padding: 20px;
  text-align: center;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-image: url('https://static.showit.co/800/IocATTxEQ0WVuAJOQYUpgQ/119341/the_finer_things_event_planning_wedding_event_design_coordination_parties_party_designer_ohio_destination_jennifer_kontomerkos2.jpg'); /* Putanja do tvoje slike */
  background-size: cover; /* Automatski prilagođava sliku veličini headera */
  background-position: center; /* Postavlja sliku u centar headera */
  background-repeat: no-repeat; /* Sprečava ponavljanje slike */
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

.header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff; /* Boja teksta */
  text-shadow: 
    0 0 5px #fff,     /* Unutrašnji svetleći efekat */
    0 0 10px #00b3ff, /* Spoljni plavi sjaj */
    0 0 20px #00b3ff, 
    0 0 30px #00b3ff, 
    0 0 40px #00b3ff, 
    0 0 50px #00b3ff, 
    0 0 60px #00b3ff; /* Dublji svetleći efekat */
}

:root {
  --light-mode-color: #333; /* Tamna boja za light mode */
  --dark-mode-color: #fff;  /* Svetla boja za dark mode */
}

body.light-mode {
  --button-text-color: var(--light-mode-color);
}

body.dark-mode {
  --button-text-color: var(--dark-mode-color);
}

.favorite-button {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--button-text-color); /* Dinamička boja teksta */
  background-color: transparent;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.delete-button {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #dc3545; /* Crvena boja za gumb */
  font-size: 1.5rem; /* Veličina ikone */
  padding: 0.5rem;
  transition: transform 0.3s ease, color 0.3s ease;
}

.delete-button:hover {
  color: #ff5f5f; /* Svjetlija crvena kada se hovera */
  transform: scale(1.1); /* Efekt zumiranja */
}


/* Event Finished Label */
.finished-event {
  opacity: 0.5;
  position: relative;
}

.finished-label {
  color: #dc3545;
  font-weight: bold;
  font-size: 1.1rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.edit-button {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #007bff;
  font-size: 1.5rem;
  padding: 0.5rem;
}

.edit-button:hover {
  color: #0056b3;
}

.cancel-button {
  background-color: #dc3545;
  color: white;
  padding: 0.75rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cancel-button:hover {
  background-color: #c82333;
}

</style>

