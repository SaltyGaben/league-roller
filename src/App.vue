<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import RandomizerItem from './components/RandomizerItem.vue'
import { onMounted } from 'vue'
import { useRiotAssets } from '@/composables/useRiotAssets'

const mode = useColorMode()

const { fetchAssets } = useRiotAssets()

mode.value = 'dark'

onMounted(() => {
  fetchAssets()
})
</script>

<template>
  <div class="min-h-screen bg-cyber p-8">
    <div class="flex flex-col justify-center items-center">
      <h1 class="text-foreground text-7xl font-bold">League Roller</h1>
      <p class="text-muted-foreground text-xl font-bold mt-4">
        Mix up your League games with random champions, items, and runes every time!
      </p>
    </div>
    <div class="flex flex-col justify-center items-center mt-16 w-full max-w-screen-lg mx-auto">
      <RandomizerItem />
    </div>
  </div>
</template>
