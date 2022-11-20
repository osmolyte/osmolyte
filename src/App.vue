<template>
  <Suspense>
    <router-view></router-view>

    <template #fallback>
      Loading...
    </template>
  </Suspense>
</template>

<script setup lang="ts">
</script>
