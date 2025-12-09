<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <main>
    <RouterView />
  </main>
</template>

<style>
/* Reset Global */
body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  background-color: #000; /* Hitam pekat agar menyatu dengan HomeView */
  color: #ffffff;
  overflow: hidden; /* Mencegah scroll ganda di body utama */
}

/* Pastikan main container mengambil seluruh layar */
main {
  width: 100vw;
  height: 100vh;
  /* Hapus padding agar tampilan mobile full screen */
  padding: 0;
}
</style>
