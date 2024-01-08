<template>
  <h1 class="page-title">Best employees of the month</h1>
  <PersonsList />
</template>

<script setup lang="ts">
import { PersonsList } from "../widgets/persons-list";
</script>

<style scoped>
.page-title {
  text-align: center;
  margin-bottom: 2em;
}
</style>
