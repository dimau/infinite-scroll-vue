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
import { onMounted, onBeforeUnmount, ref } from "vue";
import { PersonCard, type Person, fetchPersons } from "../../entities/person";
import { LoaderSimple } from "../../shared/ui/loader-simple";

const scrollContainer = ref();
const sentinel = ref();

const list = ref<Person[]>([]);
const isLoadingMore = ref(false);
const canLoadMore = ref(true);
const initialLoading = ref(true);
const pageNumber = ref(1);
const pageCount = ref(10);
const listEndObserver = ref<IntersectionObserver>();

function initializeIntersectionObserver() {
  const options = {
    // root: scrollContainer.value,
    root: null,
    rootMargin: "200px",
  };

  listEndObserver.value = new IntersectionObserver(handleIntersection, options);
  listEndObserver.value.observe(sentinel.value);
}

function handleIntersection(entries: IntersectionObserverEntry[]) {
  entries.forEach((entry) => {
    if (entry.isIntersecting && canLoadMore.value && !isLoadingMore.value) {
      loadMore();
    }
  });
}

async function loadMore() {
  isLoadingMore.value = true;

  let items = await fetchPersons(pageNumber.value, pageCount.value);
  pageNumber.value++;
  list.value.push(...items);

  // If API can't give us anymore elements
  if (items.length === 0) {
    canLoadMore.value = false;
  }

  isLoadingMore.value = false;
}

onMounted(async () => {
  // Initial first items loading
  const newItems = await fetchPersons(pageNumber.value, pageCount.value);
  list.value.push(...newItems);
  pageNumber.value++;
  initialLoading.value = false;

  // Setup intersection observer
  initializeIntersectionObserver();
});

onBeforeUnmount(() => {
  // Clear intersection observer before unmount
  listEndObserver.value?.disconnect();
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
