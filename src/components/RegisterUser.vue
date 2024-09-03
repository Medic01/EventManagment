<template>
  <div>
    <!-- Your registration form here -->
    <form @submit.prevent="register">
      <input v-model="userData.name" placeholder="Name" required />
      <input v-model="userData.surname" placeholder="Surname" required />
      <input v-model="userData.city" placeholder="City" required />
      <input v-model="userData.address" placeholder="Address" required />

      <!-- Date Picker for Date of Birth -->
      <input v-model="userData.dateOfBirth" type="date" required />

      <!-- Dropdown for Gender -->
      <select v-model="userData.gender" required>
        <option value="" disabled selected>Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>

      <input
        v-model="userData.email"
        placeholder="Email"
        type="email"
        required
      />
      <input
        v-model="userData.password"
        placeholder="Password"
        type="password"
        required
      />
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router"; // Import Vue Router
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default {
  setup() {
    const router = useRouter(); // Use Vue Router
    const userData = ref({
      name: "",
      surname: "",
      city: "",
      address: "",
      gender: "",
      dateOfBirth: "",
      email: "",
      password: "",
    });

    const register = async () => {
      try {
        // Register user with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          userData.value.email,
          userData.value.password
        );

        // Get the newly created user
        const user = userCredential.user;

        // Create a Firestore document for the user
        await setDoc(doc(db, "users", user.uid), {
          name: userData.value.name,
          surname: userData.value.surname,
          city: userData.value.city,
          address: userData.value.address,
          gender: userData.value.gender,
          dateOfBirth: userData.value.dateOfBirth,
          email: userData.value.email,
          role: "USER", // Default role
        });

        console.log("User registered and data saved to Firestore");

        // Redirect to the home page after successful registration
        router.push("/home");
      } catch (error) {
        console.error("Error registering user:", error);
      }
    };

    return {
      userData,
      register,
    };
  },
};
</script>
