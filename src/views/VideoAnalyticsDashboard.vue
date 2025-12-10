<template>
  <div class="trending-container">

    <div class="trending-header">
        <h1>Tranding</h1>

    </div>

    <div v-if="loading" class="loading-state">Memuat Video... ⏳</div>

    <div v-else class="content-area">
        <div v-if="displayedVideos.length" class="video-grid">
            <div
                v-for="(v, index) in displayedVideos"
                :key="v.id"
                class="video-thumbnail"
                @click="goToDetail(v.id)"
            >
                <div class="ranking-badge">#{{ index + 1 }}</div>

                <div class="thumb-color" :style="{ backgroundColor: getHashColor(v.id) }">
                   <span class="play-icon">▶️</span>
                </div>

                <div class="thumbnail-overlay">
                    <span class="likes-count">❤️ {{ formatNumber(v.likes) }}</span>
                </div>
            </div>
        </div>

        <div v-else class="empty-state">
            <p>Belum ada video trending yang tersedia.</p>
        </div>
    </div>

    <div class="bottom-nav">
        <div class="item active" @click="$router.push('/')">
            <span class="icon">🏠</span>
            <span class="label">Home</span>
        </div>
        <div class="item upload-container" @click="$router.push('/upload')">
            <div class="upload-btn"><span>➕</span></div>
        </div>
        <div class="item" @click="$router.push('/profile')">
            <span class="icon">👤</span>
            <span class="label">Profile</span>
        </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";

// Config URL (Tetap sama)
const FEED_SERVICE_URL = "https://feedstick-service-func123.azurewebsites.net/api";
const API_KEY = "EUKUzAPKrmwP_OA4VxZG3CiVs_TCpqY-_RfIFbIX81jdAzFu0vWVLQ==";

export default defineComponent({
  name: "TrendingView", // Nama diubah
  data() {
    return {
      allVideos: [] as any[],
      loading: true,
      currentUsername: localStorage.getItem('username') || '',
    };
  },
  computed: {
    // Hanya ambil 10 video pertama (simulasi trending feed)
    displayedVideos(): any[] {
        // Asumsi data dari API sudah diurutkan berdasarkan views/likes (trending)
        // Kita gunakan slice untuk membatasi 10 item pertama
        return this.allVideos.slice(0, 10);
    }
  },
  methods: {
    formatNumber(num: number) {
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
      if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
      return num;
    },
    goToDetail(id: string) {
        this.$router.push(`/video/${id}`);
    },
    getHashColor(str: string) {
        // Fungsi untuk menghasilkan warna unik (tetap dipertahankan)
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
        return '#' + "00000".substring(0, 6 - c.length) + c;
    },
    async fetchData() {
        this.loading = true;
        try {
            // Dalam aplikasi nyata, endpoint bisa '/api/trending'
            const res = await axios.get(`${FEED_SERVICE_URL}/videos?code=${API_KEY}`);

            // DUMMY SORTING: Sortir berdasarkan Likes untuk simulasi Trending
            const sortedVideos = res.data.videos.sort((a: any, b: any) => (b.likes || 0) - (a.likes || 0));
            this.allVideos = sortedVideos;

        } catch (e) {
            console.error("Gagal ambil data trending:", e);
        } finally {
            this.loading = false;
        }
    }
  },
  mounted() {
    this.fetchData();
  }
});
</script>

<style scoped>
/* CSS Disesuaikan untuk Tampilan Trending yang lebih bersih */

.trending-container {
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

.trending-header {
    background: #000;
    padding: 10px 0;
    text-align: center;
    border-bottom: 1px solid #333;
}

.trending-header h1 {
    font-size: 24px;
    margin: 0;
}

.trending-alert {
    background-color: #ff0050; /* Warna Khas Trending/Peringatan */
    color: white;
    padding: 5px 10px;
    margin: 10px auto;
    width: 90%;
    border-radius: 5px;
    font-size: 14px;
    font-weight: bold;
}

.content-area {
    height: calc(100vh - 140px); /* Menyesuaikan tinggi agar Bottom Nav tidak tertimpa */
    overflow-y: auto;
    padding: 2px;
}

.video-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* Diubah ke 2 kolom agar thumbnail lebih besar */
    gap: 3px;
}

.video-thumbnail {
    aspect-ratio: 9/16; /* Rasio potret (TikTok/Reels) */
    position: relative;
    cursor: pointer;
    background: #222;
    overflow: hidden;
}

.thumb-color {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.9;
}

.play-icon { font-size: 24px; opacity: 0.7; }

.thumbnail-overlay {
    position: absolute;
    bottom: 5px;
    left: 8px;
    font-size: 14px;
    font-weight: bold;
    text-shadow: 1px 1px 3px black;
}
.likes-count {
    background: rgba(0, 0, 0, 0.4);
    padding: 2px 6px;
    border-radius: 5px;
}

.ranking-badge {
    position: absolute;
    top: 5px;
    left: 5px;
    background: #00f2ea; /* Warna sekunder TikTok (Cyan) */
    color: black;
    padding: 3px 8px;
    border-radius: 5px;
    font-weight: bold;
    z-index: 5;
    font-size: 12px;
}

/* Navigasi Bawah (Tidak Berubah) */
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
    cursor: pointer;
    color: #666;
    width: 50px;
}
.bottom-nav .item.active { color: white; }
.upload-btn {
    width: 45px; height: 30px;
    background: linear-gradient(90deg, #00f2ea, #ff0050);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
}
.loading-state, .empty-state {
    text-align: center;
    padding: 40px;
    color: #777;
}
</style>
