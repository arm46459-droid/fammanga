<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>จัดการมังงะ</span>
        <div class="d-flex ga-2">
          <v-btn color="secondary" variant="outlined" @click="adminStore.openUploadDialog()">
            <v-icon start>mdi-cloud-upload</v-icon>
            อัปโหลดตอน
          </v-btn>
          <v-btn color="primary" @click="openAddDialog">
            <v-icon start>mdi-plus</v-icon>
            เพิ่มมังงะใหม่
          </v-btn>
        </div>
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="ค้นหา"
          variant="outlined"
          density="compact"
          hide-details
          class="mb-4"
        />

        <v-data-table
          :headers="headers"
          :items="mangaList"
          :search="search"
          :loading="loading"
          items-per-page="10"
        >
          <template #[`item.cover_image`]="{ item }">
            <v-img
              :src="item.cover_image"
              width="50"
              height="70"
              cover
              class="my-2"
            />
          </template>

          <template #[`item.status`]="{ item }">
            <v-chip :color="getStatusColor(item.status)" size="small">
              {{ getStatusText(item.status) }}
            </v-chip>
          </template>

          <template #[`item.actions`]="{ item }">
            <v-btn
              icon="mdi-pencil"
              size="small"
              variant="text"
              @click="editManga(item)"
            />
            <v-btn
              icon="mdi-delete"
              size="small"
              variant="text"
              color="error"
              @click="confirmDelete(item)"
            />
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          {{ editingManga ? 'แก้ไขมังงะ' : 'เพิ่มมังงะใหม่' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="formRef">
            <v-text-field
              v-model="formData.title"
              label="ชื่อมังงะ (ไทย)"
              variant="outlined"
              required
            />
            <v-text-field
              v-model="formData.title_en"
              label="ชื่อมังงะ (อังกฤษ)"
              variant="outlined"
            />
            <v-text-field
              v-model="formData.author"
              label="ผู้แต่ง"
              variant="outlined"
            />
            <v-textarea
              v-model="formData.description"
              label="เรื่องย่อ"
              variant="outlined"
              rows="3"
            />
            <v-text-field
              v-model="formData.cover_image"
              label="URL รูปปก"
              variant="outlined"
            />
            <v-select
              v-model="formData.status"
              :items="statusOptions"
              label="สถานะ"
              variant="outlined"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialog = false">ยกเลิก</v-btn>
          <v-btn color="primary" variant="flat" @click="saveManga" :loading="saving">
            บันทึก
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { useAdminStore } from '~/stores/admin'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const { getAuthHeaders } = useAuth()
const alert = useAlert()
const adminStore = useAdminStore()

const loading = ref(false)
const saving = ref(false)
const search = ref('')
const dialog = ref(false)
const editingManga = ref<any>(null)
const mangaList = ref<any[]>([])

const formData = reactive({
  title: '',
  title_en: '',
  author: '',
  description: '',
  cover_image: '',
  status: 'ongoing',
})

const headers = [
  { title: 'ปก', key: 'cover_image', sortable: false },
  { title: 'ชื่อ', key: 'title' },
  { title: 'ผู้แต่ง', key: 'author' },
  { title: 'สถานะ', key: 'status' },
  { title: 'ตอน', key: 'total_chapters' },
  { title: 'การกระทำ', key: 'actions', sortable: false },
]

const statusOptions = [
  { title: 'ยังไม่จบ', value: 'ongoing' },
  { title: 'จบแล้ว', value: 'completed' },
  { title: 'พักการออก', value: 'hiatus' },
]

const getStatusColor = (status: string) => {
  const map: Record<string, string> = {
    ongoing: 'success',
    completed: 'info',
    hiatus: 'warning',
  }
  return map[status] || 'default'
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    ongoing: 'ยังไม่จบ',
    completed: 'จบแล้ว',
    hiatus: 'พักการออก',
  }
  return map[status] || status
}

const openAddDialog = () => {
  editingManga.value = null
  Object.assign(formData, {
    title: '',
    title_en: '',
    author: '',
    description: '',
    cover_image: '',
    status: 'ongoing',
  })
  dialog.value = true
}

const editManga = (manga: any) => {
  editingManga.value = manga
  Object.assign(formData, manga)
  dialog.value = true
}

const saveManga = async () => {
  saving.value = true

  try {
    if (editingManga.value) {
      await $fetch(`/api/admin/manga/${editingManga.value.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: formData,
      })
      await alert.success('อัปเดตสำเร็จ')
    } else {
      await $fetch('/api/admin/manga', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
      })
      await alert.success('เพิ่มมังงะสำเร็จ')
    }

    dialog.value = false
    loadManga()
  } catch (error: any) {
    await alert.error('เกิดข้อผิดพลาด', error.data?.statusMessage || 'ไม่สามารถบันทึกได้')
  }

  saving.value = false
}

const confirmDelete = async (manga: any) => {
  const result = await alert.confirm(
    'ยืนยันการลบ',
    `คุณต้องการลบมังงะ "${manga.title}" ใช่หรือไม่?`
  )

  if (result.isConfirmed) {
    try {
      await $fetch(`/api/admin/manga/${manga.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      await alert.success('ลบสำเร็จ')
      loadManga()
    } catch (error) {
      await alert.error('เกิดข้อผิดพลาด', 'ไม่สามารถลบได้')
    }
  }
}

const loadManga = async () => {
  loading.value = true
  try {
    const result = await $fetch('/api/manga')
    if (result?.data) {
      mangaList.value = result.data
    }
  } catch (error) {
    console.error('Load manga error:', error)
  }
  loading.value = false
}

onMounted(() => {
  loadManga()
})

useHead({
  title: 'จัดการมังงะ - Admin'
})
</script>
