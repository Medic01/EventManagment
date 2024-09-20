<template>
    <div class="favorites-container">
      <h1>Your Favourite Events</h1>
      <div v-if="favoriteEvents.length === 0" class="no-favorites">
        <p>No favourite events yet.</p>
      </div>
      <div v-else class="events-grid">
        <div 
          v-for="event in favoriteEvents" 
          :key="event.id" 
          class="event-card"
        >
          <img :src="event.imageUrl" alt="Event Image" class="event-image" />
          <div class="event-details">
            <h2 class="event-name">{{ event.name }}</h2>
            <p class="event-date">{{ event.date }}</p>
            <button class="remove-button" @click="removeFromFavorites(event)">
              Remove from Favorites
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import { db, auth } from "../firebase";
  import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
  
  export default {
    setup() {
      const favoriteEvents = ref([]);
  
      const fetchFavoriteEvents = async () => {
        const user = auth.currentUser;
        if (user) {
          const userDoc = doc(db, "users", user.uid);
          const userSnapshot = await getDoc(userDoc);
          const favorites = userSnapshot.data().favorites || [];
  
          if (favorites.length > 0) {
            const eventsCollection = collection(db, "events");
            const eventSnapshot = await getDocs(eventsCollection);
            favoriteEvents.value = eventSnapshot.docs
              .map((doc) => ({ id: doc.id, ...doc.data() }))
              .filter((event) => favorites.includes(event.id));
          }
        }
      };
  
      const removeFromFavorites = async (event) => {
        const user = auth.currentUser;
        if (user) {
          const userDoc = doc(db, "users", user.uid);
          const userSnapshot = await getDoc(userDoc);
          const updatedFavorites = userSnapshot.data().favorites.filter(
            (fav) => fav !== event.id
          );
          await updateDoc(userDoc, { favorites: updatedFavorites });
  
          // Update UI
          favoriteEvents.value = favoriteEvents.value.filter(
            (favEvent) => favEvent.id !== event.id
          );
        }
      };
  
      onMounted(fetchFavoriteEvents);
  
      return {
        favoriteEvents,
        removeFromFavorites,
      };
    },
  };
  </script>
  
  <style scoped>
  /* General styles */
  .favorites-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    background-color: #f4f4f9;
    text-align: center;
  }
  
  h1 {
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 2rem;
    font-weight: 700;
  }
  
  .no-favorites p {
    font-size: 1.2rem;
    color: #777;
  }
  
  /* Grid for events */
  .events-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }
  
  /* Card styling */
  .event-card {
    background-color: #ffffff;
    border-radius: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.3s ease-in-out;
  }
  
  .event-card:hover {
    transform: translateY(-10px);
  }
  
  .event-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  
  .event-details {
    padding: 1.5rem;
  }
  
  .event-name {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 0.5rem;
  }
  
  .event-date {
    color: #666;
    font-size: 1rem;
    margin-bottom: 1rem;
  }
  
  .remove-button {
    background-color: #ff4d4f;
    color: white;
    border: none;
    padding: 0.8rem 1.2rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;
  }
  
  .remove-button:hover {
    background-color: #ff7875;
  }
  
  /* Responsive styling */
  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }
  
    .event-card {
      margin-bottom: 1rem;
    }
  
    .event-details {
      padding: 1rem;
    }
  
    .event-name {
      font-size: 1.25rem;
    }
  
    .event-date {
      font-size: 0.9rem;
    }
  
    .remove-button {
      padding: 0.6rem 1rem;
    }
  }
  </style>
  