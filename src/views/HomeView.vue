<template>
  <div class="app">

    <button class="logout-btn" @click="handleLogout">
      Logout 🚪
    </button>

    <div v-if="loading" class="loading-state">Memuat feeds... ⏳</div>
    <div v-else-if="!videos.length" class="loading-state">Belum ada video diunggah.</div>

    <div v-else class="feed">
      <div v-for="(v) in videos" :key="v.id" class="video-wrapper">
        <video
          :src="v.videoSrc"
          class="video-player"
          autoplay muted loop playsinline
        ></video>

        <div class="caption">
          <p class="username">@{{ v.username || v.uploaderId }}</p>
          <p class="desc">{{ v.caption || 'Tidak ada caption' }}</p>

          <div
            class="like-btn"
            @click="handleLike(v)"
            :class="{ 'is-liked': v.likedByMe }"
          >
            <span class="heart-icon">❤️</span>
            <span class="count">{{ v.likes }}</span>
          </div>
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

// --- KONFIGURASI URL (PENTING!) ---

// 1. Service untuk MENGAMBIL Video (Feedstick)
const FEED_SERVICE_URL = "https://feedstick-service-func123.azurewebsites.net/api";

// 2. Service untuk LIKE Video (Uploadvid - karena tadi kita taruh fungsi Like di sini)
const UPLOAD_SERVICE_URL = "https://uploadvid-service-func-123.azurewebsites.net/api";

// API Key (Jika Feedstick pakai Auth Level Function, ganti key ini dengan key Feedstick)
const API_KEY = "EUKUzAPKrmwP_OA4VxZG3CiVs_TCpqY-_RfIFbIX81jdAzFu0vWVLQ==";

export default defineComponent({
  name: "HomeView",
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

    refreshHome() {
      window.location.reload();
    },

    async handleLike(video: any) {
      const myUserId = localStorage.getItem('username');
      if (!myUserId) {
        alert("Silakan login terlebih dahulu!");
        this.$router.push('/login');
        return;
      }

      // Optimistic Update
      const originalLikes = video.likes;
      const wasLiked = video.likedByMe;

      if (video.likedByMe) {
        video.likes--;
        video.likedByMe = false;
      } else {
        video.likes++;
        video.likedByMe = true;
      }

      try {
        // PERHATIKAN: Like dikirim ke UPLOAD_SERVICE_URL
        await axios.post(`${UPLOAD_SERVICE_URL}/likeVideo?code=${API_KEY}`, {
          videoId: video.id,
          userId: myUserId
        });
      } catch (error) {
        console.error("Gagal like:", error);
        video.likes = originalLikes;
        video.likedByMe = wasLiked;
        alert("Gagal melakukan like.");
      }
    }
  },

  async mounted() {
    const myUserId = localStorage.getItem('username');

    try {
      // PERHATIKAN: Fetch data dari FEED_SERVICE_URL
      const res = await axios.get(`${FEED_SERVICE_URL}/videos?code=${API_KEY}`);
      const metadataList = res.data.videos;

      this.videos = metadataList.map((v: any) => ({
          ...v,
          // Video source juga dari Feedstick
          videoSrc: `${FEED_SERVICE_URL}/video/${v.fileName}?code=${API_KEY}`,
          likedByMe: v.likedBy && myUserId ? v.likedBy.includes(myUserId) : false
      }));

    } catch (err) {
      console.error("Gagal fetch videos:", err);
    } finally {
      this.loading = false;
    }
  }
});
</script>

<style scoped>
/* APP CONTAINER */
.app {
  background: black;
  color: white;
  height: 100vh;
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  font-family: sans-serif;
}

/* LOGOUT BUTTON */
.logout-btn {
  position: fixed;
  top: 15px;
  right: 15px;
  z-index: 999;
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 15px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.5);
}

/* FEED & VIDEO */
.feed {
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
}

.video-wrapper {
  position: relative;
  height: 100vh;
  width: 100%;
  scroll-snap-align: start;
  background: black;
}

.video-player {
  height: 100%;
  width: 100%;
  object-fit: contain;
}

/* CAPTION AREA */
.caption {
  position: absolute;
  bottom: 80px;
  left: 20px;
  right: 60px;
  z-index: 10;
  text-align: left;
}

.caption .username {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 5px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
}

.caption .desc {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 10px;
  line-height: 1.4;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
}

/* LIKE BUTTON */
.like-btn {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  margin-top: 10px;
  transition: transform 0.1s;
}

.like-btn:active {
  transform: scale(0.85);
}

.heart-icon {
  font-size: 28px;
  filter: grayscale(100%) brightness(150%);
  transition: all 0.3s;
}

.count {
  font-size: 12px;
  font-weight: bold;
  margin-top: 2px;
  text-shadow: 1px 1px 2px black;
}

.like-btn.is-liked .heart-icon {
  filter: grayscale(0%);
  text-shadow: 0 0 15px rgba(255, 0, 0, 0.8);
  transform: scale(1.1);
}

/* NAVIGASI BAWAH */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 450px;
  height: 60px;
  background: #000;
  border-top: 1px solid #333;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 100;
}

.bottom-nav .item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  width: 50px;
}

.bottom-nav .item.active {
  color: #fff;
}

.upload-container {
  transform: translateY(-5px);
}
.upload-btn {
  width: 45px;
  height: 30px;
  background: linear-gradient(90deg, #00f2ea, #ff0050);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}
.upload-btn span {
  color: black;
  font-weight: 900;
  font-size: 18px;
  line-height: 1;
}

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
