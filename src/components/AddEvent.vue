<template>
  <div class="add-event-container">
    <h1>Add Event</h1>
    <form @submit.prevent="addEvent">
      <div class="form-group">
        <label for="name">Event Name:</label>
        <input type="text" v-model="name" id="name" required />
      </div>
      <div class="form-group">
        <label for="date">Event Date:</label>
        <input type="date" v-model="date" id="date" required />
      </div>
      <div class="form-group">
        <label for="time">Event Time:</label>
        <input type="time" v-model="time" id="time" required />
      </div>
      <div class="form-group">
        <label for="location">Location:</label>
        <input type="text" v-model="location" id="location" required />
      </div>
      <div class="form-group">
        <label for="category">Category:</label>
        <select v-model="category" id="category" required>
          <option disabled value="">Please select one</option>
          <option value="Music">Music</option>
          <option value="Nightlife">Nightlife</option>
          <option value="Art">Art</option>
          <option value="Hobbies">Hobbies</option>
          <option value="Food & Drink">Food & Drink</option>
        </select>
      </div>
      <button type="submit" class="submit-button">Add Event</button>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default {
  setup() {
    const name = ref("");
    const date = ref("");
    const time = ref("");
    const location = ref("");
    const category = ref("");

    const addEvent = async () => {
      try {
        const eventsCollection = collection(db, "events");
        await addDoc(eventsCollection, {
          name: name.value,
          date: date.value,
          time: time.value,
          location: location.value,
          category: category.value,
        });
        name.value = "";
        date.value = "";
        time.value = "";
        location.value = "";
        category.value = "";
        alert("Event added successfully!");
      } catch (error) {
        console.error("Error adding event: ", error);
      }
    };

    return { name, date, time, location, category, addEvent };
  },
};
</script>

<style scoped>
.add-event-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
}

input,
select {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
}

.submit-button {
  margin-top: 20px;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #0056b3;
}
</style>
