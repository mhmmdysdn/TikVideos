<template>
  <div class="app">

    <!-- HEADER -->
    <div class="header">
      <div class="tab active">For You</div>
      <div class="tab">Following</div>
    </div>

    <!-- VIDEO FEED -->
    <div class="feed">
      <div 
        v-for="(v, i) in videos" 
        :key="i" 
        class="video-wrapper"
      >
        <video 
          :src="v" 
          class="video-player"
          autoplay 
          muted 
          loop 
          playsinline
        ></video>

        <!-- simple caption di kiri bawah -->
        <div class="caption">
          <p class="username">@creator</p>
          <p class="desc">Video keren banget sih ini.</p>
        </div>
      </div>
    </div>

    <!-- BOTTOM NAV -->
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

const API_BASE = "https://uploadvid-service-func-123.azurewebsites.net/api";
const API_KEY = "zXzGva2BQlWU6M-6yPTQv9nQ1mE_2HkTUIN5sEU4XCPFAzFue6eLyw==";

export default defineComponent({
  data() {
    return {
      videos: [] as string[],
    };
  },

  async mounted() {
    try {
      const res = await axios.get(`${API_BASE}/videos?code=${API_KEY}`);
      const list = res.data.videos;

      this.videos = list.map((file: string) => {
        return `${API_BASE}/video/${file}?code=${API_KEY}`;
      });

    } catch (err) {
      console.error("Gagal fetch videos:", err);
    }
  }
});
</script>

<style>
.app {
  height: 100vh;
  overflow: hidden;
  background: black;
  color: white;
  font-family: sans-serif;
  position: relative;
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

/* FEED */
.feed {
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  margin-top: -55px;
  padding-top: 55px;
}

.video-wrapper {
  position: relative;
  height: 100vh;
  width: 100%;
  scroll-snap-align: start;
}

.video-player {
  height: 100%;
  width: 100%;
  object-fit: cover;
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
</style>
