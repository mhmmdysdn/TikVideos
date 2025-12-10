import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UploadView from '../views/UploadView.vue'
import ProfileView from '../views/ProfileView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import VideoDetailView from '../views/VideoDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      // 2. Tambahkan meta field 'requiresAuth' untuk menandai halaman ini diproteksi
      meta: { requiresAuth: true }
    },
    {
      path: '/upload',
      name: 'upload',
      component: UploadView,
      meta: { requiresAuth: true } // Halaman ini juga wajib login
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true } // Halaman ini juga wajib login
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue')
    },
    {
      path: '/video/:id', // :id adalah parameter dinamis
      name: 'video-detail',
      component: VideoDetailView,
    },
  ],
})

// 3. Navigation Guard (Satpam)
// Fungsi ini akan dijalankan setiap kali user berpindah halaman
router.beforeEach((to, from, next) => {
  // Cek apakah halaman tujuan (to) memiliki tanda 'requiresAuth'
  if (to.matched.some(record => record.meta.requiresAuth)) {

    // Cek apakah ada 'user_id' di local storage browser
    const isAuthenticated = localStorage.getItem('user_id');

    if (!isAuthenticated) {
      // Jika tidak ada ID (belum login), paksa pindah ke halaman login
      next({ name: 'login' });
    } else {
      // Jika ada ID, silakan masuk
      next();
    }
  } else {
    // Jika halaman tidak butuh login (seperti Login/Register), langsung masuk saja
    next();
  }
});

export default router
