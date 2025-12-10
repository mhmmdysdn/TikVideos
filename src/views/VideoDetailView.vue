<template>
  <div class="detail-page">

    <button class="back-btn" @click="$router.go(-1)">⬅ Kembali</button>

    <div v-if="loading" class="loading-state">Mengambil video... ⏳</div>
    <div v-else-if="!video" class="loading-state">Video tidak ditemukan ❌</div>

    <div v-else class="video-container">
      <video
        :src="video.videoSrc"
        controls autoplay loop
        class="main-video"
      ></video>

      <div class="info-box">
        <h3>@{{ video.username || video.uploaderId }}</h3>
        <p class="caption">{{ video.caption || 'Tanpa caption' }}</p>
        <div class="stats">
          <span>❤️ {{ video.likes }} Suka</span>
          <span class="date">📅 {{ formatDate(video.uploadTime) }}</span>
        </div>
      </div>

      <div v-if="isMyVideo" class="action-area">
        <button class="delete-btn" @click="confirmDelete">
          🗑️ Hapus Video
        </button>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

// URL Service (Pastikan sama dengan HomeView)
const FEED_SERVICE_URL = "https://feedstick-service-func123.azurewebsites.net/api";
const UPLOAD_SERVICE_URL = "https://uploadvid-service-func-123.azurewebsites.net/api";
const API_KEY = "EUKUzAPKrmwP_OA4VxZG3CiVs_TCpqY-_RfIFbIX81jdAzFu0vWVLQ==";

export default defineComponent({
  name: "VideoDetailView",
  data() {
    return {
      video: null as any,
      loading: true,
      currentUser: localStorage.getItem('username') || ''
    };
  },
  computed: {
    isMyVideo() {
      if (!this.video || !this.currentUser) return false;
      // Cek apakah username video sama dengan user yang login
      const owner = this.video.username || this.video.uploaderId;
      return owner === this.currentUser;
    }
  },
  methods: {
    formatDate(isoString: string) {
      if (!isoString) return '';
      return new Date(isoString).toLocaleDateString();
    },

    async fetchVideoDetail(id: string) {
      this.loading = true;
      try {
        // Karena API get_video hanya return stream, kita ambil list lalu filter
        // (Solusi sementara sampai ada API get_metadata_by_id)
        const res = await axios.get(`${FEED_SERVICE_URL}/videos?code=${API_KEY}`);
        const allVideos = res.data.videos;

        const found = allVideos.find((v: any) => v.id === id);

        if (found) {
          this.video = {
            ...found,
            videoSrc: `${FEED_SERVICE_URL}/video/${found.fileName}?code=${API_KEY}`
          };
        }
      } catch (e) {
        console.error("Gagal load video", e);
      } finally {
        this.loading = false;
      }
    },

    confirmDelete() {
      if (confirm("Apakah Anda yakin ingin menghapus video ini secara permanen?")) {
        this.deleteVideo();
      }
    },

    async deleteVideo() {
      try {
        await axios.post(`${UPLOAD_SERVICE_URL}/deleteVideo?code=${API_KEY}`, {
          videoId: this.video.id
        }, {
          headers: {
            'x-user-id': this.currentUser // Header wajib untuk verifikasi di backend
          }
        });

        alert("Video berhasil dihapus! ✅");
        this.$router.push('/profile'); // Kembali ke profil
      } catch (error: any) {
        console.error(error);
        alert("Gagal menghapus video: " + (error.response?.data?.error || "Kesalahan server"));
      }
    }
  },
  mounted() {
    const route = useRoute();
    const videoId = route.params.id as string;
    this.fetchVideoDetail(videoId);
  }
});
</script>

<style scoped>
.detail-page {
  background: black;
  color: white;
  min-height: 100vh;
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
  position: relative;
  font-family: sans-serif;
}

.back-btn {
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 100;
  background: rgba(0,0,0,0.6);
  color: white;
  border: 1px solid #555;
  padding: 8px 12px;
  border-radius: 20px;
  cursor: pointer;
}

.loading-state {
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
}

.video-container {
  padding-top: 60px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.main-video {
  width: 100%;
  max-height: 60vh;
  background: #111;
}

.info-box {
  padding: 0 20px;
}

.info-box h3 {
  margin: 0 0 10px;
  color: #fff;
}

.caption {
  font-size: 16px;
  color: #ccc;
  line-height: 1.5;
}

.stats {
  margin-top: 15px;
  font-size: 14px;
  color: #777;
  display: flex;
  gap: 15px;
}

.action-area {
  padding: 20px;
  display: flex;
  justify-content: center;
  margin-top: auto;
}

.delete-btn {
  background-color: #ff3b30;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
}

.delete-btn:hover {
  background-color: #d63026;
}
</style>
