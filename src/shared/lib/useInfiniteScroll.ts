import { onBeforeUnmount, onMounted, Ref, ref } from "vue";

type Params<T> = {
  entitiesPerPage: number;
  fetchEntities: (page: number, amount: number) => Promise<T[]>;
  sentinel: Ref<Element | undefined>;
  scrollContainer?: Ref<Element | undefined>;
};

function useInfiniteScroll<T>({
  entitiesPerPage,
  fetchEntities,
  scrollContainer,
  sentinel,
}: Params<T>) {
  const list = ref<T[]>([]) as Ref<T[]>;
  const isLoading = ref(false);
  const page = ref(1);
  const canLoadMore = ref(true);
  const initialLoading = ref(true);
  const observer = ref<IntersectionObserver>();

  function initializeIntersectionObserver() {
    const options = {
      root: scrollContainer?.value ?? null,
      rootMargin: "200px",
    };

    observer.value = new IntersectionObserver(handleIntersection, options);
    if (sentinel.value) observer.value.observe(sentinel.value);
  }

  function handleIntersection(entries: IntersectionObserverEntry[]) {
    // There is a running process for loading more entities already
    if (isLoading.value) return;

    // We can't get new entities from the API anymore
    if (!canLoadMore.value) return;

    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        isLoading.value = true; // we should avoid to have several requests in parallel
        loadMore();
      }
    });
  }

  async function loadMore() {
    try {
      const items = await fetchEntities(page.value, entitiesPerPage);
      page.value++;
      list.value.push(...items);

      // If API can't give us anymore elements
      if (items.length === 0) {
        canLoadMore.value = false;
      }
    } catch (err) {
      console.warn("Load Error: ", err);
      canLoadMore.value = false;
    } finally {
      isLoading.value = false;
    }
  }

  onMounted(async () => {
    // Initial first items loading
    await loadMore();
    initialLoading.value = false;

    // Setup intersection observer
    initializeIntersectionObserver();
  });

  onBeforeUnmount(() => {
    // Clear intersection observer before unmount
    observer.value?.disconnect();
  });

  return {
    list,
    isLoading,
    canLoadMore,
    initialLoading,
  };
}

export { useInfiniteScroll };
