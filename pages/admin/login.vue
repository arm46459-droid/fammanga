<template>
  <div class="admin-login-page d-flex align-center justify-center">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="8" md="5" lg="4">
          <v-card elevation="12" rounded="lg" class="pa-8 glass-dark">
            <div class="text-center mb-8">
              <v-icon size="64" color="secondary" class="mb-4">mdi-shield-account</v-icon>
              <h1 class="text-h4 font-weight-bold gradient-text">Admin Login</h1>
              <p class="text-subtitle-1 mt-2 text-medium-emphasis">ระบบจัดการเนื้อหา</p>
            </div>

            <v-alert
              color="warning"
              variant="tonal"
              icon="mdi-alert"
              class="mb-6"
            >
              <div class="text-caption">
                เฉพาะผู้ดูแลระบบเท่านั้น<br>
                การเข้าสู่ระบบนี้จะถูกบันทึกไว้
              </div>
            </v-alert>

            <v-form ref="formRef" @submit.prevent="handleLogin">
              <v-text-field
                v-model="username"
                label="ชื่อผู้ดูแลระบบ"
                prepend-inner-icon="mdi-account-key"
                variant="outlined"
                :rules="[rules.required]"
                color="secondary"
                class="mb-4"
              />

              <v-text-field
                v-model="password"
                label="รหัสผ่าน"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                :rules="[rules.required]"
                color="secondary"
                @click:append-inner="showPassword = !showPassword"
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
                <v-icon start>mdi-shield-check</v-icon>
                เข้าสู่ระบบ
              </v-btn>

              <div class="text-center">
                <p class="text-body-2 mb-2">
                  ต้องการสมัครผู้ดูแลระบบ?
                  <NuxtLink to="/admin/register" class="text-secondary text-decoration-none font-weight-bold">
                    ลงทะเบียนที่นี่
                  </NuxtLink>
                </p>
                <p class="text-body-2">
                  <NuxtLink to="/login" class="text-primary text-decoration-none">
                    ← กลับไปหน้าล็อกอินทั่วไป
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

const { login } = useAuth()

const formRef = ref()
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)

const rules = {
  required: (value: string) => !!value || 'กรุณากรอกข้อมูล',
}

const handleLogin = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  await login({
    username: username.value,
    password: password.value,
  })
  loading.value = false
}

useHead({
  title: 'Admin Login - FAM Manga',
})
</script>

<style scoped>
.admin-login-page {
  min-height: 100vh;
  /* background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); */
  position: relative;
}

.admin-login-page::before {
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
