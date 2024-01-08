<template>
  <div class="persons-list">
    <LoaderSimple v-if="initialLoading" text="initial loading..." />

    <div
      class="scroll-container"
      ref="scrollContainer"
      v-show="!initialLoading"
    >
      <div class="list-container">
        <person-card
          v-for="person in list"
          :key="person.email"
          :person="person"
          class="list-item"
        />
      </div>

      <div class="sentinel" ref="sentinel" />

      <LoaderSimple v-if="canLoadMore" text="loading..." />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { fetchPersons, PersonCard } from "../../entities/person";
import { LoaderSimple } from "../../shared/ui/loader-simple";
import { useInfiniteScroll } from "../../shared/lib/useInfiniteScroll.ts";

const scrollContainer = ref();
const sentinel = ref();

const { list, canLoadMore, initialLoading } = useInfiniteScroll({
  entitiesPerPage: 10,
  fetchEntities: fetchPersons,
  sentinel,
  scrollContainer,
});
</script>

<style scoped>
.scroll-container {
  height: 100%;
  overflow-y: scroll;
}

.sentinel {
  height: 0;
}

.list-item {
  margin-bottom: 25px;
}
</style>
