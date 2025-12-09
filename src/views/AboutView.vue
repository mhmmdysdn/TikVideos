<template>
  <div class="container">
    <h1>Test Video</h1>

    <video width="400" controls>
      <source :src="videoUrl" type="video/mp4">
    </video>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

const API_BASE = "https://uploadvid-service-func-123.azurewebsites.net/api";
const API_KEY = "zXzGva2BQlWU6M-6yPTQv9nQ1mE_2HkTUIN5sEU4XCPFAzFue6eLyw==";

// GANTI SESUAI FILE YANG KAMU UPLOAD
const FILE_NAME = "6edf1604-7a49-4b79-83f3-8d7335a9f22a.mp4";

export default defineComponent({
  data() {
    return {
      videoUrl: "",
    };
  },

  mounted() {
    this.videoUrl = `${API_BASE}/video/${FILE_NAME}?code=${API_KEY}`;
  }
});
</script>

<style>
.container {
  padding: 20px;
}
</style>
