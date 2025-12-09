<template>
  <div class="auth-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label>Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label>Password:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">Masuk</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p>Belum punya akun? <router-link to="/register">Daftar disini</router-link></p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios'; // Hapus AxiosError

// Definisi tipe data error
interface ErrorResponse {
  error: string;
}

// Definisi tipe data sukses login (biar rapi sekalian)
interface LoginResponse {
  message: string;
  user_id: string;
  username: string;
}

export default defineComponent({
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async handleLogin() {
      try {
        // Kita beritahu axios bahwa balikan datanya berbentuk LoginResponse
        const response = await axios.post<LoginResponse>('http://localhost:7071/api/login', {
          email: this.email,
          password: this.password
        });

        const userData = response.data;

        // Karena sudah di-define tipenya, TypeScript tidak akan protes
        localStorage.setItem('user_id', userData.user_id);

        if(userData.username) {
            localStorage.setItem('username', userData.username);
        }

        alert("Login Berhasil!");
        this.$router.push('/');
      } catch (error: unknown) {
        console.error(error);

        if (axios.isAxiosError(error) && error.response) {
             // Pakai casting ke Interface, JANGAN ke 'any'
             const data = error.response.data as ErrorResponse;
             this.errorMessage = data.error || "Email atau password salah.";
        } else {
             this.errorMessage = "Terjadi kesalahan jaringan.";
        }
      }
    }
  }
});
</script>

<style scoped>
.auth-container { max-width: 300px; margin: 50px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
.form-group { margin-bottom: 15px; }
label { display: block; margin-bottom: 5px; }
input { width: 100%; padding: 8px; box-sizing: border-box; }
button { width: 100%; padding: 10px; background-color: #007bff; color: white; border: none; cursor: pointer; }
.error { color: red; margin-top: 10px; }
</style>
