<template>
  <div class="app">

    <div class="header">
      <div class="tab active">For You</div>
      <div class="tab">Following</div>
    </div>
    <button class="logout-btn" @click="handleLogout">
      Logout 🚪
    </button>

    <div v-if="loading" class="loading-state">Memuat feeds... ⏳</div>
    <div v-else-if="!videos.length" class="loading-state">Belum ada video diunggah.</div>

    <div v-else class="feed">
      <div
        v-for="(v) in videos"
        :key="v.id"
        class="video-wrapper"
      >
        <video
          :src="v.videoSrc"
          class="video-player"
          autoplay
          muted
          loop
          playsinline
        ></video>

        <div class="caption">
          <p class="username">@{{ v.username || v.uploaderId }}</p>
          <p class="desc">{{ v.caption }}</p>
          <p class="likes-count">❤️ {{ v.likes }}</p>
        </div>
      </div>
    </div>

    <div class="bottom-nav">

      <div class="item active" @click="refreshHome">
        <span class="icon">🏠</span>
        <span class="label">Home</span>
      </div>

      <div class="item upload-container" @click="$router.push('/upload')">
        <div class="upload-btn">
          <span>➕</span>
        </div>
      </div>

      <div class="item">
        <span class="icon">👤</span>
        <span class="label">Profile</span>
      </div>

    </div>

  </div>
</template>
<script lang="ts">
import axios from "axios";
import { defineComponent } from "vue";

const API_BASE = "https://feedstick-service-func123.azurewebsites.net/api";
const API_KEY = "EUKUzAPKrmwP_OA4VxZG3CiVs_TCpqY-_RfIFbIX81jdAzFu0vWVLQ==";

export default defineComponent({
  name: "HomeView", // Praktik yang baik: beri nama komponen
  data() {
    return {
      videos: [] as any[],
      loading: true,
    };
  },
  methods: {
    handleLogout() {
      localStorage.removeItem('user_id');
      localStorage.removeItem('username');
      alert("Anda telah logout.");
      this.$router.push('/login');
    },

    // --- PERBAIKAN DI SINI ---
    refreshHome() {
      // Kita gunakan window.location.reload() agar halaman benar-benar segar
      window.location.reload();
    }
  },
  async mounted() {
    try {
      const res = await axios.get(`${API_BASE}/videos?code=${API_KEY}`);
      const metadataList = res.data.videos;

      this.videos = metadataList.map((v: any) => ({
          ...v,
          videoSrc: `${API_BASE}/video/${v.fileName}?code=${API_KEY}`,
      }));

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

/* Style Khusus Tombol Logout Mengambang */
.logout-btn {
  position: fixed;        /* Mengunci posisi relatif terhadap layar browser */
  top: 15px;              /* Jarak dari atas layar */
  right: 15px;            /* Jarak dari kanan layar */
  z-index: 9999;          /* PENTING: Memastikan tombol selalu di atas elemen lain */

  background-color: #ff4d4d; /* Warna merah biar kelihatan jelas */
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 15px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.5);
  transition: transform 0.2s;
}

.logout-btn:hover {
  background-color: #cc0000;
  transform: scale(1.05);
}

/* Jika tampilan mobile, sesuaikan ukurannya */
@media (max-width: 600px) {
  .logout-btn {
    top: 10px;
    right: 10px;
    font-size: 12px;
    padding: 5px 10px;
  }
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

/* --- BOTTOM NAVIGATION --- */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 450px;
  height: 60px; /* Tinggi navbar standar */

  background: #000000; /* Hitam pekat */
  border-top: 1px solid #222; /* Garis pemisah halus */

  display: flex;
  justify-content: space-between; /* Jarak antar item merata */
  padding: 0 30px; /* Padding kiri kanan agar tidak mepet pinggir */
  align-items: center;
  box-sizing: border-box;
  z-index: 100;
}

/* Style Umum untuk Item (Home & Profile) */
.bottom-nav .item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666; /* Warna abu-abu saat tidak aktif */
  transition: all 0.2s ease;
  width: 50px; /* Area klik yang pas */
}

.bottom-nav .item .icon {
  font-size: 20px;
  margin-bottom: 2px;
}

.bottom-nav .item .label {
  font-size: 10px;
  font-weight: 500;
}

/* --- STATE ACTIVE (Untuk Home) --- */
.bottom-nav .item.active {
  color: #ffffff; /* Putih terang saat aktif */
}
.bottom-nav .item.active .icon {
  transform: scale(1.1); /* Sedikit membesar */
}

/* --- TOMBOL UPLOAD SPESIAL (Tengah) --- */
.upload-container {
  /* Mengambil ruang tapi tidak mengubah layout flex */
  transform: translateY(-5px); /* Sedikit naik ke atas */
}

.upload-btn {
  width: 45px;
  height: 30px;
  background: linear-gradient(90deg, #00f2ea, #ff0050); /* Efek warna 'Glitch' ala TikTok */
  border-radius: 8px; /* Kotak dengan sudut tumpul */
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white; /* Border putih agar kontras dengan background hitam */
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
  transition: transform 0.1s;
}

.upload-btn span {
  color: black; /* Ikon plus warna hitam agar jelas */
  font-weight: 900;
  font-size: 18px;
  line-height: 1;
}

.upload-container:active .upload-btn {
  transform: scale(0.95); /* Efek tekan saat diklik */
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
