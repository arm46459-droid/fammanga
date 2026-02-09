<template>
  <div class="login-page d-flex align-center justify-center">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="8" md="5" lg="4">
          <v-card elevation="12" rounded="lg" class="pa-8 glass">
            <div class="text-center mb-8">
              <h1 class="text-h4 font-weight-bold gradient-text">เข้าสู่ระบบ</h1>
              <p class="text-subtitle-1 mt-2">ยินดีต้อนรับกลับ!</p>
            </div>

            <v-form ref="formRef" @submit.prevent="handleLogin">
              <v-text-field
                v-model="username"
                label="ชื่อผู้ใช้หรืออีเมล"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                :rules="[rules.required]"
                color="primary"
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
                color="primary"
                @click:append-inner="showPassword = !showPassword"
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
                <v-icon start>mdi-login</v-icon>
                เข้าสู่ระบบ
              </v-btn>

              <div class="text-center">
                <p class="text-body-2">
                  ยังไม่มีบัญชี?
                  <NuxtLink to="/register" class="text-primary text-decoration-none font-weight-bold">
                    สมัครสมาชิก
                  </NuxtLink>
                </p>
                <p class="text-body-2 mt-2">
                  <NuxtLink to="/admin/login" class="text-secondary text-decoration-none">
                    Admin Login
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
  title: 'เข้าสู่ระบบ - FAM Manga',
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  /* background: linear-gradient(135deg, #E91E63 0%, #9C27B0 100%); */
  position: relative;
}

.login-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at top right, rgba(255, 255, 255, 0.1), transparent),
              radial-gradient(circle at bottom left, rgba(255, 255, 255, 0.1), transparent);
}
</style>
