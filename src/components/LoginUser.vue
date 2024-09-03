<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email" id="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" id="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router"; // Importuj useRouter iz vue-router
import { auth, signInWithEmailAndPassword } from "../firebase";

export default {
  setup() {
    const email = ref("");
    const password = ref("");
    const errorMessage = ref("");
    const router = useRouter(); // Inicijalizuj router

    const login = async () => {
      try {
        await signInWithEmailAndPassword(auth, email.value, password.value);

        // Preusmeri korisnika na HomePage nakon uspešne prijave
        router.push("/home");
      } catch (error) {
        errorMessage.value = error.message;
      }
    };

    return {
      email,
      password,
      errorMessage,
      login,
    };
  },
};
</script>

<style scoped>
/* Dodaj stilove po želji */
</style>
