<!-- src/components/AuthPage.vue -->
<template>
  <div class="auth-container">
    <header>
      <div class="header-content">
        <h1>Find anything you want</h1>
        <p>Music, Art, Food & Drink, Hobbies, Nightlife</p>
      </div>
    </header>
    <div class="background-overlay">
      <h1>Dobrodošli u Event Manager</h1>
      <div class="auth-options">
        <button @click="goToLogin">Login</button>
        <button @click="goToRegister">Register</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AuthPage",
  methods: {
    goToLogin() {
      this.$router.push("/login");
    },
    goToRegister() {
      this.$router.push("/register");
    },
  },
};
</script>

<style scoped>
/* Header styles */
header {
  background-color: #222;
  color: #fff;
  padding: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
}

.header-content h1 {
  font-size: 2.5rem;
  margin: 0;
  font-weight: bold;
}

.header-content p {
  font-size: 1.5rem;
  margin: 0.5rem 0 0;
  font-style: italic;
  color: #ddd;
}

header:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #ff4b2b, #ff416c);
  z-index: -1;
  opacity: 0.85;
  clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
}

/* AuthPage styles */
.auth-container {
  position: relative;
  height: calc(100vh - 80px); /* Adjust to account for header height */
  background: url("https://i.natgeofe.com/n/78f154a9-4c13-47e4-b7c7-8c116334fbeb/33990_4x3.jpg") no-repeat center center fixed;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000; /* F
.auth-container {
  position: relative;
  height: calc(100vh - 80px); /* Adjust to account for header height */
  background: url("https://i.natgeofe.com/n/78f154a9-4c13-47e4-b7c7-8c116334fbeb/33990_4x3.jpg") no-repeat center center fixed;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000; /* Fallback color in case the image doesn't load */
}

.background-overlay {
  text-align: center;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent overlay for text readability */
  border-radius: 10px;
  z-index: 2;
}

h1 {
  color: #fff;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  font-family: "Arial", sans-serif;
}

.auth-options button {
  margin: 1rem;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  transition: background-color 0.3s;
}

.auth-options button:hover {
  background-color: #0056b3;
}

.auth-options button:focus {
  outline: none;
}
</style>