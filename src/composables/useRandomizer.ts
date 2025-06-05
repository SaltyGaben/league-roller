import { useRiotAssets } from '@/composables/useRiotAssets'
import type { Lane, RandomizedResult, RandomizerSettings } from '@/types/Randomizer'

export const useRandomizer = () => {
  const {
    getChampionsList,
    getItemsList,
    getSummonerSpellsList,
    getRunesList,
    getChampionIcon,
    getItemIcon,
    getSummonerSpellIcon,
    getRuneTreeIcon,
  } = useRiotAssets()

  // Mapping of game modes to their corresponding map IDs
  const modeToMapId: Record<string, number> = {
    CLASSIC: 11, // Summoner's Rift
    ARAM: 12, // Howling Abyss
    BRAWL: 35, // Brawl
    ARENA: 30, // Arena (2v2v2v2)
  }

  const nonAllowedTags: string[] = ['Consumable', 'Trinket']

  const nonAllowedItemId: string[] = [
    '3600',
    '3599',
    '3902',
    '3901',
    '3903',
    '3330',
    '1508',
    '1509',
    '1510',
    '1511',
    '1512',
    '1515',
    '1516',
    '1521',
    '1522',
    '1523',
    '1503',
    '3865',
    '3866',
    '3011',
    '7050',
  ]

  const supportItemIds: string[] = ['3877', '3876', '3871', '3870', '3869']

  // Available lanes
  const lanes: Lane[] = [
    {
      name: 'Top',
      id: 'TOP',
      image: {
        full: 'https://ddragon.leagueoflegends.com/cdn/13.1.1/img/map/map11.png',
        group: 'map',
        sprite: 'map11.png',
        h: 100,
        w: 100,
        x: 0,
        y: 0,
      },
    },
    {
      name: 'Jungle',
      id: 'JUNGLE',
      image: {
        full: 'https://ddragon.leagueoflegends.com/cdn/13.1.1/img/map/map12.png',
        group: 'map',
        sprite: 'map12.png',
        h: 100,
        w: 100,
        x: 0,
        y: 0,
      },
    },
    {
      name: 'Mid',
      id: 'MIDDLE',
      image: {
        full: 'https://ddragon.leagueoflegends.com/cdn/13.1.1/img/map/map13.png',
        group: 'map',
        sprite: 'map13.png',
        h: 100,
        w: 100,
        x: 0,
        y: 0,
      },
    },
    {
      name: 'Bot (ADC)',
      id: 'BOTTOM',
      image: {
        full: 'https://ddragon.leagueoflegends.com/cdn/13.1.1/img/map/map14.png',
        group: 'map',
        sprite: 'map14.png',
        h: 100,
        w: 100,
        x: 0,
        y: 0,
      },
    },
    {
      name: 'Support',
      id: 'UTILITY',
      image: {
        full: 'https://ddragon.leagueoflegends.com/cdn/13.1.1/img/map/map15.png',
        group: 'map',
        sprite: 'map15.png',
        h: 100,
        w: 100,
        x: 0,
        y: 0,
      },
    },
  ]

  const getRandomItems = (settings: RandomizerSettings) => {
    const items = getItemsList()

    // Get the map ID for the selected mode
    const requiredMapId = modeToMapId[settings.mode]

    // Filter items based on map compatibility and ensure only completed items
    let filteredItems = items

    filteredItems = items.filter(
      (item) =>
        // Check if maps exists and if the required map is available (maps is an object with map IDs as keys)
        item.maps[requiredMapId] === true &&
        (!item.into || item.into.length === 0) &&
        !item.tags.some((tag) => nonAllowedTags.includes(tag)) &&
        !nonAllowedItemId.includes(item.id) &&
        Number(item.id) > 2000 &&
        !item.consumed,
    )

    const shuffled = [...filteredItems].sort(() => Math.random() - 0.5)
    const selectedItems = shuffled.slice(0, settings.amountOfItems ?? 0)

    // Ensure only one support item and only one boots item are selected
    let currentSelection = [...selectedItems]

    // Handle support items
    const supportItems = currentSelection.filter((item) => supportItemIds.includes(item.id))

    if (supportItems.length > 1) {
      // Keep only one support item (the first one)
      const keptSupportItem = supportItems[0]
      const excessSupportCount = supportItems.length - 1
      const nonSupportItems = currentSelection.filter((item) => !supportItemIds.includes(item.id))

      // Get non-support items from the remaining pool to replace excess support items
      const remainingNonSupportItems = filteredItems.filter(
        (item) =>
          !supportItemIds.includes(item.id) &&
          !currentSelection.some((selected) => selected.id === item.id),
      )

      // Shuffle and take the needed amount
      const shuffledRemaining = [...remainingNonSupportItems].sort(() => Math.random() - 0.5)
      const replacementItems = shuffledRemaining.slice(0, excessSupportCount)

      // Update current selection
      currentSelection = [...nonSupportItems, keptSupportItem, ...replacementItems]
    }

    // Handle boots items
    const bootsItems = currentSelection.filter((item) => item.tags.includes('Boots'))

    if (bootsItems.length > 1) {
      // Keep only one boots item (the first one)
      const keptBootsItem = bootsItems[0]
      const excessBootsCount = bootsItems.length - 1
      const nonBootsItems = currentSelection.filter((item) => !item.tags.includes('Boots'))

      // Get non-boots items from the remaining pool to replace excess boots items
      const remainingNonBootsItems = filteredItems.filter(
        (item) =>
          !item.tags.includes('Boots') &&
          !currentSelection.some((selected) => selected.id === item.id),
      )

      // Shuffle and take the needed amount
      const shuffledRemaining = [...remainingNonBootsItems].sort(() => Math.random() - 0.5)
      const replacementItems = shuffledRemaining.slice(0, excessBootsCount)

      // Update current selection
      currentSelection = [...nonBootsItems, keptBootsItem, ...replacementItems]
    }

    // Add icon URLs to items
    return currentSelection.map((item) => ({
      ...item,
      iconUrl: getItemIcon(item.image.full),
    }))
  }

  const getRandomSummonerSpells = (settings: RandomizerSettings) => {
    const spells = getSummonerSpellsList()

    const filteredSpells = spells.filter((spell) => spell.modes.includes(settings.mode))

    const shuffled = [...filteredSpells].sort(() => Math.random() - 0.5)
    const selectedSpells = shuffled.slice(0, 2)

    // Add icon URLs to summoner spells
    return selectedSpells.map((spell) => ({
      ...spell,
      iconUrl: getSummonerSpellIcon(spell.image.full),
    }))
  }

  const getRandomRuneTrees = (count: number) => {
    const runes = getRunesList()
    const shuffled = [...runes].sort(() => Math.random() - 0.5)
    const selectedRunes = shuffled.slice(0, count)

    // Add icon URLs to runes
    // Runes from runesReforged.json have an 'icon' property
    return selectedRunes.map((rune) => ({
      ...rune,
      iconUrl: getRuneTreeIcon(rune.icon),
    }))
  }

  const getRandomLane = (): Lane => {
    return lanes[Math.floor(Math.random() * lanes.length)]
  }

  const getRandomChampion = () => {
    const champions = getChampionsList()
    const selectedChampion = champions[Math.floor(Math.random() * champions.length)]

    // Add icon URL to champion
    return {
      ...selectedChampion,
      iconUrl: getChampionIcon(selectedChampion.image.full),
    }
  }

  const generateRandomResult = (
    settings: RandomizerSettings,
    amountOfRerollsLeft: number,
  ): RandomizedResult => {
    const result: RandomizedResult = {
      champion: getRandomChampion(),
      amountOfRerollsLeft: amountOfRerollsLeft,
      amountOfRerolls: settings.amountOfRerolls,
    }

    if (!settings) {
      return result
    }

    if (settings?.items) {
      result.items = getRandomItems(settings)
    }

    if (settings?.summonerSpells) {
      result.summonerSpells = getRandomSummonerSpells(settings)
    }

    if (settings?.runes) {
      result.runes = getRandomRuneTrees(2)
    }

    if (settings?.lanes) {
      result.lane = getRandomLane()
    }

    return result
  }

  const generateTeamResult = (settings: RandomizerSettings): RandomizedResult[] => {
    const teammates: RandomizedResult[] = []

    for (let i = 0; i < settings.amountOfPlayers; i++) {
      teammates.push(generateRandomResult(settings, settings.amountOfRerolls))
    }

    return [...teammates]
  }

  const rerollChampion = (settings: RandomizerSettings, amountOfRerollsLeft: number) => {
    const result = generateRandomResult(settings, amountOfRerollsLeft - 1)
    return result
  }

  return {
    lanes,
    generateRandomResult,
    generateTeamResult,
    rerollChampion,
  }
}
