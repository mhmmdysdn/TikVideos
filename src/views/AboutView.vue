<template>
  <div class="container">
    <h1>All Videos</h1>

    <button @click="openUpload">Upload Video</button>

    <div v-if="loading">Loading videos...</div>

    <div class="video-grid">
      <div v-for="v in videos" :key="v">
        <video width="250" controls>
          <source :src="v" type="video/mp4">
        </video>
      </div>
    </div>

    <!-- Upload Popup -->
    <div v-if="showUpload" class="popup">
      <div class="popup-content">
        <h3>Upload Video</h3>
        <input type="file" accept="video/*" @change="uploadFile">
        <button @click="showUpload = false">Close</button>
      </div>
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
      loading: true,
      showUpload: false,
    };
  },

  methods: {
    async fetchVideos() {
      try {
        const res = await axios.get(`${API_BASE}/videos`);

        // Server returns array but as a string, so we parse
        const blobUrls: string[] = eval(res.data);

        // convert blob URLs to /api/video/... URLs
        this.videos = blobUrls.map(url => {
          const fileName = url.split("/").pop();
          return `${API_BASE}/video/${fileName}?code=${API_KEY}`;
        });

      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    openUpload() {
      this.showUpload = true;
    },

    async uploadFile(event: Event) {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("video", file);

      try {
        await axios.post(
          `${API_BASE}/uploadVideo?code=${API_KEY}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        alert("Upload success!");
        this.showUpload = false;
        this.fetchVideos();

      } catch (error) {
        console.error(error);
        alert("Failed to upload.");
      }
    }
  },

  mounted() {
    this.fetchVideos();
  }
});
</script>

<style>
.container {
  padding: 20px;
}

.video-grid {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
}
</style>
