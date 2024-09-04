<template>
  <div class="login-container" :style="backgroundImageStyle">
    <div class="login-form">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div class="input-group">
          <label for="email">Email:</label>
          <input
            type="email"
            v-model="email"
            id="email"
            required
            class="input-field"
          />
        </div>
        <div class="input-group">
          <label for="password">Password:</label>
          <input
            type="password"
            v-model="password"
            id="password"
            required
            class="input-field"
          />
        </div>
        <button type="submit" class="login-button">Login</button>
      </form>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </div>
</template>
<script>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { auth, signInWithEmailAndPassword } from "../firebase";

export default {
  setup() {
    const email = ref("");
    const password = ref("");
    const errorMessage = ref("");
    const router = useRouter();

    const backgroundImageStyle = computed(() => ({
      backgroundImage:
        "url(https://img.freepik.com/free-photo/majestic-mountain-peak-tranquil-winter-landscape-generated-by-ai_188544-15662.jpg)", // Replace with a direct image URL
      backgroundSize: "cover", // Optional: cover the entire background
      backgroundPosition: "center", // Optional: center the image
    }));

    const login = async () => {
      try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        router.push("/home");
      } catch (error) {
        errorMessage.value = "Incorrect email or password. Please try again.";
      }
    };

    return {
      email,
      password,
      errorMessage,
      login,
      backgroundImageStyle,
    };
  },
};
</script>
<style scoped>
/* General Styles */
body {
  font-family: "Arial", sans-serif;
  margin: 0;
  padding: 0;
}

/* Container with a background image */
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-size: cover;
  background-position: center;
  padding: 20px;
}

/* Form styling */
.login-form {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

/* Heading styling */
.login-form h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

/* Input group styling */
.input-group {
  margin-bottom: 20px;
  text-align: left;
}

/* Label styling */
.input-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #666;
}

/* Input field styling */
.input-field {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  transition: border-color 0.3s, box-shadow 0.3s;
}

/* Input field focus styling */
.input-field:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

/* Button styling */
.login-button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

/* Button hover effect */
.login-button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

/* Error message styling */
.error-message {
  margin-top: 20px;
  color: #d9534f;
  font-size: 14px;
}
</style>
