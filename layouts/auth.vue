<template>
  <v-app>
    <NavBar />
    <v-main>
      <slot />
    </v-main>
    <Footer />
  </v-app>
</template>

<script setup lang="ts">
// Auth layout without NavBar and Footer
// Used for: Login, Register, Admin Login
</script>
