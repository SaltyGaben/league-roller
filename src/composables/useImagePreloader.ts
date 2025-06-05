import type { Champion } from '@/types/Randomizer'
import { readonly, ref } from 'vue'
import { useRiotAssets } from './useRiotAssets'

export const useImagePreloader = () => {
  const loadedImages = ref(new Set<string>())
  const loadingImages = ref(new Set<string>())

  const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (loadedImages.value.has(src)) {
        resolve()
        return
      }

      if (loadingImages.value.has(src)) {
        // Wait for existing load to complete
        const checkLoaded = setInterval(() => {
          if (loadedImages.value.has(src)) {
            clearInterval(checkLoaded)
            resolve()
          }
        }, 50)
        return
      }

      loadingImages.value.add(src)

      const img = new Image()
      img.onload = () => {
        loadedImages.value.add(src)
        loadingImages.value.delete(src)
        resolve()
      }
      img.onerror = () => {
        loadingImages.value.delete(src)
        reject(new Error(`Failed to load image: ${src}`))
      }
      img.src = src
    })
  }

  const preloadChampionIcons = async (champions: Champion[]): Promise<void> => {
    const { getChampionIcon } = useRiotAssets()

    const promises = champions.map((champion) => preloadImage(getChampionIcon(champion.image.full)))

    try {
      await Promise.allSettled(promises)
    } catch (error) {
      console.warn('Some champion icons failed to preload:', error)
    }
  }

  return {
    preloadImage,
    preloadChampionIcons,
    loadedImages: readonly(loadedImages),
  }
}
