<template>
  <div class="card">
    <img :src="person.picture.medium" alt="Avatar" class="avatar" />
    <span>{{ fullName }}</span>
    <span>{{ person.email }}</span>
  </div>
</template>

<script setup lang="ts">
import type { Person } from "../model/person.ts";
import { computed } from "vue";

const props = defineProps<{
  person: Person;
}>();

const fullName = computed(
  () =>
    `${props.person.name.title} ${props.person.name.first} ${props.person.name.last}`,
);
</script>

<style scoped>
.card {
  padding: 10px;
  background-color: #fff;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  overflow: hidden;
  border-radius: 2rem;
  box-shadow: 0 1rem 1.5rem rgba(0, 0, 0, 0.5);
}

.avatar {
  width: 8rem;
  height: 8rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.3);
  border-radius: 50%;
}
</style>
