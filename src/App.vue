<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav class="navbar">
      <div class="brand">MyVideoApp</div>
      <div class="menu">
        <RouterLink to="/">Galeri Video</RouterLink>
        <RouterLink to="/upload">Upload Video</RouterLink>
      </div>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style>
/* PENTING: Reset margin browser agar tidak ada celah di atas */
body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  background-color: #181818; /* Warna background gelap seperti di gambar */
  color: #ffffff; /* Warna teks putih */
}

/* Styling Navbar */
.navbar {
  background-color: #202020; /* Warna navbar sedikit lebih terang dari background */
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #333; /* Garis pemisah tipis di bawah navbar */
}

.brand {
  font-weight: bold;
  font-size: 1.2rem;
  color: #ffffff;
}

.menu a {
  color: #aaaaaa; /* Warna link tidak aktif */
  text-decoration: none;
  margin-left: 20px;
  font-weight: 500;
  transition: color 0.3s;
}

.menu a:hover {
  color: #ffffff; /* Warna saat di-hover */
}

/* Class otomatis dari Vue Router untuk link yang sedang aktif */
.menu a.router-link-active {
  color: #42b883; /* Warna hijau Vue */
}

/* Styling Konten Utama */
main {
  padding: 20px;
}
</style>
