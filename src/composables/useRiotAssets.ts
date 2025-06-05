import { readonly, ref, computed, type Ref } from 'vue'
import type { Champion, Item, Rune, SummonerSpell } from '@/types/Randomizer'

interface CacheData {
  version: string
  champions: Record<string, Champion>
  items: Record<string, Item>
  summonerSpells: Record<string, SummonerSpell>
  runes: Rune[]
}

interface CacheEntry {
  data: CacheData
  timestamp: number
}

// Global shared state - created once outside the composable
const version: Ref<string> = ref('')
const champions: Ref<Record<string, Champion>> = ref({})
const items: Ref<Record<string, Item>> = ref({})
const summonerSpells: Ref<Record<string, SummonerSpell>> = ref({})
const runes: Ref<Rune[]> = ref([])
const loading: Ref<boolean> = ref(false)
const error: Ref<string | null> = ref(null)

export const useRiotAssets = () => {
  const isReady = computed(() => {
    const championsCount = Object.keys(champions.value).length
    const itemsCount = Object.keys(items.value).length
    const summonerSpellsCount = Object.keys(summonerSpells.value).length
    const runesCount = runes.value.length

    const ready = championsCount > 0 && itemsCount > 0 && summonerSpellsCount > 0 && runesCount > 0

    return ready
  })

  const CACHE_DURATION = 1000 * 60 * 60 * 24 * 7 // 1 week (fallback only)
  const STORAGE_KEY = 'lol-assets-cache'
  const DDRAGON_BASE = 'https://ddragon.leagueoflegends.com'

  const loadFromCache = (): CacheData | null => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY)
      if (cached) {
        const { data, timestamp }: CacheEntry = JSON.parse(cached)
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data
        }
      }
    } catch (err) {
      console.warn('Failed to load from cache:', err)
    }
    return null
  }

  const saveToCache = (data: CacheData): void => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        } as CacheEntry),
      )
    } catch (err) {
      console.warn('Failed to save to cache:', err)
    }
  }

  const fetchAssets = async (): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      // Always get latest version first
      const versionRes = await fetch(`${DDRAGON_BASE}/api/versions.json`)
      const versions: string[] = await versionRes.json()
      const latestVersion = versions[0]

      // Check cache and compare versions
      const cached = loadFromCache()

      if (cached && cached.version === latestVersion) {
        // Use cached data if version matches
        version.value = cached.version
        champions.value = cached.champions
        items.value = cached.items
        summonerSpells.value = cached.summonerSpells
        runes.value = cached.runes
        loading.value = false
        return
      }

      // Version differs or no cache - fetch new data
      version.value = latestVersion

      // Fetch all data in parallel
      const [champRes, itemsRes, spellsRes, runesRes] = await Promise.all([
        fetch(`${DDRAGON_BASE}/cdn/${version.value}/data/en_US/champion.json`),
        fetch(`${DDRAGON_BASE}/cdn/${version.value}/data/en_US/item.json`),
        fetch(`${DDRAGON_BASE}/cdn/${version.value}/data/en_US/summoner.json`),
        fetch(`${DDRAGON_BASE}/cdn/${version.value}/data/en_US/runesReforged.json`),
      ])

      if (!champRes.ok || !itemsRes.ok || !spellsRes.ok || !runesRes.ok) {
        throw new Error('Failed to fetch game data')
      }

      // Parse responses
      const [champData, itemsData, spellsData, runesData] = await Promise.all([
        champRes.json(),
        itemsRes.json(),
        spellsRes.json(),
        runesRes.json(),
      ])

      champions.value = champData.data

      // Process items to add id property
      const processedItems: Record<string, Item> = {}
      Object.entries(itemsData.data).forEach(([itemId, item]) => {
        processedItems[itemId] = { ...(item as Omit<Item, 'id'>), id: itemId }
      })
      items.value = processedItems

      summonerSpells.value = spellsData.data
      runes.value = runesData

      // Cache the results
      saveToCache({
        version: version.value,
        champions: champions.value,
        items: items.value,
        summonerSpells: summonerSpells.value,
        runes: runes.value,
      })
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('Failed to fetch assets:', err)
    } finally {
      loading.value = false
    }
  }

  // Icon getters
  const getChampionIcon = (championId: string): string =>
    `${DDRAGON_BASE}/cdn/${version.value}/img/champion/${championId}`

  const getItemIcon = (itemImage: string): string =>
    `${DDRAGON_BASE}/cdn/${version.value}/img/item/${itemImage}`

  const getSummonerSpellIcon = (spellImage: string): string =>
    `${DDRAGON_BASE}/cdn/${version.value}/img/spell/${spellImage}`

  const getRuneTreeIcon = (iconPath: string): string => `${DDRAGON_BASE}/cdn/img/${iconPath}`

  // Helper functions
  const getChampionsList = (): Champion[] => Object.values(champions.value)

  const getItemsList = (): Item[] => Object.values(items.value)

  const getSummonerSpellsList = (): SummonerSpell[] => Object.values(summonerSpells.value)

  const getRunesList = (): Rune[] => runes.value

  return {
    // State
    version: readonly(version),
    champions: readonly(champions),
    items: readonly(items),
    summonerSpells: readonly(summonerSpells),
    runes: readonly(runes),
    loading: readonly(loading),
    error: readonly(error),
    isReady: readonly(isReady),

    // Actions
    fetchAssets,

    // Asset getters
    getChampionIcon,
    getItemIcon,
    getSummonerSpellIcon,
    getRuneTreeIcon,

    // List helpers
    getChampionsList,
    getItemsList,
    getSummonerSpellsList,
    getRunesList,
  }
}
