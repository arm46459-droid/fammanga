<template>
  <div>
    <h1 class="text-h4 font-weight-bold mb-6 gradient-text text-shadow">แดชบอร์ด</h1>

    <v-tabs v-model="tab" color="primary" class="mb-6 bg-surface rounded-lg elevation-1">
      <v-tab value="continue">
        <v-icon start>mdi-history</v-icon>
        อ่านต่อ
      </v-tab>
      <v-tab value="reading">
        <v-icon start>mdi-book-plus</v-icon>
        รายการอ่าน
      </v-tab>
      <v-tab value="wishlist">
        <v-icon start>mdi-heart</v-icon>
        รายการที่อยากได้
      </v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <!-- Continue Reading -->
      <v-window-item value="continue">
        <v-row v-if="loading">
          <v-col cols="12">
             <v-progress-linear indeterminate color="primary"></v-progress-linear>
          </v-col>
        </v-row>
        
        <v-row v-else-if="progressList.length > 0">
          <v-col
            v-for="item in progressList"
            :key="item.id"
            cols="6"
            sm="4"
            md="3"
            lg="2"
          >
            <v-card :to="`/manga/${item.manga_id}`" hover class="manga-card" rounded="lg">
              <v-img
                :src="item.cover_image"
                aspect-ratio="0.7"
                cover
                class="align-end"
              >
                  <v-card-title class="text-white text-subtitle-2 font-weight-bold pa-2" style="background: rgba(0,0,0,0.8); backdrop-filter: blur(2px);">
                    {{ item.title }}
                  </v-card-title>
              </v-img>
              <v-card-text class="pa-3">
                <div class="text-caption font-weight-medium text-primary">
                  ตอนที่ {{ item.chapter_number }}
                </div>
                <div class="text-caption text-medium-emphasis mt-1">
                  {{ new Date(item.read_at).toLocaleDateString('th-TH') }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-alert v-else type="info" variant="tonal" border="start" density="compact" class="mt-4">
          ยังไม่มีประวัติการอ่าน เริ่มอ่านมังงะเพื่อดูประวัติที่นี่
          <template v-slot:append>
             <v-btn variant="text" color="primary" to="/manga" size="small">ไปที่คลังมังงะ</v-btn>
          </template>
        </v-alert>
      </v-window-item>

      <!-- Reading List -->
      <v-window-item value="reading">
        <v-row v-if="loading">
           <v-col cols="12"><v-progress-linear indeterminate color="primary"></v-progress-linear></v-col>
        </v-row>

        <v-row v-else-if="readingList.length > 0">
          <v-col
            v-for="manga in readingList"
            :key="manga.id"
            cols="6"
            sm="4"
            md="3"
            lg="2"
          >
            <v-card :to="`/manga/${manga.id}`" hover class="manga-card" rounded="lg">
              <v-img
                :src="manga.cover_image"
                aspect-ratio="0.7"
                cover
              />
              <v-card-text class="pa-2">
                <div class="text-subtitle-2 font-weight-bold text-truncate">
                  {{ manga.title }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ manga.total_chapters }} ตอน
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-alert v-else type="info" variant="tonal" class="mt-4">
          ยังไม่มีรายการอ่าน
        </v-alert>
      </v-window-item>

      <!-- Wishlist -->
      <v-window-item value="wishlist">
        <v-row v-if="loading">
           <v-col cols="12"><v-progress-linear indeterminate color="primary"></v-progress-linear></v-col>
        </v-row>

        <v-row v-else-if="wishlist.length > 0">
          <v-col
            v-for="manga in wishlist"
            :key="manga.id"
            cols="6"
            sm="4"
            md="3"
            lg="2"
          >
            <v-card :to="`/manga/${manga.id}`" hover class="manga-card" rounded="lg">
              <v-img
                :src="manga.cover_image"
                aspect-ratio="0.7"
                cover
              />
              <v-card-text class="pa-2">
                <div class="text-subtitle-2 font-weight-bold text-truncate">
                  {{ manga.title }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ manga.total_chapters }} ตอน
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-alert v-else type="info" variant="tonal" class="mt-4">
          ยังไม่มีรายการที่อยากได้
        </v-alert>
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'user',
  middleware: 'auth',
})

const { user, logout, getAuthHeaders } = useAuth()
const { fetchProgress } = useManga()
const route = useRoute()
const router = useRouter()

// Use string values for tabs directly
const tab = ref(route.query.tab as string || 'continue')

const loading = ref(false)
const progressList = ref<any[]>([])
const readingList = ref<any[]>([])
const wishlist = ref<any[]>([])

// Watch for route changes to update tab
watch(() => route.query.tab, (newTab) => {
  if (newTab) {
    tab.value = newTab as string
  }
})

// Watch tab changes to update URL (optional, helps keep state)
watch(tab, (newTab) => {
  router.replace({ query: { ...route.query, tab: newTab } })
})

const handleLogout = async () => {
  await logout()
}

const loadData = async () => {
  loading.value = true

  try {
    // Load progress
    const progressResult = await fetchProgress()
    // Helper to safely get data
    if (progressResult && 'data' in progressResult && Array.isArray(progressResult.data)) {
      progressList.value = progressResult.data
    }

    // Load reading list
    const readingResponse = await $fetch<any>('/api/user/reading-list', {
      headers: getAuthHeaders(),
    })
    if (readingResponse && readingResponse.data) {
      readingList.value = readingResponse.data
    }

    // Load wishlist
    const wishlistResponse = await $fetch<any>('/api/user/wishlist', {
      headers: getAuthHeaders(),
    })
    if (wishlistResponse && wishlistResponse.data) {
      wishlist.value = wishlistResponse.data
    }
  } catch (error) {
    console.error('Load data error:', error)
  }

  loading.value = false
}

onMounted(() => {
  loadData()
})

useHead({
  title: 'Dashboard - FAM Manga',
})
</script>

<style scoped>
.manga-card {
  transition: transform 0.2s;
}

.manga-card:hover {
  transform: translateY(-4px);
}
</style>
