<template>
  <div class="auth-container">
    <h2>Daftar Akun Baru</h2>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label>Username:</label>
        <input type="text" v-model="username" required />
      </div>
      <div class="form-group">
        <label>Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label>Password:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">Daftar</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p>Sudah punya akun? <router-link to="/login">Login disini</router-link></p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios'; // HAPUS 'AxiosError' dari sini biar tidak error "unused"

// Kita buat cetakan tipe data untuk respon error dari Azure Function kita
interface ErrorResponse {
  error: string;
}

export default defineComponent({
  data() {
    return {
      username: '',
      email: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async handleRegister() {
      try {
        await axios.post('http://localhost:7071/api/register', {
          username: this.username,
          email: this.email,
          password: this.password
        });

        alert("Registrasi Berhasil! Silakan Login.");
        this.$router.push('/login');
      } catch (error: unknown) {
        console.error(error);

        // Cek apakah ini error dari Axios
        if (axios.isAxiosError(error) && error.response) {
            // DISINI KUNCINYA:
            // Kita paksa TypeScript menganggap data ini bentuknya 'ErrorResponse'
            // bukan 'any'. Linter akan senang.
            const data = error.response.data as ErrorResponse;

            this.errorMessage = data.error || "Gagal mendaftar.";
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
button { width: 100%; padding: 10px; background-color: #28a745; color: white; border: none; cursor: pointer; }
.error { color: red; margin-top: 10px; }
</style>
