<template>
  <div class="upload-container">
    <h2>Upload Video Baru</h2>

    <div class="form-box">
      <input type="file" accept="video/*" @change="handleFileChange" />

      <button
        @click="uploadFile"
        :disabled="!selectedFile || isUploading"
        class="btn-upload"
      >
        {{ isUploading ? 'Sedang Upload...' : 'Upload Video' }}
      </button>

      <p v-if="message" :class="{'success': isSuccess, 'error': !isSuccess}">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const selectedFile = ref<File | null>(null);
const isUploading = ref(false);
const message = ref('');
const isSuccess = ref(false);

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    selectedFile.value = input.files[0];
    message.value = '';
  }
};

const uploadFile = async () => {
  if (!selectedFile.value) return;

  isUploading.value = true;
  const formData = new FormData();
  formData.append("video", selectedFile.value);

  try {
    // Pastikan URL upload ini benar
    await axios.post(
      "https://uploadvid-service-func-123.azurewebsites.net/api/uploadVideo",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    message.value = "Upload berhasil!";
    isSuccess.value = true;
    selectedFile.value = null; // Reset file input
  } catch (error) {
    console.error(error);
    message.value = "Gagal mengupload video.";
    isSuccess.value = false;
  } finally {
    isUploading.value = false;
  }
};
</script>

<style scoped>
.upload-container {
  max-width: 500px;
  margin: 40px auto;
  text-align: center;
}
.form-box {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.btn-upload {
  background-color: #42b883;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  font-size: 16px;
}
.btn-upload:disabled {
  background-color: #ccc;
}
.success { color: green; }
.error { color: red; }
</style>
