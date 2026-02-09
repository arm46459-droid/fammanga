<template>
  <div class="manga-detail-page">
      <!-- Background Image -->
      <div 
        v-if="manga" 
        class="background-image" 
        :style="{ backgroundImage: `url(${manga.cover_image})` }"
      ></div>
      <div class="background-overlay"></div>

      <v-container v-if="manga" class="content-container mt-8">
        <v-row>
          <!-- Cover Image -->
          <v-col cols="12" md="4" lg="3">
            <v-card elevation="12" class="cover-card">
              <v-img
                :src="manga.cover_image"
                aspect-ratio="0.7"
                cover
                class="rounded"
              />
            </v-card>

            <!-- Action Buttons เปลี่ยนหน้า login -->
            <div v-if="isAuthenticated" class="mt-6">
              <v-btn
                block
                size="large"
                color="primary"
                variant="flat"
                class="mb-3 font-weight-bold"
                rounded="lg"
                @click="toggleReadingList"
              >
                <v-icon start>mdi-book-plus</v-icon>
                {{ inReadingList ? 'ลบจากรายการอ่าน' : 'เพิ่มในรายการอ่าน' }}
              </v-btn>
              <v-btn
                block
                size="large"
                color="pink"
                variant="flat"
                rounded="lg"
                class="font-weight-bold text-white"
                @click="toggleWishlist"
              >
                <v-icon start>{{ inWishlist ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
                {{ inWishlist ? 'ถูกใจแล้ว' : 'ถูกใจ' }}
              </v-btn>
            </div>
            <div v-else class="mt-6">
              <v-btn
                block
                size="large"
                color="primary"
                variant="flat"
                to="/login"
                rounded="lg"
              >
                <v-icon start>mdi-login</v-icon>
                เข้าสู่ระบบเพื่อติดตาม
              </v-btn>
            </div>
          </v-col>

          <!-- Manga Details -->
          <v-col cols="12" md="8" lg="9">
            <div class="manga-info-card pa-6 pa-md-8">
                <h1 class="text-h3 font-weight-bold mb-2 text-shadow">{{ manga.title }}</h1>
                <p v-if="manga.title_en" class="text-h5 text-medium-emphasis mb-6">{{ manga.title_en }}</p>

                <div class="d-flex flex-wrap gap-2 mb-6">
                <v-chip color="primary" label v-if="manga.status" class="font-weight-bold">
                    {{ getStatusText(manga.status) }}
                </v-chip>
                <v-chip
                    v-for="genre in getGenres(manga.genres)"
                    :key="genre"
                    color="secondary"
                    variant="outlined"
                    class="font-weight-bold"
                >
                    {{ genre }}
                </v-chip>
                </div>

                <v-divider class="mb-6 border-opacity-25" />

                <v-row class="mb-6 text-center text-sm-left">
                <v-col cols="6" sm="3">
                    <div class="text-caption text-medium-emphasis mb-1">ผู้แต่ง</div>
                    <div class="text-subtitle-1 font-weight-bold">{{ manga.author || 'N/A' }}</div>
                </v-col>
                <v-col cols="6" sm="3">
                    <div class="text-caption text-medium-emphasis mb-1">ผู้วาด</div>
                    <div class="text-subtitle-1 font-weight-bold">{{ manga.artist || 'N/A' }}</div>
                </v-col>
                <v-col cols="6" sm="3">
                    <div class="text-caption text-medium-emphasis mb-1">ยอดเข้าชม</div>
                    <div class="text-subtitle-1 font-weight-bold">{{ manga.views?.toLocaleString() || 0 }}</div>
                </v-col>
                <v-col cols="6" sm="3">
                    <div class="text-caption text-medium-emphasis mb-1">จำนวนตอน</div>
                    <div class="text-subtitle-1 font-weight-bold">{{ manga.total_chapters || 0 }}</div>
                </v-col>
                </v-row>

                <h3 class="text-h5 font-weight-bold mb-3">เรื่องย่อ</h3>
                <p class="text-body-1 text-medium-emphasis mb-8 synopsis-text">{{ manga.description || 'ไม่มีเรื่องย่อ' }}</p>

                <!-- Chapters List -->
                <div class="d-flex align-center justify-space-between mb-4">
                    <h3 class="text-h5 font-weight-bold">รายการตอน</h3>
                    <v-chip size="small" variant="text">{{ chapters.length }} ตอน</v-chip>
                </div>
                
                <v-progress-linear v-if="loadingChapters" indeterminate color="primary" class="mb-4" />

                <v-card v-else-if="chapters.length > 0" class="chapter-list-card" elevation="0" color="transparent">
                <v-list bg-color="transparent">
                    <v-list-item
                    v-for="chapter in chapters"
                    :key="chapter.id"
                    :to="`/reader/${manga.id}/${chapter.id}`"
                    class="chapter-item mb-2"
                    border
                    lines="one"
                    >
                    <template #prepend>
                        <v-avatar color="primary" variant="tonal" size="40" class="mr-3">
                            <span class="text-body-2 font-weight-bold">{{ chapter.chapter_number }}</span>
                        </v-avatar>
                    </template>

                    <v-list-item-title class="font-weight-bold">
                        ตอนที่ {{ chapter.chapter_number }}
                        <span v-if="chapter.title" class="text-secondary ml-2 text-body-2">{{ chapter.title }}</span>
                    </v-list-item-title>

                    <template #append>
                        <div class="text-caption text-medium-emphasis">
                        {{ formatDate(chapter.created_at) }}
                        </div>
                    </template>
                    </v-list-item>
                </v-list>
                </v-card>

                <v-alert v-else type="info" variant="tonal" class="mt-4 border-dashed">
                ยังไม่มีตอนที่เผยแพร่
                </v-alert>
            </div>
          </v-col>
        </v-row>
      </v-container>

      <!-- Loading State -->
      <v-container v-else class="fill-height">
        <v-row justify="center" align="center" class="fill-height">
          <v-col cols="12" class="text-center">
            <v-progress-circular indeterminate color="primary" size="64" />
          </v-col>
        </v-row>
      </v-container>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const { mobile } = useDisplay()
const { fetchMangaDetail, fetchChapters, addToReadingList, removeFromReadingList, addToWishlist, removeFromWishlist } = useManga()
const { isAuthenticated } = useAuth()

const manga = ref<any>(null)
const chapters = ref<any[]>([])
const loadingChapters = ref(false)
const inReadingList = ref(false)
const inWishlist = ref(false)

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    ongoing: 'ยังไม่จบ',
    completed: 'จบแล้ว',
    hiatus: 'พักการออก',
  }
  return map[status] || status
}

const getGenres = (genres: any) => {
  if (!genres) return []
  if (typeof genres === 'string') {
    try {
      return JSON.parse(genres)
    } catch {
      return []
    }
  }
  return Array.isArray(genres) ? genres : []
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const toggleReadingList = async () => {
  if (!manga.value) return
  
  if (inReadingList.value) {
    await removeFromReadingList(manga.value.id)
    inReadingList.value = false
  } else {
    await addToReadingList(manga.value.id)
    inReadingList.value = true
  }
}

const toggleWishlist = async () => {
  if (!manga.value) return
  
  if (inWishlist.value) {
    await removeFromWishlist(manga.value.id)
    inWishlist.value = false
  } else {
    await addToWishlist(manga.value.id)
    inWishlist.value = true
  }
}

onMounted(async () => {
  const id = route.params.id as string
  
  const result = await fetchMangaDetail(id) as any
  if (result?.data) {
    manga.value = result.data
  }

  loadingChapters.value = true
  const chaptersResult = await fetchChapters(id) as any
  if (chaptersResult?.data) {
    chapters.value = chaptersResult.data
  }
  loadingChapters.value = false
})

useHead({
  title: computed(() => manga.value ? `${manga.value.title} - FAM Manga` : 'Loading...'),
})
</script>

<style scoped>
.manga-detail-page {
  position: relative;
  min-height: 100vh;
}

.background-image {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  filter: blur(20px) brightness(0.3);
  z-index: 0;
}

.background-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(19, 19, 30, 0.8), #1a1a2e);
  z-index: 1;
}

.content-container {
  position: relative;
  z-index: 2;
}

.manga-info-card {
  background: rgba(30, 30, 40, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.chapter-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s;
}

.chapter-item:hover {
  background: rgba(var(--v-theme-primary), 0.1);
  border-color: rgba(var(--v-theme-primary), 0.3);
  transform: translateX(5px);
}

.synopsis-text {
  line-height: 1.8;
}

.text-shadow {
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.gap-2 {
  gap: 0.5rem;
}
</style>
