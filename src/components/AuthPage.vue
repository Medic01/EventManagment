<!-- src/components/AuthPage.vue -->
<template>
  <div class="auth-container">
    <h1>Dobrodošli u Event Manager</h1>
    <div class="auth-options">
      <button @click="goToLogin">Login</button>
      <button @click="goToRegister">Register</button>
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
.auth-container {
  text-align: center;
  padding: 2rem;
}

.auth-options button {
  margin: 1rem;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  cursor: pointer;
}
</style>
