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
// Default layout with NavBar and Footer
// Used for: Home, Browse Manga, Manga Detail, User Dashboard
</script>
