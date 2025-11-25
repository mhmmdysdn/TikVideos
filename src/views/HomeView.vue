<template>
  <div class="container">
    <h1>Video Spesifik</h1>

    <div class="video-wrapper">
      <video width="640" height="360" controls>
        <source :src="videoUrl" type="video/mp4">
        Browser Anda tidak mendukung tag video.
      </video>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Panggil variabel dari .env
const videoUrl = ref(import.meta.env.VITE_VIDEO_URL);

</script>

<style scoped>
.container {
  padding: 20px;
  text-align: center; /* Agar video ada di tengah */
}

.video-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

video {
  border: 1px solid #444;
  border-radius: 8px;
  background-color: #000;
  max-width: 100%; /* Agar responsif di layar kecil */
}
</style>

<style scoped>
.container { padding: 20px; }
.video-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}
.video-card {
  border: 1px solid #ddd;
  padding: 5px;
  border-radius: 8px;
}
</style>
