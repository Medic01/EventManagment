<template>
  <div class="home-container">
    <header class="header">
      <h1>Event Manager</h1>
      <p>Your ultimate event management tool</p>
      <nav class="nav-menu">
        <router-link to="/events" class="nav-item">View Events</router-link>
        <router-link to="/add-event" class="nav-item">Add New Event</router-link>
        <button @click="logout" class="logout-button">Logout</button>
      </nav>
      <div class="user-info">
        <p>{{ userName }} {{ userSurname }}</p>
      </div>
    </header>

    <section class="main-content">
      <div class="card-container">
        <div class="card" v-for="event in events" :key="event.id">
          <h2>{{ event.name }}</h2>
          <p>Date: {{ event.date }}</p>
          <p>Time: {{ event.time }}</p>
          <p>Location: {{ event.location }}</p>
          <p>Category: {{ event.category }}</p>
        </div>
      </div>
    </section>
  </div>
</template>


<script>
import { ref, onMounted } from "vue";
import { db, auth } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useRouter } from "vue-router"; // Import useRouter

export default {
  name: "HomePage",
  setup() {
    const events = ref([]);
    const userName = ref("");
    const userSurname = ref("");
    const router = useRouter(); // Initialize router

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
          const userDoc = doc(db, "users", user.uid); // Assuming the user's data is stored in "users" collection with their UID as the document ID
          const docSnap = await getDoc(userDoc);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            userName.value = userData.name;
            userSurname.value = userData.surname;
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

    const logout = () => {
      auth
        .signOut()
        .then(() => {
          router.push("/"); // Use router to navigate to AuthPage
        })
        .catch((error) => {
          console.error("Error signing out: ", error);
        });
    };

    return { events, logout, userName, userSurname };
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
}

.header {
  background: #007bff;
  color: white;
  padding: 20px;
  text-align: center;
  position: relative;
}

.header h1 {
  margin: 0;
  font-size: 2.5rem;
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
  background: #0056b3;
  padding: 10px 20px;
  border-radius: 5px;
  transition: background 0.3s;
}

.nav-item:hover {
  background: #004494;
}

.logout-button {
  position: absolute;
  right: 20px;
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

.user-info {
  position: absolute;
  top: 20px;
  left: 20px;
  color: white;
  font-size: 1rem;
}

.main-content {
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
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
}

.card h2 {
  margin-top: 0;
  font-size: 1.5rem;
}

.card p {
  font-size: 1rem;
}
</style>

