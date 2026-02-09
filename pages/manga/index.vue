<template>
  <div>
      <v-container>
        <!-- Filters -->
        <v-row class="mb-4">
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.status"
              :items="statusOptions"
              label="สถานะ"
              variant="outlined"
              density="comfortable"
              clearable
              @update:model-value="loadManga"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.genre"
              :items="genreOptions"
              label="ประเภท"
              variant="outlined"
              density="comfortable"
              clearable
              @update:model-value="loadManga"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.sort"
              :items="sortOptions"
              label="เรียงตาม"
              variant="outlined"
              density="comfortable"
              @update:model-value="loadManga"
            />
          </v-col>
        </v-row>

        <!-- Loading -->
        <v-progress-linear
          v-if="loading"
          indeterminate
          color="primary"
          class="mb-4"
        />

        <!-- Manga Grid -->
        <v-row v-if="!loading && mangaList.length > 0">
          <v-col
            v-for="manga in mangaList"
            :key="manga.id"
            cols="6"
            sm="4"
            md="3"
            lg="2"
          >
            <v-card
              :to="`/manga/${manga.id}`"
              hover
              class="manga-card"
              height="100%"
            >
              <v-img
                :src="manga.cover_image"
                aspect-ratio="0.7"
                cover
                class="manga-cover"
              >
                <template #placeholder>
                  <v-row class="fill-height" align="center" justify="center">
                    <v-progress-circular indeterminate color="primary" />
                  </v-row>
                </template>
              </v-img>

              <v-card-text class="pa-2">
                <div class="text-subtitle-2 font-weight-bold text-truncate" :title="manga.title">
                  {{ manga.title }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ manga.total_chapters }} ตอน
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Empty State -->
        <v-row v-if="!loading && mangaList.length === 0">
          <v-col cols="12" class="text-center py-16">
            <v-icon size="64" color="grey">mdi-book-off</v-icon>
            <p class="text-h6 mt-4">ไม่พบมังงะ</p>
          </v-col>
        </v-row>

        <!-- Pagination -->
        <v-row v-if="pagination.totalPages > 1" class="mt-8">
          <v-col cols="12" class="d-flex justify-center">
            <v-pagination
              v-model="pagination.page"
              :length="pagination.totalPages"
              @update:model-value="loadManga"
              color="primary"
              total-visible="7"
            />
          </v-col>
        </v-row>
      </v-container>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const { fetchMangaList } = useManga()

const searchQuery = ref('')
const loading = ref(false)
const mangaList = ref<any[]>([])
const filters = reactive({
  status: null as string | null,
  genre: null as string | null,
  sort: 'latest',
})
const pagination = reactive({
  page: 1,
  limit: 24,
  total: 0,
  totalPages: 0,
})

const statusOptions = [
  { title: 'ยังไม่จบ', value: 'ongoing' },
  { title: 'จบแล้ว', value: 'completed' },
  { title: 'พักการออก', value: 'hiatus' },
]

const genreOptions = [
  { title: 'แอ็คชั่น', value: 'action' },
  { title: 'ผจญภัย', value: 'adventure' },
  { title: 'ตลก', value: 'comedy' },
  { title: 'นินจา', value: 'ninja' },
]

const sortOptions = [
  { title: 'ล่าสุด', value: 'latest' },
  { title: 'ยอดนิยม', value: 'popular' },
  { title: 'คะแนน', value: 'rating' },
  { title: 'ชื่อ', value: 'title' },
]

const loadManga = async () => {
  loading.value = true
  
  const result = await fetchMangaList({
    page: pagination.page,
    limit: pagination.limit,
    search: searchQuery.value || undefined,
    status: filters.status || undefined,
    genre: filters.genre || undefined,
    sort: filters.sort,
  })

  if (result?.data) {
    mangaList.value = result.data
    pagination.total = result.pagination.total
    pagination.totalPages = result.pagination.totalPages
  }

  loading.value = false
}

const handleSearch = () => {
  pagination.page = 1
  loadManga()
}

onMounted(() => {
  loadManga()
})

useHead({
  title: 'เรียกดูมังงะ - FAM Manga',
})
</script>

<style scoped>
.manga-card {
  transition: transform 0.2s;
}

.manga-card:hover {
  transform: translateY(-4px);
}

.manga-cover {
  position: relative;
  overflow: hidden;
}
</style>
