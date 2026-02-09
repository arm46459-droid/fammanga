<template>
  <v-app>
    <v-main class="reader-page">
      <!-- Reader Header -->
      <v-app-bar elevation="0" color="black" density="compact" class="reader-header">
        <v-btn icon @click="$router.back()">
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <v-toolbar-title v-if="chapter" class="text-caption">
          ตอนที่ {{ chapter.chapter_number }}{{ chapter.title ? ` - ${chapter.title}` : '' }}
        </v-toolbar-title>

        <v-spacer />

        <v-btn icon @click="toggleFullscreen">
          <v-icon>{{ isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen' }}</v-icon>
        </v-btn>
      </v-app-bar>

      <!-- Reader Content -->
      <v-container v-if="chapter && pages.length > 0" fluid class="pa-0 reader-container">
        <div
          v-for="(page, index) in pages"
          :key="index"
          class="page-wrapper"
        >
          <v-img
            :src="page"
            :alt="`Page ${index + 1}`"
            class="reader-page-image"
            contain
          >
            <template #placeholder>
              <v-row class="fill-height" align="center" justify="center">
                <v-progress-circular indeterminate color="primary" />
              </v-row>
            </template>
          </v-img>
        </div>
      </v-container>

      <!-- Loading State -->
      <v-container v-else class="fill-height d-flex align-center justify-center">
        <v-progress-circular indeterminate color="primary" size="64" />
      </v-container>

      <!-- Bottom Navigation -->
      <v-footer v-if="chapter" app color="black" class="reader-footer">
        <v-container>
          <v-row align="center">
            <v-col cols="4" class="text-center">
              <v-btn
                :disabled="!prevChapterId"
                @click="gotoPrevChapter"
                color="primary"
                variant="outlined"
                size="small"
              >
                <v-icon start>mdi-chevron-left</v-icon>
                ตอนก่อนหน้า
              </v-btn>
            </v-col>
            <v-col cols="4" class="text-center">
              <span class="text-caption">
                หน้า {{ currentPage }} / {{ pages.length }}
              </span>
            </v-col>
            <v-col cols="4" class="text-center">
              <v-btn
                :disabled="!nextChapterId"
                @click="gotoNextChapter"
                color="primary"
                variant="outlined"
                size="small"
              >
                ตอนถัดไป
                <v-icon end>mdi-chevron-right</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-footer>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { fetchChapterContent, fetchChapters, saveProgress } = useManga()
const { isAuthenticated } = useAuth()

const chapter = ref<any>(null)
const pages = ref<string[]>([])
const currentPage = ref(1)
const isFullscreen = ref(false)
const prevChapterId = ref<number | null>(null)
const nextChapterId = ref<number | null>(null)

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

const gotoPrevChapter = () => {
  if (prevChapterId.value) {
    router.push(`/reader/${route.params.mangaId}/${prevChapterId.value}`)
  }
}

const gotoNextChapter = () => {
  if (nextChapterId.value) {
    router.push(`/reader/${route.params.mangaId}/${nextChapterId.value}`)
  }
}

// Scroll tracking for page number
const updateCurrentPage = () => {
  const pageElements = document.querySelectorAll('.page-wrapper')
  const scrollPosition = window.scrollY + window.innerHeight / 2

  let currentPageIndex = 0
  pageElements.forEach((el, index) => {
    const rect = el.getBoundingClientRect()
    const elementTop = window.scrollY + rect.top
    if (scrollPosition >= elementTop) {
      currentPageIndex = index + 1
    }
  })

  currentPage.value = currentPageIndex
}

onMounted(async () => {
  const mangaId = route.params.mangaId as string
  const chapterId = route.params.chapterId as string
  const currentId = Number(chapterId)

  // 1. Fetch content
  const result = await fetchChapterContent(mangaId, chapterId) as any
  if (result?.data) {
    chapter.value = result.data
    // Handle pages parsing if it's a string
    try {
        pages.value = typeof result.data.pages === 'string' ? JSON.parse(result.data.pages) : result.data.pages
    } catch (e) {
        pages.value = []
    }
  }

  // 2. Fetch adjacent chapters
  const chaptersResult = await fetchChapters(mangaId) as any
  if (chaptersResult?.data) {
      const allChapters = chaptersResult.data.sort((a: any, b: any) => a.chapter_number - b.chapter_number) // Ensure sorted by number
      const currentIndex = allChapters.findIndex((c: any) => c.id === currentId)
      
      if (currentIndex !== -1) {
          if (currentIndex > 0) {
              prevChapterId.value = allChapters[currentIndex - 1].id
          }
          if (currentIndex < allChapters.length - 1) {
              nextChapterId.value = allChapters[currentIndex + 1].id
          }
      }
  }

  // Save progress if authenticated
  if (isAuthenticated.value && chapter.value) {
    await saveProgress(Number(mangaId), Number(chapterId), 1)
  }

  // Add scroll listener for page tracking
  window.addEventListener('scroll', updateCurrentPage)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateCurrentPage)
})

useHead({
  title: computed(() =>
    chapter.value
      ? `ตอนที่ ${chapter.value.chapter_number} - FAM Manga`
      : 'Loading...'
  ),
})
</script>

<style scoped>
.reader-page {
  background-color: #000;
}

.reader-container {
  max-width: 1200px;
  margin: 0 auto;
  background-color: #000;
}

.page-wrapper {
  width: 100%;
  margin-bottom: 4px;
}

.reader-page-image {
  width: 100%;
  background-color: #000;
}

.reader-header,
.reader-footer {
  background-color: rgba(0, 0, 0, 0.9) !important;
}
</style>
