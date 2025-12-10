<template>
  <div class="profile-container">

    <div class="profile-header">
        <button class="logout-btn" @click="handleLogout">
          Logout 🚪
        </button>
        <div class="user-info">
            <div class="avatar">👤</div>
            <h2 class="username">@{{ currentUsername }}</h2>
            <p class="stats">
                <span>{{ uploadedVideos.length }} Uploads</span> |
                <span>{{ likedVideos.length }} Likes</span>
            </p>
        </div>

        <div class="profile-tabs">
            <div
                class="tab"
                :class="{ active: currentTab === 'uploads' }"
                @click="currentTab = 'uploads'"
            >
                Video Anda
            </div>
            <div
                class="tab"
                :class="{ active: currentTab === 'likes' }"
                @click="currentTab = 'likes'"
            >
                Disukai
            </div>
        </div>
    </div>

    <div v-if="loading" class="loading-state">Memuat data profil... ⏳</div>
    <div v-else class="content-area">

        <div v-if="displayedVideos.length" class="video-grid">
            <div
                v-for="(v) in displayedVideos"
                :key="v.id"
                class="video-thumbnail"
                @click="viewVideo(v.id)"
            >
                <img :src="getThumbnailUrl(v)" :alt="'Thumbnail ' + v.id" class="thumbnail-img"/>
                <div class="thumbnail-overlay">
                    <span>❤️ {{ v.likes }}</span>
                </div>
            </div>
        </div>

        <div v-else class="empty-state">
            Tidak ada konten di bagian ini.
        </div>
    </div>

    <div class="bottom-nav">
        <div class="item" @click="$router.push('/')">
            <span class="icon">🏠</span>
            <span class="label">Home</span>
        </div>
        <div class="item upload-container" @click="$router.push('/upload')">
            <div class="upload-btn">
                <span>➕</span>
            </div>
        </div>
        <div class="item active">
            <span class="icon">👤</span>
            <span class="label">Profile</span>
        </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// --- DATA DUMMY ---
const videosDummy = {
    uploads: [
        { id: 'u1', likes: 125, fileName: 'v1.mp4', category: 'nature' },
        { id: 'u2', likes: 450, fileName: 'v2.mp4', category: 'travel' },
        { id: 'u3', likes: 23, fileName: 'v3.mp4', category: 'food' },
        { id: 'u4', likes: 99, fileName: 'v4.mp4', category: 'music' },
        { id: 'u5', likes: 1200, fileName: 'v5.mp4', category: 'dance' },
        { id: 'u6', likes: 80, fileName: 'v6.mp4', category: 'nature' },
    ],
    likes: [
        { id: 'l1', likes: 500, fileName: 'l1.mp4', category: 'comedy' },
        { id: 'l2', likes: 15, fileName: 'l2.mp4', category: 'pets' },
        { id: 'l3', likes: 88, fileName: 'l3.mp4', category: 'vlog' },
        { id: 'l4', likes: 120, fileName: 'l4.mp4', category: 'travel' },
    ]
};

export default defineComponent({
  name: "ProfileView",
  data() {
    return {
      uploadedVideos: [] as any[],
      likedVideos: [] as any[],
      loading: true,
      currentTab: 'uploads' as 'uploads' | 'likes',
      currentUsername: localStorage.getItem('username') || 'Tamu_Dummy',
    };
  },

    computed: {
        displayedVideos(): any[] {
            return this.currentTab === 'uploads' ? this.uploadedVideos : this.likedVideos;
        }
    },

  methods: {
    handleLogout() {
      localStorage.removeItem('user_id');
      localStorage.removeItem('username');
      alert("Anda telah logout.");
      this.$router.push('/login');
    },

    getThumbnailUrl(video: any): string {
        // Menggunakan layanan placeholder image gratis
        // Warna latar belakang thumbnail diubah berdasarkan hash ID video
        const hash = video.id.charCodeAt(0) * 10;
        const color = hash % 0xFFFFFF;

        return `https://via.placeholder.com/150x200/${color.toString(16)}/FFFFFF?text=VID-${video.id}`;
    },

    viewVideo(videoId: string) {
        // Logika untuk navigasi ke detail video (gunakan Vue Router)
        alert(`Melihat detail video ID: ${videoId}`);
        // this.$router.push(`/video/${videoId}`);
    },

    loadDummyData() {
        this.loading = true;
        // Simulasi penundaan jaringan
        setTimeout(() => {
            this.uploadedVideos = videosDummy.uploads;
            this.likedVideos = videosDummy.likes;
            this.loading = false;
        }, 500);
    }
  },
  mounted() {
    this.loadDummyData();
  }
});
</script>

<style scoped>
/* GANTI .app menjadi .profile-container */
.profile-container {
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

/* HEADER PROFIL */
.profile-header {
    background: black;
    padding: 20px 0 0;
    text-align: center;
    position: sticky;
    top: 0;
    z-index: 50;
}

.user-info {
    margin-bottom: 20px;
}

.avatar {
    font-size: 50px;
    background: #444;
    border-radius: 50%;
    width: 80px;
    height: 80px;
    line-height: 80px;
    margin: 0 auto 10px;
    border: 3px solid #666;
}

.username {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 5px;
}

.stats span {
    color: #aaa;
    font-size: 14px;
}

/* TAB NAVIGASI */
.profile-tabs {
    display: flex;
    justify-content: space-around;
    border-top: 1px solid #222;
    border-bottom: 1px solid #222;
    background: #111;
}

.profile-tabs .tab {
    padding: 10px 0;
    flex-grow: 1;
    cursor: pointer;
    font-weight: 500;
    color: #888;
    position: relative;
    transition: color 0.2s;
}

.profile-tabs .tab.active {
    color: white;
}

.profile-tabs .tab.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 10%;
    width: 80%;
    height: 3px;
    background-color: white;
}

/* KONTEN UTAMA & GRID */
.content-area {
    /* Tinggi konten = Total viewport - Tinggi Nav Bawah (60px) - Tinggi Header Profil (~160px) */
    height: calc(100vh - 60px - 160px);
    overflow-y: scroll;
    background: #111;
    padding-bottom: 10px;
}

.video-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
}

.video-thumbnail {
    aspect-ratio: 3 / 4;
    position: relative;
    overflow: hidden;
    background: #222;
    cursor: pointer;
}

.thumbnail-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.thumbnail-overlay {
    position: absolute;
    bottom: 5px;
    right: 5px;
    background: rgba(0, 0, 0, 0.5);
    padding: 2px 5px;
    border-radius: 5px;
    font-size: 12px;
    font-weight: bold;
}

.empty-state {
    text-align: center;
    padding: 50px 20px;
    color: #666;
}

/* LOGOUT BUTTON */
.logout-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    z-index: 60;
    background-color: #ff4d4d;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 8px 15px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0,0,0,0.5);
}

/* BOTTOM NAV */
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
