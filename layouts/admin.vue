<template>
  <v-app>
    <!-- Admin Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" color="surface-variant" theme="dark" permanent>
      <v-list>
        <v-list-item prepend-avatar="/images/logo.png" title="FAM Admin" subtitle="Management System"></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item 
          prepend-icon="mdi-view-dashboard" 
          title="Dashboard" 
          to="/admin/dashboard"
          exact
        />
        <v-list-item 
          prepend-icon="mdi-book-multiple" 
          title="จัดการมังงะ" 
          to="/admin/manga"
        />
        <v-list-item 
          prepend-icon="mdi-account-group" 
          title="ผู้ใช้งาน" 
          to="/admin/users"
        />
        <v-list-item 
          prepend-icon="mdi-cloud-upload" 
          title="อัปโหลด" 
          @click="adminStore.openUploadDialog()"
        />
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block color="error" variant="text" prepend-icon="mdi-logout" @click="handleLogout">
            ออกจากระบบ
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Admin App Bar -->
    <v-app-bar elevation="1">
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none"></v-app-bar-nav-icon>
      <v-app-bar-title class="font-weight-bold">ผู้ดูแลระบบ</v-app-bar-title>
      
      <v-spacer></v-spacer>

      <v-btn icon @click="toggleTheme">
        <v-icon>{{ theme.global.name.value === 'dark' ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>

      <v-btn to="/" variant="text" prepend-icon="mdi-web">
        ไปหน้าเว็บไซต์
      </v-btn>
    </v-app-bar>

    <v-main>
      <div class="pa-6">
        <slot />
      </div>
    </v-main>

    <!-- Global Admin Components -->
    <AdminUploadDialog />
  </v-app>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'
import { useAdminStore } from '~/stores/admin'

const { logout } = useAuth()
const router = useRouter()
const theme = useTheme()
const drawer = ref(true)
const adminStore = useAdminStore()

const toggleTheme = () => {
  theme.global.name.value = theme.global.name.value === 'dark' ? 'light' : 'dark'
}

const handleLogout = async () => {
  await logout()
  router.push('/') // Redirect to home after logout
}

</script>

<style scoped>
.v-navigation-drawer {
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
