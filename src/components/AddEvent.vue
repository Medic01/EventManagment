<template>
  <div class="add-event-container">
    <h1>Add Event</h1>
    <form @submit.prevent="addEvent" class="form">
      <div class="form-group">
        <label for="name">Event Name:</label>
        <input type="text" v-model="name" id="name" required placeholder="Enter event name" />
      </div>

      <div class="form-group">
        <label for="date">Event Date:</label>
        <input type="date" v-model="date" :min="today" id="date" required />
      </div>

      <div class="form-group">
        <label for="time">Event Time:</label>
        <input type="time" v-model="time" id="time" required />
      </div>

      <div class="form-group">
        <label for="location">Location:</label>
        <input type="text" v-model="location" id="location" required placeholder="Enter location" />
      </div>

      <div class="form-group">
        <label for="category">Category:</label>
        <select v-model="category" id="category" required>
          <option disabled value="">Please select a category</option>
          <option value="Music">Music</option>
          <option value="Nightlife">Nightlife</option>
          <option value="Art">Art</option>
          <option value="Hobbies">Hobbies</option>
          <option value="Food & Drink">Food & Drink</option>
        </select>
      </div>

      <div class="form-group">
        <label for="image">Event Image:</label>
        <input type="file" @change="onFileChange" id="image" />
      </div>

      <button type="submit" class="submit-button">Add Event</button>
    </form>

    <div v-if="showModal" class="modal-overlay" @click="hideModal">
      <div class="modal-content" @click.stop>
        <p>Event added successfully!</p>
        <button @click="hideModal">OK</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";

export default {
  setup() {
    const name = ref("");
    const date = ref("");
    const time = ref("");
    const location = ref("");
    const category = ref("");
    const showModal = ref(false);
    const imageFile = ref(null);

    // Get today's date in YYYY-MM-DD format for min attribute on date input
    const today = ref(new Date().toISOString().split("T")[0]);

    const onFileChange = (event) => {
      imageFile.value = event.target.files[0];
    };

    const addEvent = async () => {
      // Check if all fields are filled
      if (!name.value || !date.value || !time.value || !location.value || !category.value) {
        alert("Please fill out all fields before submitting.");
        return;
      }

      try {
        let imageUrl = null;

        // If an image file was selected, upload it
        if (imageFile.value) {
          const storageReference = storageRef(storage, `events/${imageFile.value.name}`);
          const snapshot = await uploadBytes(storageReference, imageFile.value);
          imageUrl = await getDownloadURL(snapshot.ref);
        }

        // Add event details to Firestore
        const eventsCollection = collection(db, "events");
        await addDoc(eventsCollection, {
          name: name.value,
          date: date.value,
          time: time.value,
          location: location.value,
          category: category.value,
          imageUrl: imageUrl,
        });

        // Clear form fields
        name.value = "";
        date.value = "";
        time.value = "";
        location.value = "";
        category.value = "";
        imageFile.value = null;

        // Show success modal
        showModal.value = true;
      } catch (error) {
        console.error("Error adding event: ", error);
      }
    };

    const hideModal = () => {
      showModal.value = false;
    };

    return {
      name,
      date,
      time,
      location,
      category,
      showModal,
      addEvent,
      hideModal,
      onFileChange,
      today,
    };
  },
};
</script>

<style scoped>
.add-event-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f9f9f9;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

h1 {
  text-align: center;
  font-size: 2rem;
  color: #333;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.2rem;
}

.form-group label {
  font-size: 1rem;
  color: #555;
  margin-bottom: 0.4rem;
}

.form-group input, 
.form-group select {
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  transition: border-color 0.2s ease;
}

.form-group input:focus, 
.form-group select:focus {
  border-color: #007bff;
}

.submit-button {
  background-color: #007bff;
  color: white;
  padding: 0.75rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  text-align: center;
}

.submit-button:hover {
  background-color: #0056b3;
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
  text-align: center;
}

.modal-content p {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}

.modal-content button {
  background-color: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.modal-content button:hover {
  background-color: #0056b3;
}
</style>
