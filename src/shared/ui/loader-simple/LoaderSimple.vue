<template>
  <div class="loader-root">{{ text ?? "loading..." }}</div>
</template>

<script setup lang="ts">
defineProps<{
  text?: string;
}>();
</script>

<style scoped>
.loader-root {
  text-align: center;
}
</style>
