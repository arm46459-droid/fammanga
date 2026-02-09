<template>
  <v-footer class="footer-gradient footer-compact">
    <v-container class="py-6">
      <v-row>
        <!-- Column 1: About -->
        <v-col cols="12" md="4" class="mb-3 mb-md-0">
          <h3 class="text-subtitle-1 font-weight-bold mb-2 text-white">
            เกี่ยวกับ FAM Manga
          </h3>
          <p class="text-caption text-white-lighten-1">
            เว็บไซต์อ่านมังงะออนไลน์ฟรี พร้อมระบบติดตามความคืบหน้าและรายการอ่านส่วนตัว
          </p>
        </v-col>
        
        <!-- Column 2: Quick Links -->
        <v-col cols="12" md="4" class="mb-3 mb-md-0">
          <h3 class="text-subtitle-1 font-weight-bold mb-2 text-white">
            ลิงก์ด่วน
          </h3>
          <v-list density="compact" class="bg-transparent">
            <v-list-item 
              to="/" 
              prepend-icon="mdi-home"
              class="text-white-lighten-1"
            >
              <v-list-item-title>หน้าแรก</v-list-item-title>
            </v-list-item>
            
            <v-list-item 
              to="/manga" 
              prepend-icon="mdi-book-open-variant"
              class="text-white-lighten-1"
            >
              <v-list-item-title>เรียกดูมังงะ</v-list-item-title>
            </v-list-item>
            
            <v-list-item 
              v-if="isAuthenticated"
              :to="user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'"
              prepend-icon="mdi-view-dashboard"
              class="text-white-lighten-1"
            >
              <v-list-item-title>Dashboard</v-list-item-title>
            </v-list-item>
            
            <v-list-item 
              v-else
              to="/login" 
              prepend-icon="mdi-login"
              class="text-white-lighten-1"
            >
              <v-list-item-title>เข้าสู่ระบบ</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>
        
        <!-- Column 3: Social Media -->
        <v-col cols="12" md="4">
          <h3 class="text-subtitle-1 font-weight-bold mb-2 text-white">
            ติดตามเรา
          </h3>
          <div class="d-flex flex-column gap-2">
            <v-btn
              variant="text"
              prepend-icon="mdi-facebook"
              href="https://facebook.com"
              target="_blank"
              class="justify-start text-white-lighten-1"
            >
              Facebook
            </v-btn>
            
            <v-btn
              variant="text"
              prepend-icon="mdi-twitter"
              href="https://twitter.com"
              target="_blank"
              class="justify-start text-white-lighten-1"
            >
              Twitter
            </v-btn>
            
            <v-btn
              variant="text"
              prepend-icon="mdi-discord"
              href="https://discord.com"
              target="_blank"
              class="justify-start text-white-lighten-1"
            >
              Discord
            </v-btn>
          </div>
        </v-col>
      </v-row>
      
      <v-divider class="my-4 border-opacity-25" color="white" />
      
      <!-- Copyright -->
      <div class="text-center">
        <p class="text-caption text-white-lighten-1 mb-0">
          © {{ new Date().getFullYear() }} FAM Manga. All rights reserved. Made with <v-icon size="x-small" color="pink-lighten-1">mdi-heart</v-icon> for manga lovers
        </p>
      </div>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
const { isAuthenticated, user } = useAuth()
</script>

<style scoped>
.footer-gradient {
  background: linear-gradient(135deg, #E91E63 0%, #9C27B0 100%) !important;
  margin-top: auto;
}

.footer-compact {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.gap-2 {
  gap: 0.5rem;
}
</style>
