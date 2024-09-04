<template>
  <div class="registration-container">
    <form @submit.prevent="register" class="registration-form">
      <h2>Register</h2>

      <input v-model="userData.name" placeholder="Name" required />
      <input v-model="userData.surname" placeholder="Surname" required />
      <input v-model="userData.city" placeholder="City" required />
      <input v-model="userData.address" placeholder="Address" required />

      <!-- Date Picker for Date of Birth -->
      <input
        v-model="userData.dateOfBirth"
        type="date"
        class="date-picker"
        required
      />

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
      <button type="submit" class="register-button">Register</button>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default {
  setup() {
    const router = useRouter();
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
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          userData.value.email,
          userData.value.password
        );
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
          name: userData.value.name,
          surname: userData.value.surname,
          city: userData.value.city,
          address: userData.value.address,
          gender: userData.value.gender,
          dateOfBirth: userData.value.dateOfBirth,
          email: userData.value.email,
          role: "USER",
        });
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

<style scoped>
/* Background styling */
.registration-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url("https://photos.smugmug.com/AI-wallpapers/i-K558g47/0/48c88f8b/XL/HDRshooter-AI-generated-wallpaper-3840x2160-015-XL.jpg"); /* Replace with your direct image URL */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.registration-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Overlay for readability */
}

/* Form styling */
.registration-form {
  position: relative;
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
  z-index: 1;
}

.registration-form h2 {
  margin-bottom: 20px;
  font-size: 1.8rem;
  color: #333;
}

/* Input and select styling */
.registration-form input,
.registration-form select {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ddd;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.registration-form input:focus,
.registration-form select:focus {
  border-color: #007bff;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.4);
}

/* Date picker styling */
.date-picker {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

/* Button styling */
.register-button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.register-button:hover {
  background-color: #0056b3;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
