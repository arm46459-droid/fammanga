<template>
  <div class="admin-register-page d-flex align-center justify-center">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" sm="8" md="6" lg="5">
            <v-card elevation="12" rounded="lg" class="pa-8 glass-dark">
              <div class="text-center mb-8">
                <v-icon size="64" color="secondary" class="mb-4">mdi-shield-plus</v-icon>
                <h1 class="text-h4 font-weight-bold gradient-text">Admin Register</h1>
                <p class="text-subtitle-1 mt-2 text-medium-emphasis">สร้างบัญชีผู้ดูแลระบบ</p>
              </div>

              <v-form ref="formRef" @submit.prevent="handleRegister">
                <v-text-field
                  v-model="formData.username"
                  label="ชื่อผู้ใช้"
                  prepend-inner-icon="mdi-account"
                  variant="outlined"
                  :rules="[rules.required, rules.username]"
                  color="secondary"
                  class="mb-4"
                />

                <v-text-field
                  v-model="formData.email"
                  label="อีเมล"
                  prepend-inner-icon="mdi-email"
                  variant="outlined"
                  :rules="[rules.required, rules.email]"
                  color="secondary"
                  class="mb-4"
                />

                <v-text-field
                  v-model="formData.password"
                  label="รหัสผ่าน"
                  prepend-inner-icon="mdi-lock"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  variant="outlined"
                  :rules="[rules.required, rules.password]"
                  color="secondary"
                  @click:append-inner="showPassword = !showPassword"
                  class="mb-4"
                />

                <v-text-field
                  v-model="confirmPassword"
                  label="ยืนยันรหัสผ่าน"
                  prepend-inner-icon="mdi-lock-check"
                  :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  variant="outlined"
                  :rules="[rules.required, rules.confirmPassword]"
                  color="secondary"
                  @click:append-inner="showConfirmPassword = !showConfirmPassword"
                  class="mb-6"
                />

                <!-- Secret Key Field -->
                 <v-alert
                  color="warning"
                  variant="tonal"
                  icon="mdi-key-variant"
                  class="mb-4"
                >
                  <div class="text-caption">
                    ต้องใช้รหัสลับ (Secret Key) เพื่อยืนยันตัวตน
                  </div>
                </v-alert>

                <v-text-field
                  v-model="formData.adminKey"
                  label="Admin Secret Key"
                  prepend-inner-icon="mdi-key"
                  variant="outlined"
                  :rules="[rules.required]"
                  color="error"
                  class="mb-6"
                />

                <v-btn
                  type="submit"
                  block
                  size="large"
                  color="secondary"
                  variant="flat"
                  :loading="loading"
                  rounded="lg"
                  class="mb-4"
                >
                  <v-icon start>mdi-account-plus</v-icon>
                  สมัครผู้ดูแลระบบ
                </v-btn>

                <div class="text-center">
                  <p class="text-body-2">
                    <NuxtLink to="/admin/login" class="text-secondary text-decoration-none">
                      ← กลับไปหน้าเข้าสู่ระบบ Admin
                    </NuxtLink>
                  </p>
                </div>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const { registerAdmin } = useAuth()

const formRef = ref()
const formData = reactive({
  username: '',
  email: '',
  password: '',
  adminKey: ''
})
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)

const rules = {
  required: (value: string) => !!value || 'กรุณากรอกข้อมูล',
  username: (value: string) => {
    if (value.length < 3) return 'ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร'
    if (value.length > 50) return 'ชื่อผู้ใช้ต้องไม่เกิน 50 ตัวอักษร'
    return true
  },
  email: (value: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || 'รูปแบบอีเมลไม่ถูกต้อง'
  },
  password: (value: string) => {
    if (value.length < 6) return 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
    return true
  },
  confirmPassword: (value: string) => {
    return value === formData.password || 'รหัสผ่านไม่ตรงกัน'
  },
}

const handleRegister = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  await registerAdmin(formData)
  loading.value = false
}

useHead({
  title: 'Admin Register - FAM Manga',
})
</script>

<style scoped>
.admin-register-page {
  min-height: 100vh;
  /* background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); */
  position: relative;
}

.admin-register-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(156, 39, 176, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(156, 39, 176, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 20s linear infinite;
}

@keyframes gridMove {
  0% { background-position: 0 0; }
  100% { background-position: 50px 50px; }
}
</style>
