<template>
  <div class="register-page d-flex align-center justify-center">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6" lg="5">
          <v-card elevation="12" rounded="lg" class="pa-8 glass">
            <div class="text-center mb-8">
              <h1 class="text-h4 font-weight-bold gradient-text">สมัครสมาชิก</h1>
              <p class="text-subtitle-1 mt-2">เริ่มต้นการผจญภัยกับเรา</p>
            </div>

            <v-form ref="formRef" @submit.prevent="handleRegister">
              <v-text-field
                v-model="formData.username"
                label="ชื่อผู้ใช้"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                :rules="[rules.required, rules.username]"
                color="primary"
                class="mb-4"
              />

              <v-text-field
                v-model="formData.email"
                label="อีเมล"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                :rules="[rules.required, rules.email]"
                color="primary"
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
                color="primary"
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
                color="primary"
                @click:append-inner="showConfirmPassword = !showConfirmPassword"
                class="mb-6"
              />

              <v-btn
                type="submit"
                block
                size="large"
                color="primary"
                variant="flat"
                :loading="loading"
                rounded="lg"
                class="mb-4"
              >
                <v-icon start>mdi-account-plus</v-icon>
                สมัครสมาชิก
              </v-btn>

              <div class="text-center">
                <p class="text-body-2">
                  มีบัญชีอยู่แล้ว?
                  <NuxtLink to="/login" class="text-primary text-decoration-none font-weight-bold">
                    เข้าสู่ระบบ
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

const { register } = useAuth()

const formRef = ref()
const formData = reactive({
  username: '',
  email: '',
  password: '',
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
  await register(formData)
  loading.value = false
}

useHead({
  title: 'สมัครสมาชิก - FAM Manga',
})
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  /* background: linear-gradient(135deg, #9C27B0 0%, #E91E63 100%); */
  position: relative;
}

.register-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at top left, rgba(255, 255, 255, 0.1), transparent),
              radial-gradient(circle at bottom right, rgba(255, 255, 255, 0.1), transparent);
}
</style>
