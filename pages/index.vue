<template>
  <div class="home-page">
    <!-- Hero Section with Banner -->
    <v-container fluid class="pa-0 hero-container">
       <v-carousel
        cycle
        height="500"
        hide-delimiter-background
        show-arrows="hover"
        interval="6000"
      >
        <v-carousel-item
          v-for="(banner, i) in banners"
          :key="i"
          :src="banner.image"
          cover
        >
          <div class="d-flex fill-height justify-center align-center banner-overlay">
            <v-container>
              <v-row>
                <v-col cols="12" md="8" lg="6">
                  <div class="banner-content pa-6 rounded-xl glass-effect">
                    <v-chip color="secondary" class="mb-4" label>{{ banner.tag }}</v-chip>
                    <h1 class="text-h3 text-md-h2 font-weight-bold mb-2 text-shadow">
                      {{ banner.title }}
                    </h1>
                    <p class="text-h6 text-medium-emphasis mb-6 font-weight-medium" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.8)">
                      {{ banner.subtitle }}
                    </p>
                    <div class="d-flex gap-4">
                      <v-btn
                        size="x-large"
                        color="primary"
                        rounded="pill"
                        :to="banner.link"
                        prepend-icon="mdi-book-open-page-variant"
                        elevation="4"
                      >
                        อ่านเลย
                      </v-btn>
                      <v-btn
                        size="x-large"
                        variant="outlined"
                        rounded="pill"
                        color="white"
                        prepend-icon="mdi-information-outline"
                        :to="banner.link"
                      >
                        รายละเอียด
                      </v-btn>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </v-carousel-item>
      </v-carousel>
    </v-container>
    
    <!-- Manga List Section -->
    <v-container class="py-12">
      <div class="content-wrapper pa-6 rounded-xl mb-12">
        <div class="d-flex align-center justify-space-between mb-8">
            <h2 class="text-h4 font-weight-bold gradient-text">
            <v-icon start color="primary">mdi-fire</v-icon>
            มังงะยอดนิยม
            </h2>
            <v-btn variant="text" color="primary" append-icon="mdi-arrow-right" to="/search">ดูทั้งหมด</v-btn>
        </div>

        <v-row v-if="loading">
            <v-col v-for="n in 4" :key="n" cols="6" sm="4" md="3">
                <v-skeleton-loader type="card" class="bg-transparent" />
            </v-col>
        </v-row>

        <v-row v-else>
            <v-col v-for="manga in mangaList" :key="manga.id" cols="6" sm="4" md="3">
            <v-card 
                class="manga-card h-100" 
                elevation="4" 
                :to="`/manga/${manga.id}`"
                ripple
            >
                <div class="image-wrapper mb-3 rounded-lg overflow-hidden position-relative">
                    <v-img
                    :src="manga.cover_image"
                    aspect-ratio="0.7"
                    cover
                    class="image-hover"
                    >
                    <template #placeholder>
                        <v-row class="fill-height ma-0" align="center" justify="center">
                            <v-progress-circular indeterminate color="grey-lighten-5" />
                        </v-row>
                    </template>
                    <div class="d-flex fill-height align-end justify-end pa-2 fade-in">
                        <v-chip size="small" color="primary" variant="flat" label class="font-weight-bold">
                            {{ manga.total_chapters || 0 }} ตอน
                        </v-chip>
                    </div>
                    </v-img>
                </div>
                
                <h3 class="text-subtitle-1 font-weight-bold text-truncate mb-1 px-2">{{ manga.title }}</h3>
                <div class="d-flex align-center text-caption text-medium-emphasis px-2 pb-2">
                <v-icon size="small" start color="grey">mdi-eye</v-icon> {{ manga.views?.toLocaleString() || 0 }}
                <v-spacer />
                <v-chip size="x-small" :color="manga.status === 'completed' ? 'success' : 'info'" variant="outlined" label>
                    {{ manga.status === 'completed' ? 'จบแล้ว' : 'ยังไม่จบ' }}
                </v-chip>
                </div>
            </v-card>
            </v-col>
        </v-row>
      </div>

      <!-- Features Section -->
      <div class="content-wrapper pa-8 rounded-xl">
        <h2 class="text-h3 text-center font-weight-bold mb-12 gradient-text">คุณสมบัติพิเศษ</h2>
        <v-row>
            <v-col cols="12" md="4">
            <v-card class="pa-6 h-100 feature-card text-center" elevation="0" color="transparent">
                <v-icon size="64" color="primary" class="mb-4">mdi-library-shelves</v-icon>
                <h3 class="text-h5 font-weight-bold mb-2">รายการอ่าน</h3>
                <p class="text-medium-emphasis">จัดการมังงะที่จะอ่านและที่อยากได้ตามใจชอบ</p>
            </v-card>
            </v-col>
            <v-col cols="12" md="4">
            <v-card class="pa-6 h-100 feature-card text-center" elevation="0" color="transparent">
                <v-icon size="64" color="secondary" class="mb-4">mdi-sync</v-icon>
                <h3 class="text-h5 font-weight-bold mb-2">ติดตามความคืบหน้า</h3>
                <p class="text-medium-emphasis">บันทึกความคืบหน้าการอ่านอัตโนมัติ</p>
            </v-card>
            </v-col>
            <v-col cols="12" md="4">
            <v-card class="pa-6 h-100 feature-card text-center" elevation="0" color="transparent">
                <v-icon size="64" color="success" class="mb-4">mdi-clock-fast</v-icon>
                <h3 class="text-h5 font-weight-bold mb-2">อัปเดตไว</h3>
                <p class="text-medium-emphasis">ตอนใหม่อัปเดตทันใจ อ่านได้ก่อนใคร</p>
            </v-card>
            </v-col>
        </v-row>
       </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const { fetchMangaList } = useManga()
const mangaList = ref<any[]>([])
const loading = ref(true)

// Static banners for now, or could promote specific featured manga
const banners = [
  {
    title: 'Solo Leveling',
    subtitle: 'การผจญภัยของซองจินอู ฮันเตอร์ระดับ S ที่แข็งแกร่งที่สุด',
    tag: 'ยอดนิยมแห่งปี',
    image: 'https://images5.alphacoders.com/134/1347890.png',
    link: '/manga/12'
  },
  {
    title: 'One Piece',
    subtitle: 'การเดินทางสู่การเป็นราชาโจรสลัดของลูฟี่และพรรคพวก',
    tag: 'The King',
    image: 'https://images3.alphacoders.com/133/1336499.jpeg',
    link: '/manga/10'
  },
  {
    title: 'Jujutsu Kaisen',
    title_en: 'Jujutsu Kaisen',
    subtitle: 'มหาเวทย์ผนึกมาร การต่อสู้ของเหล่านักไสยเวทย์',
    tag: 'มาแรง',
    image: 'https://images8.alphacoders.com/133/1330368.jpeg',
    link: '/manga/13'
  }
]

onMounted(async () => {
  loading.value = true
  const result = await fetchMangaList({ limit: 8, sort: 'views' })
  if (result?.data) {
    mangaList.value = result.data
  }
  loading.value = false
})

useHead({
  title: 'FAM Manga - เว็บไซต์อ่านมังงะออนไลน์',
  meta: [
    {
       name: 'description',
       content: 'อ่านมังงะออนไลน์ฟรี มีรายการอ่าน, ติดตามความคืบหน้า, และอัปเดตตอนใหม่อย่างต่อเนื่อง',
    },
  ],
})
</script>



<style scoped>
.home-page {
  min-height: 100vh;
}

.hero-container {
    position: relative;
    z-index: 1;
}

.banner-overlay {
    background: linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 60%, transparent 100%);
}

.glass-effect {
    background: rgba(20, 20, 20, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.content-wrapper {
    background: rgba(30, 30, 30, 0.6);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.text-shadow {
    text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
}

.manga-card {
    transition: transform 0.2s;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
}

.manga-card:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(var(--v-theme-primary), 0.5);
}

.manga-card:hover .text-subtitle-1 {
    color: rgb(var(--v-theme-primary));
}

.image-hover {
    transition: all 0.3s;
}

.manga-card:hover .image-hover {
    transform: scale(1.05);
}

.image-wrapper {
    overflow: hidden;
    position: relative;
}

.feature-card {
    border: 1px solid rgba(255, 255, 255, 0.05);
    background: rgba(20, 20, 20, 0.4) !important;
    backdrop-filter: blur(10px);
}

.gap-4 {
  gap: 1rem;
}

.gradient-text {
    background: linear-gradient(45deg, #FF4081, #7C4DFF);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
}

.fade-in {
    animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
</style>
