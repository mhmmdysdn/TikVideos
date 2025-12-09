<template>
  <div class="upload-page">

    <div class="header-top">
      <button class="close-btn" @click="$router.go(-1)">✕</button>
      <h3>Posting Baru</h3>
      <div style="width: 24px"></div> </div>

    <div class="content-area">

      <div class="upload-box" @click="triggerFileInput">

        <div v-if="previewUrl" class="video-preview-container">
          <video :src="previewUrl" autoplay muted loop playsinline class="preview-video"></video>
          <div class="change-label">Ganti Video</div>
        </div>

        <div v-else class="placeholder">
          <div class="icon-upload">☁️</div>
          <p>Pilih Video</p>
          <span class="sub-text">MP4, WebM (Max 1 Menit)</span>
        </div>

        <input
          type="file"
          ref="fileInput"
          accept="video/*"
          class="hidden-input"
          @change="handleFileChange"
        />
      </div>

      <div class="caption-box">
        <label>Caption</label>
        <textarea
          v-model="caption"
          placeholder="Tulis sesuatu tentang video ini... #fyp"
          rows="4"
        ></textarea>
      </div>

    </div>

    <div class="action-bar">
      <button
        class="post-btn"
        @click="uploadFile"
        :disabled="!selectedFile || isUploading"
      >
        {{ isUploading ? 'Mengunggah... ⏳' : 'Posting Video ✨' }}
      </button>

      <p v-if="message" :class="['status-msg', isSuccess ? 'success' : 'error']">
        {{ message }}
      </p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const caption = ref('');
const isUploading = ref(false);
const message = ref('');
const isSuccess = ref(false);

// Fungsi untuk memicu klik pada input file tersembunyi
const triggerFileInput = () => {
  fileInput.value?.click();
};

// Handle saat user memilih file
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    selectedFile.value = file;

    // Buat URL sementara untuk preview video
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value); // Bersihkan memori lama
    previewUrl.value = URL.createObjectURL(file);

    message.value = '';
  }
};

// Bersihkan URL preview saat komponen dihancurkan (mencegah memory leak)
onUnmounted(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
});

const uploadFile = async () => {
  if (!selectedFile.value) return;

  isUploading.value = true;
  message.value = "";

  const formData = new FormData();
  // 1. Masukkan File
  formData.append("video", selectedFile.value);

  // 2. Masukkan Caption (Pastikan Backend Anda menerima field 'caption')
  formData.append("caption", caption.value);

  // 3. Masukkan Username
  const myUsername = localStorage.getItem('username') || 'Anonim';
  formData.append("username", myUsername);

  try {
    await axios.post(
      "https://uploadvid-service-func-123.azurewebsites.net/api/uploadVideo",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-user-id": myUsername // Header Wajib
        }
      }
    );

    message.value = "Berhasil diupload! Mengalihkan...";
    isSuccess.value = true;

    // Reset form
    selectedFile.value = null;
    caption.value = "";

    // Kembali ke Home setelah 1.5 detik
    setTimeout(() => {
      router.push('/');
    }, 1500);

  } catch (error: any) {
    console.error(error);
    message.value = error.response?.data?.error || "Gagal mengupload video.";
    isSuccess.value = false;
  } finally {
    isUploading.value = false;
  }
};
</script>

<style scoped>
/* Layout Halaman Utama */
.upload-page {
  background-color: #000;
  color: white;
  min-height: 100vh;
  width: 100%;
  max-width: 450px; /* Samakan dengan HomeView */
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* Header Atas */
.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #333;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

/* Area Konten */
.content-area {
  padding: 20px;
  flex: 1; /* Mengisi sisa ruang */
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Kotak Upload & Preview */
.upload-box {
  width: 100%;
  height: 250px;
  background-color: #1a1a1a;
  border: 2px dashed #333;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
}

.upload-box:hover {
  border-color: #555;
}

.hidden-input {
  display: none;
}

/* Tampilan Placeholder (Belum ada file) */
.placeholder {
  text-align: center;
  color: #888;
}

.icon-upload {
  font-size: 40px;
  margin-bottom: 10px;
}

.sub-text {
  font-size: 12px;
  color: #555;
  margin-top: 5px;
  display: block;
}

/* Tampilan Preview Video */
.video-preview-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.preview-video {
  width: 100%;
  height: 100%;
  object-fit: contain; /* Agar video pas di kotak */
  background: black;
}

.change-label {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.6);
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  color: white;
}

/* Input Caption */
.caption-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.caption-box label {
  font-size: 14px;
  font-weight: bold;
  color: #ccc;
}

.caption-box textarea {
  background-color: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 12px;
  color: white;
  font-family: inherit;
  resize: none; /* Mencegah user mengubah ukuran */
  outline: none;
}

.caption-box textarea:focus {
  border-color: #42b883; /* Highlight warna hijau Vue saat diketik */
}

/* Action Bar Bawah */
.action-bar {
  padding: 20px;
  background: #000;
  border-top: 1px solid #333;
}

.post-btn {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;

  /* Gradient Warna ala TikTok/Modern App */
  background: linear-gradient(90deg, #ff0050, #00f2ea);
  color: white;
  transition: opacity 0.2s;
}

.post-btn:disabled {
  background: #333;
  color: #777;
  cursor: not-allowed;
}

.status-msg {
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
}
.success { color: #42b883; }
.error { color: #ff4d4d; }
</style>
