<template>
  <div class="app">

    <div class="header">
      <div class="tab active">For You</div>
      <div class="tab">Following</div>
    </div>

    <div v-if="loading" class="loading-state">Memuat feeds... ⏳</div>
    <div v-else-if="!videos.length" class="loading-state">Belum ada video diunggah.</div>

    <div v-else class="feed">
      <div
        v-for="(v) in videos"
        :key="v.id"
        class="video-wrapper"
      >
        <video
          :src="v.blobUrl"
          class="video-player"
          autoplay
          muted
          loop
          playsinline
        ></video>

        <div class="caption">
          <p class="username">@{{ v.uploaderId }}</p>
          <p class="desc">{{ v.caption }}</p>
          <p class="likes-count">❤️ {{ v.likes }}</p>
        </div>
      </div>
    </div>

    <div class="bottom-nav">
      <div class="item">Home</div>
      <div class="item">Discover</div>
      <div class="item">Profile</div>
    </div>

  </div>
</template>

<script lang="ts">
import axios from "axios";
import { defineComponent } from "vue";

// Ganti ini dengan data Azure Function Anda
const API_BASE = "https://feedstick-service-func123.azurewebsites.net/api";
const API_KEY = "EUKUzAPKrmwP_OA4VxZG3CiVs_TCpqY-_RfIFbIX81jdAzFu0vWVLQ==";

export default defineComponent({
  data() {
    return {
      videos: [] as any[],
      loading: true,
    };
  },

  async mounted() {
    try {
      const res = await axios.get(`${API_BASE}/videos?code=${API_KEY}`);
      
      // Menghapus 'const list = res.data.videos;' yang tidak terpakai
      this.videos = res.data.videos;

    } catch (err) {
      console.error("Gagal fetch videos:", err);
    } finally {
      this.loading = false;
    }
  }
});
</script>

<style>
/* --- APP CONTAINER & LAYOUT (Dibersihkan dari duplikasi .app) --- */
.app {
  height: 100vh;
  overflow: hidden;
  background: black;
  color: white;
  font-family: sans-serif;
  position: relative;
  
  /* Batasan Lebar Layar HP */
  width: 100%;
  max-width: 450px; 
  margin: 0 auto; 
}

/* HEADER */
.header {
  position: fixed;
  top: 0;
  width: 100%;
  height: 55px;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  gap: 40px;
  align-items: flex-end;
  padding-bottom: 10px;
  z-index: 20;
}

.header .tab {
  opacity: 0.5;
  font-size: 16px;
}

.header .active {
  opacity: 1;
  font-weight: bold;
}

/* FEED CONTAINER */
.feed {
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  margin-top: -55px; /* Menggeser konten ke atas di bawah header */
  padding-top: 55px;
}

/* VIDEO WRAPPER (Dibersihkan dari duplikasi) */
.video-wrapper {
  position: relative;
  height: 100vh;
  width: 100%;
  scroll-snap-align: start;
  background: black; /* Latar belakang hitam untuk blankspace */
}

/* VIDEO PLAYER (Dibersihkan dari duplikasi object-fit) */
.video-player {
  height: 100%;
  width: 100%;
  object-fit: contain; /* Memastikan video terlihat penuh, menyisakan blankspace hitam */
}

/* CAPTION */
.caption {
  position: absolute;
  bottom: 80px;
  left: 20px;
  z-index: 10;
}

.caption .username {
  font-weight: bold;
}

.caption .desc {
  margin-top: 5px;
  font-size: 14px;
  opacity: 0.85;
  max-width: 250px;
}

.caption .likes-count {
  font-weight: bold;
  margin-top: 5px;
}

/* BOTTOM NAV */
.bottom-nav {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 60px;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 20;
}

.bottom-nav .item {
  text-align: center;
  font-size: 14px;
}

/* Wajib: LOADING STATE */
.loading-state {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 18px;
    z-index: 30;
}
</style>
