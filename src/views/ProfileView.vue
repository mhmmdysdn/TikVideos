<template>
  <div class="profile-container">

    <div class="profile-header">
        <button class="logout-btn" @click="handleLogout">Logout 🚪</button>

        <div class="user-info">
            <div class="avatar">👤</div>
            <h2 class="username">@{{ currentUsername }}</h2>
            <p class="stats">
                <span>{{ myUploads.length }} Uploads</span> |
                <span>{{ myLikes.length }} Likes</span>
            </p>
        </div>

        <div class="profile-tabs">
            <div class="tab" :class="{ active: currentTab === 'uploads' }" @click="currentTab = 'uploads'">
                Video Anda
            </div>
            <div class="tab" :class="{ active: currentTab === 'likes' }" @click="currentTab = 'likes'">
                Disukai
            </div>
        </div>
    </div>

    <div v-if="loading" class="loading-state">Memuat data... ⏳</div>

    <div v-else class="content-area">
        <div v-if="displayedVideos.length" class="video-grid">
            <div
                v-for="(v) in displayedVideos"
                :key="v.id"
                class="video-thumbnail"
                @click="goToDetail(v.id)"
            >
                <div class="thumb-color" :style="{ backgroundColor: getHashColor(v.id) }">
                   <span class="play-icon">▶️</span>
                </div>

                <div class="thumbnail-overlay">
                    <span>❤️ {{ v.likes }}</span>
                </div>
            </div>
        </div>

        <div v-else class="empty-state">
            <p v-if="currentTab === 'uploads'">Anda belum mengupload video.</p>
            <p v-else>Anda belum menyukai video apapun.</p>
        </div>
    </div>

    <div class="bottom-nav">
        <div class="item" @click="$router.push('/')">
            <span class="icon">🏠</span>
            <span class="label">Home</span>
        </div>
        <div class="item upload-container" @click="$router.push('/upload')">
            <div class="upload-btn"><span>➕</span></div>
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
import axios from "axios";

// Config URL
const FEED_SERVICE_URL = "https://feedstick-service-func123.azurewebsites.net/api";
const API_KEY = "EUKUzAPKrmwP_OA4VxZG3CiVs_TCpqY-_RfIFbIX81jdAzFu0vWVLQ==";

export default defineComponent({
  name: "ProfileView",
  data() {
    return {
      allVideos: [] as any[],
      loading: true,
      currentTab: 'uploads' as 'uploads' | 'likes',
      currentUsername: localStorage.getItem('username') || '',
    };
  },
  computed: {
    // Filter Video Upload Saya
    myUploads(): any[] {
        return this.allVideos.filter(v => {
            const owner = v.username || v.uploaderId;
            return owner === this.currentUsername;
        });
    },
    // Filter Video yang Saya Like
    myLikes(): any[] {
        return this.allVideos.filter(v => {
            return v.likedBy && v.likedBy.includes(this.currentUsername);
        });
    },
    // Tentukan mana yang ditampilkan berdasarkan Tab
    displayedVideos(): any[] {
        return this.currentTab === 'uploads' ? this.myUploads : this.myLikes;
    }
  },
  methods: {
    handleLogout() {
      localStorage.removeItem('user_id');
      localStorage.removeItem('username');
      this.$router.push('/login');
    },

    goToDetail(id: string) {
        // Arahkan ke halaman detail
        this.$router.push(`/video/${id}`);
    },

    getHashColor(str: string) {
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
            const res = await axios.get(`${FEED_SERVICE_URL}/videos?code=${API_KEY}`);
            this.allVideos = res.data.videos;
        } catch (e) {
            console.error("Gagal ambil data profile:", e);
        } finally {
            this.loading = false;
        }
    }
  },
  mounted() {
    if (!this.currentUsername) {
        alert("Harap login dulu");
        this.$router.push('/login');
    } else {
        this.fetchData();
    }
  }
});
</script>

<style scoped>
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

.profile-header {
    background: #111;
    padding: 20px 0 0;
    text-align: center;
}

.avatar {
    font-size: 50px;
    background: #333;
    border-radius: 50%;
    width: 80px;
    height: 80px;
    line-height: 80px;
    margin: 0 auto 10px;
    border: 2px solid #555;
}

.username { margin-bottom: 5px; }
.stats span { color: #aaa; font-size: 14px; margin: 0 5px; }

.profile-tabs {
    display: flex;
    justify-content: space-around;
    margin-top: 15px;
    border-bottom: 1px solid #333;
}

.tab {
    padding: 10px 0;
    flex: 1;
    text-align: center;
    cursor: pointer;
    color: #666;
    font-weight: bold;
}
.tab.active { color: white; border-bottom: 2px solid white; }

.content-area {
    height: calc(100vh - 220px);
    overflow-y: auto;
    padding: 2px;
}

.video-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
}

.video-thumbnail {
    aspect-ratio: 3/4;
    position: relative;
    cursor: pointer;
    background: #222;
}

.thumb-color {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.8;
}

.thumbnail-overlay {
    position: absolute;
    bottom: 5px;
    left: 5px;
    font-size: 12px;
    font-weight: bold;
    text-shadow: 1px 1px 2px black;
}

.logout-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #ff3b30;
    border: none;
    color: white;
    padding: 5px 10px;
    border-radius: 15px;
    cursor: pointer;
    font-size: 12px;
}

/* Navigasi Bawah & Lainnya sama seperti HomeView */
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
