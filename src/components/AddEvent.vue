<template>
  <div>
    <h1>Add Event</h1>
    <form @submit.prevent="addEvent">
      <div>
        <label for="name">Event Name:</label>
        <input type="text" v-model="name" id="name" required />
      </div>
      <div>
        <label for="date">Event Date:</label>
        <input type="date" v-model="date" id="date" required />
      </div>
      <button type="submit">Add Event</button>
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

    const addEvent = async () => {
      try {
        const eventsCollection = collection(db, "events");
        await addDoc(eventsCollection, {
          name: name.value,
          date: date.value,
        });
        name.value = "";
        date.value = "";
        alert("Event added successfully!");
      } catch (error) {
        console.error("Error adding event: ", error);
      }
    };

    return { name, date, addEvent };
  },
};
</script>

<style>
form {
  display: flex;
  flex-direction: column;
}
div {
  margin-bottom: 1rem;
}
label {
  margin-right: 1rem;
}
button {
  margin-top: 1rem;
}
</style>
