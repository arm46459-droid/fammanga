<template>
  <v-app>
    <!-- User Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" permanent color="surface-variant" theme="dark">
      <v-list>
        <v-list-item
          :prepend-avatar="user?.avatar || undefined"
          :title="user?.username || 'User'"
          :subtitle="user?.email || ''"
        >
          <template v-slot:prepend>
             <v-avatar color="primary">
               <v-img v-if="user?.avatar" :src="user.avatar" alt="Avatar"></v-img>
               <span v-else class="text-h6 white--text">{{ user?.username?.charAt(0)?.toUpperCase() }}</span>
             </v-avatar>
          </template>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-view-dashboard" title="แดชบอร์ด" to="/user/dashboard" exact></v-list-item>
        <v-list-item prepend-icon="mdi-book" title="เรียกดูมังงะ" to="/manga"></v-list-item>
        
        <v-divider class="my-2"></v-divider>
        <v-list-subheader>รายการของฉัน</v-list-subheader>
        
        <v-list-item prepend-icon="mdi-history" title="อ่านต่อ" to="/user/dashboard?tab=continue"></v-list-item>
        <v-list-item prepend-icon="mdi-book-plus" title="รายการอ่าน" to="/user/dashboard?tab=reading"></v-list-item>
        <v-list-item prepend-icon="mdi-heart" title="รายการที่อยากได้" to="/user/dashboard?tab=wishlist"></v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block color="error" variant="text" prepend-icon="mdi-logout" @click="handleLogout">
            ออกจากระบบ
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- User App Bar -->
    <v-app-bar elevation="1" flat>
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none"></v-app-bar-nav-icon>
      <v-app-bar-title @click="router.push('/user/dashboard')" class="cursor-pointer font-weight-bold">FAM Manga</v-app-bar-title>
      
      <v-spacer></v-spacer>

      <v-btn icon @click="toggleTheme">
        <v-icon>{{ theme.global.name.value === 'dark' ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>

      <v-btn to="/" variant="text" prepend-icon="mdi-home">
        หน้าหลัก
      </v-btn>
    </v-app-bar>

    <v-main class="">
      <div class="pa-6">
        <slot />
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'

const { user, logout } = useAuth()
const router = useRouter()
const theme = useTheme()
const drawer = ref(true)

const toggleTheme = () => {
  theme.global.name.value = theme.global.name.value === 'dark' ? 'light' : 'dark'
}

const handleLogout = async () => {
  await logout()
  router.push('/')
}
</script>

<style scoped>
.v-main {
  min-height: 100vh;
}
</style>
