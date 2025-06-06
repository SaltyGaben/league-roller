<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import RandomizerItem from './components/RandomizerItem.vue'
import { onMounted } from 'vue'
import { useRiotAssets } from '@/composables/useRiotAssets'
import { Analytics } from '@vercel/analytics/nuxt'

const mode = useColorMode()

const { fetchAssets } = useRiotAssets()

mode.value = 'dark'

onMounted(() => {
  fetchAssets()
})
</script>

<template>
  <div class="min-h-screen bg-cyber p-8">
    <Analytics />
    <div class="flex flex-col justify-center items-center">
      <h1 class="text-foreground text-7xl font-bold">League Roller</h1>
      <p class="text-muted-foreground text-xl font-bold mt-4">
        A League of Legends randomiser to create a little spice
      </p>
    </div>
    <div class="flex flex-col justify-center items-center mt-16">
      <RandomizerItem />
    </div>
  </div>
</template>
