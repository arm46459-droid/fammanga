<template>
  <div>
    <!-- App Bar -->
    <v-app-bar elevation="2" color="surface" prominent>
      <v-app-bar-nav-icon 
        @click="drawer = !drawer" 
        class="d-md-none"
      />
      
      <v-app-bar-title>
        <NuxtLink to="/" class="text-decoration-none">
          <span class="gradient-text font-weight-bold text-h5">
            FAM Manga
          </span>
        </NuxtLink>
      </v-app-bar-title>
      
      <!-- Desktop Menu -->
      <template v-slot:append>
        <div class="d-none d-md-flex align-center">
          <v-btn to="/" variant="text">
            <v-icon start>mdi-home</v-icon>
            หน้าแรก
          </v-btn>
          
          <v-btn to="/manga" variant="text">
            <v-icon start>mdi-book-open-variant</v-icon>
            เรียกดูมังงะ
          </v-btn>
          
          <!-- Auth Buttons -->
          <template v-if="!isAuthenticated">
            <v-btn to="/login" color="primary" variant="text" class="ml-2">
              <v-icon start>mdi-login</v-icon>
              เข้าสู่ระบบ
            </v-btn>
            <v-btn to="/register" color="secondary" variant="outlined" class="ml-2">
              <v-icon start>mdi-account-plus</v-icon>
              สมัครสมาชิก
            </v-btn>
          </template>
          
          <template v-else>
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" color="primary" variant="text" class="ml-2">
                  <v-icon start>mdi-account-circle</v-icon>
                  {{ user?.username || 'User' }}
                  <v-icon end>mdi-menu-down</v-icon>
                </v-btn>
              </template>
              
              <v-list>
                <v-list-item 
                  :to="user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'"
                  prepend-icon="mdi-view-dashboard"
                >
                  <v-list-item-title>Dashboard</v-list-item-title>
                </v-list-item>
                
                <v-divider />
                
                <v-list-item 
                  @click="handleLogout"
                  prepend-icon="mdi-logout"
                >
                  <v-list-item-title>ออกจากระบบ</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
          
          <!-- Theme Toggle -->
          <v-btn 
            icon 
            @click="toggleTheme"
            class="ml-2"
          >
            <v-icon>{{ theme.global.name.value === 'dark' ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
          </v-btn>
        </div>
      </template>
    </v-app-bar>
    
    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      temporary
      location="left"
    >
      <v-list>
        <v-list-item>
          <v-list-item-title class="gradient-text font-weight-bold text-h6">
            FAM Manga
          </v-list-item-title>
        </v-list-item>
      </v-list>
      
      <v-divider />
      
      <v-list density="compact" nav>
        <v-list-item to="/" prepend-icon="mdi-home">
          <v-list-item-title>หน้าแรก</v-list-item-title>
        </v-list-item>
        
        <v-list-item to="/manga" prepend-icon="mdi-book-open-variant">
          <v-list-item-title>เรียกดูมังงะ</v-list-item-title>
        </v-list-item>
        
        <template v-if="isAuthenticated">
          <v-divider class="my-2" />
          
          <v-list-item 
            :to="user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'"
            prepend-icon="mdi-view-dashboard"
          >
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item>
          
          <v-list-item>
            <v-list-item-title class="text-caption text-medium-emphasis">
              ผู้ใช้: {{ user?.username }}
            </v-list-item-title>
          </v-list-item>
          
          <v-list-item 
            @click="handleLogout"
            prepend-icon="mdi-logout"
            color="error"
          >
            <v-list-item-title>ออกจากระบบ</v-list-item-title>
          </v-list-item>
        </template>
        
        <template v-else>
          <v-divider class="my-2" />
          
          <v-list-item to="/login" prepend-icon="mdi-login">
            <v-list-item-title>เข้าสู่ระบบ</v-list-item-title>
          </v-list-item>
          
          <v-list-item to="/register" prepend-icon="mdi-account-plus">
            <v-list-item-title>สมัครสมาชิก</v-list-item-title>
          </v-list-item>
        </template>
        
        <v-divider class="my-2" />
        
        <v-list-item @click="toggleTheme" prepend-icon="mdi-theme-light-dark">
          <v-list-item-title>
            {{ theme.global.name.value === 'dark' ? 'โหมดสว่าง' : 'โหมดมืด' }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'

const { isAuthenticated, user, logout } = useAuth()
const router = useRouter()
const theme = useTheme()
const drawer = ref(false)

const toggleTheme = () => {
  theme.global.name.value = theme.global.name.value === 'dark' ? 'light' : 'dark'
}

const handleLogout = async () => {
  await logout()
  drawer.value = false
  router.push('/')
}
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(135deg, #E91E63 0%, #9C27B0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
