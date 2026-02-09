<template>
  <v-container fluid>
    <v-card>
      <v-card-title>จัดการผู้ใช้งาน</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="userHeaders"
          :items="userList"
          :loading="loading"
        >
          <template #[`item.role`]="{ item }">
            <v-chip :color="item.role === 'admin' ? 'error' : 'primary'" size="small">
              {{ item.role }}
            </v-chip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const loading = ref(false)

const userList = ref<any[]>([
    { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin' },
    { id: 2, username: 'user1', email: 'user1@example.com', role: 'user' },
    // TODO: Fetch real users from API
])

const userHeaders = [
    { title: 'ID', key: 'id' },
    { title: 'Username', key: 'username' },
    { title: 'Email', key: 'email' },
    { title: 'Role', key: 'role' },
]

useHead({
  title: 'จัดการผู้ใช้งาน - Admin'
})
</script>
