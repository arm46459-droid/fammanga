<template>
    <v-dialog v-model="adminStore.uploadDialogOpen" max-width="900px" scrollable>
       <!-- ... dialog content ... -->
      <v-card>
        <v-card-title>อัปโหลดตอนใหม่</v-card-title>
        
        <v-card-text class="pt-4">
          <v-form ref="uploadFormRef">
            <!-- Option: สร้างมังงะใหม่ หรือเลือกที่มีอยู่ -->
            <v-radio-group v-model="uploadMode" inline class="mb-4">
              <v-radio label="เลือกมังงะที่มีอยู่" value="existing" />
              <v-radio label="สร้างมังงะใหม่พร้อมตอน" value="new" />
            </v-radio-group>

            <!-- เลือกมังงะที่มีอยู่ -->
            <v-select
              v-if="uploadMode === 'existing'"
              v-model="uploadData.manga_id"
              :items="mangaList"
              item-title="title"
              item-value="id"
              label="เลือกมังงะ"
              variant="outlined"
              required
              class="mb-4"
            />

            <!-- สร้างมังงะใหม่ -->
            <div v-if="uploadMode === 'new'">
              <v-text-field
                v-model="newMangaData.title"
                label="ชื่อมังงะ (ไทย) *"
                variant="outlined"
                required
                class="mb-3"
              />
              
              <v-text-field
                v-model="newMangaData.title_en"
                label="ชื่อมังงะ (English)"
                variant="outlined"
                class="mb-3"
              />

              <v-text-field
                v-model="newMangaData.author"
                label="ผู้แต่ง"
                variant="outlined"
                class="mb-3"
              />

              <v-textarea
                v-model="newMangaData.description"
                label="เรื่องย่อ"
                variant="outlined"
                rows="2"
                class="mb-3"
              />

              <v-select
                v-model="newMangaData.genres"
                :items="genreOptions"
                label="หมวดหมู่ (เลือกได้หลายอัน)"
                variant="outlined"
                multiple
                chips
                class="mb-3"
              />

              <v-select
                v-model="newMangaData.status"
                :items="statusOptions"
                label="สถานะ"
                variant="outlined"
                class="mb-3"
              />

              <v-text-field
                v-model="newMangaData.cover_image"
                label="URL รูปหน้าปก"
                variant="outlined"
                placeholder="https://example.com/cover.jpg"
                class="mb-4"
              />

              <v-divider class="my-4" />
            </div>

            <!-- ข้อมูลตอน -->
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="uploadData.chapter_number"
                  label="เลขตอน *"
                  type="number"
                  variant="outlined"
                  required
                  step="0.1"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="uploadData.chapter_title"
                  label="ชื่อตอน (ถ้ามี)"
                  variant="outlined"
                />
              </v-col>
            </v-row>

            <!-- File Upload Area -->
            <v-file-input
              v-model="uploadFiles"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp"
              label="เลือกรูปภาพ (หลายไฟล์)"
              prepend-icon="mdi-image-multiple"
              variant="outlined"
              show-size
              counter
              class="mb-3"
              @update:model-value="handleFileSelect"
            >
              <template #selection="{ fileNames }">
                <v-chip v-for="fileName in fileNames" :key="fileName" size="small" class="mr-1">
                  {{ fileName }}
                </v-chip>
              </template>
            </v-file-input>

            <!-- Drag & Drop Zone -->
            <div
              class="dropzone pa-8 text-center rounded border-dashed"
              :class="{ 'dropzone-active': dragActive }"
              @drop.prevent="handleDrop"
              @dragover.prevent="dragActive = true"
              @dragleave="dragActive = false"
            >
              <v-icon size="64" color="primary" class="mb-2">mdi-cloud-upload</v-icon>
              <p class="text-h6 mb-1">ลากไฟล์รูปภาพมาวางที่นี่</p>
              <p class="text-caption text-medium-emphasis">รองรับ JPG, PNG, WebP (สูงสุด 50 ไฟล์)</p>
            </div>

            <!-- Preview Grid -->
            <v-row v-if="previews.length > 0" class="mt-4">
              <v-col cols="12">
                <div class="d-flex justify-space-between align-center mb-2">
                  <span class="text-subtitle-2">ตัวอย่าง ({{ previews.length }} หน้า)</span>
                  <v-btn size="small" variant="text" color="error" @click="clearPreviews">
                    <v-icon start>mdi-delete</v-icon>
                    ล้างทั้งหมด
                  </v-btn>
                </div>
              </v-col>
              <v-col
                v-for="(preview, i) in previews"
                :key="i"
                cols="6"
                sm="4"
                md="3"
                lg="2"
              >
                <v-card class="preview-card">
                  <v-img :src="preview.url" aspect-ratio="0.7" cover />
                  <v-card-subtitle class="text-center py-1">
                    หน้า {{ i + 1 }}
                  </v-card-subtitle>
                </v-card>
              </v-col>
            </v-row>

            <!-- Progress -->
            <v-progress-linear
              v-if="uploading"
              :model-value="uploadProgress"
              color="primary"
              height="8"
              class="mt-4"
              striped
            >
              <template #default="{ value }">
                <strong>{{ Math.ceil(value) }}%</strong>
              </template>
            </v-progress-linear>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="adminStore.closeUploadDialog()">ยกเลิก</v-btn>
          <v-btn
            color="primary"
            :loading="uploading"
            :disabled="!canUpload"
            @click="handleUpload"
          >
            <v-icon start>mdi-upload</v-icon>
            อัปโหลด ({{ uploadFiles.length }} ไฟล์)
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { useAdminStore } from '~/stores/admin'

const { user, getAuthHeaders } = useAuth()
const alert = useAlert()
const adminStore = useAdminStore()

const uploadMode = ref('existing')
const uploading = ref(false)
const uploadProgress = ref(0)
const uploadFiles = ref<File[]>([])
const previews = ref<{ url: string, file: File }[]>([])
const dragActive = ref(false)
const mangaList = ref<any[]>([])

const uploadData = reactive({
  manga_id: null,
  chapter_number: 1,
  chapter_title: '',
})

const newMangaData = reactive({
  title: '',
  title_en: '',
  author: '',
  description: '',
  genres: [] as string[],
  status: 'ongoing',
  cover_image: '',
})

const genreOptions = [
  'แอคชั่น', 'ผจญภัย', 'ตลก', 'ดราม่า', 'แฟนตาซี', 'สยองขวัญ', 'ลึกลับ', 'โรแมนติก', 'ไซไฟ', 'หั่นสับ', 'กีฬา', 'เหนือธรรมชาติ', 'ระทึกขวัญ',
]

const statusOptions = [
  { title: 'ยังไม่จบ', value: 'ongoing' },
  { title: 'จบแล้ว', value: 'completed' },
  { title: 'พักการออก', value: 'hiatus' },
]

const canUpload = computed(() => {
  if (uploadMode.value === 'existing') {
    return uploadData.manga_id && uploadData.chapter_number && uploadFiles.value.length > 0
  } else {
    return newMangaData.title && uploadData.chapter_number && uploadFiles.value.length > 0
  }
})

onMounted(async () => {
  // Load manga list for dropdown
  try {
    const result = await $fetch('/api/manga')
    if (result?.data) {
      mangaList.value = result.data
    }
  } catch (error) {
    console.error('Load manga list error:', error)
  }
})

const handleFileSelect = (files: File | File[]) => {
  if (!files) return
  const fileArray = Array.isArray(files) ? files : [files]
  if (fileArray.length === 0) return
  
  previews.value = fileArray.map(file => ({
    url: URL.createObjectURL(file),
    file
  }))
  previews.value.sort((a, b) => a.file.name.localeCompare(b.file.name, undefined, { numeric: true }))
}

const handleDrop = (e: DragEvent) => {
  dragActive.value = false
  const files = Array.from(e.dataTransfer?.files || [])
  if (files.length > 0) {
    uploadFiles.value = files
    handleFileSelect(files)
  }
}

const clearPreviews = () => {
  previews.value.forEach(preview => URL.revokeObjectURL(preview.url))
  previews.value = []
  uploadFiles.value = []
}

const handleUpload = async () => {
  if (!canUpload.value) return
  uploading.value = true
  uploadProgress.value = 0
  
  try {
    let mangaId = uploadData.manga_id
    const token = getAuthHeaders().Authorization

    if (uploadMode.value === 'new') {
      const mangaResult = await $fetch('/api/admin/manga', {
        method: 'POST',
        headers: { Authorization: token },
        body: { ...newMangaData, genres: newMangaData.genres.join(',') }
      }) as any
      mangaId = mangaResult.id
      uploadProgress.value = 20
    }
    
    const fd = new FormData()
    uploadFiles.value.forEach(file => {
        fd.append('images', file)
    })
    
    uploadProgress.value = 30
    
    const uploadResult = await $fetch('/api/admin/upload-images', {
      method: 'POST',
      headers: { Authorization: token },
      body: fd,
    }) as any
    
    uploadProgress.value = 70
    
    await $fetch('/api/admin/chapters', {
      method: 'POST',
      headers: { Authorization: token },
      body: {
        mangaId: mangaId,
        chapterNumber: uploadData.chapter_number,
        title: uploadData.chapter_title || null,
        pages: uploadResult.urls // Backend expects array of strings, it handles JSON.stringify itself or readBody handles it
      }
    })
    uploadProgress.value = 100
    
    await alert.success('อัปโหลดสำเร็จ!', `อัปโหลด ${uploadFiles.value.length} รูปภาพสำเร็จ`)
    adminStore.closeUploadDialog()
    clearPreviews()
    // Refresh manga list? Maybe emit event or use store? 
    // For now simple refresh is acceptable, or let other pages refetch.
  } catch (error: any) {
    console.error('Upload error:', error)
    const errorMsg = error.data?.message || error.message || 'ไม่สามารถอัปโหลดได้'
    await alert.error('เกิดข้อผิดพลาด', `${errorMsg} (${error.statusCode || 'Unknown'})`)
  }
  uploading.value = false
}
</script>

<style scoped>
.dropzone {
  border: 2px dashed rgb(var(--v-theme-primary));
  background: rgb(var(--v-theme-surface-variant));
  transition: all 0.3s;
}
.dropzone-active {
  border-color: rgb(var(--v-theme-secondary));
  background: rgba(var(--v-theme-secondary), 0.1);
}
.preview-card {
  transition: transform 0.2s;
}
.preview-card:hover {
  transform: scale(1.05);
}
</style>
