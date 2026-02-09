<template>
  <v-container fluid>
    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card color="primary" variant="flat">
          <v-card-text class="text-center">
            <v-icon size="48" class="mb-2">mdi-book</v-icon>
            <div class="text-h4 font-weight-bold">{{ stats.totalManga }}</div>
            <div class="text-caption">มังงะทั้งหมด</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card color="secondary" variant="flat">
          <v-card-text class="text-center">
            <v-icon size="48" class="mb-2">mdi-book-open-variant</v-icon>
            <div class="text-h4 font-weight-bold">{{ stats.totalChapters }}</div>
            <div class="text-caption">ตอนทั้งหมด</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card color="success" variant="flat">
          <v-card-text class="text-center">
            <v-icon size="48" class="mb-2">mdi-eye</v-icon>
            <div class="text-h4 font-weight-bold">{{ stats.totalViews.toLocaleString() }}</div>
            <div class="text-caption">ยอดเข้าชมรวม</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card color="info" variant="flat">
          <v-card-text class="text-center">
            <v-icon size="48" class="mb-2">mdi-account-group</v-icon>
            <div class="text-h4 font-weight-bold">{{ stats.totalUsers }}</div>
            <div class="text-caption">ผู้ใช้ทั้งหมด</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const stats = ref({
    totalManga: 3,
    totalChapters: 4,
    totalViews: 1234,
    totalUsers: 2
})

useHead({
  title: 'Admin Dashboard - FAM Manga',
})
</script>

<style scoped>
/* Empty style block to prevent parsing errors */
</style>
