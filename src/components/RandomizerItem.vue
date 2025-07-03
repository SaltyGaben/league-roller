<script setup lang="ts">
import RandomizerSettingsCard from './RandomizerSettingsCard.vue';
import RandomizerResult from './RandomizerResult.vue';
import type { RandomizedResult, RandomizerSettings } from '@/types/Randomizer';
import { ref } from 'vue'
import { useRandomizer } from '@/composables/useRandomizer'
import { useRiotAssets } from '@/composables/useRiotAssets'

const result = ref<RandomizedResult[]>([])

const { generateTeamResult, rerollChampion } = useRandomizer()
const { isReady } = useRiotAssets()

const randomizerSettings = ref<RandomizerSettings>({
    mode: 'ranked',
    items: false,
    summonerSpells: false,
    runes: false,
    lanes: false,
    amountOfPlayers: 1,
    amountOfRerolls: 0,
})

const setRandomizerSettings = (settings: RandomizerSettings) => {
    result.value = []

    randomizerSettings.value = settings

    if (isReady.value) {
        const randomResult = generateTeamResult(randomizerSettings.value)
        result.value = randomResult
    }
}

const reroll = (index: number) => {
    const rerolledResult = rerollChampion(randomizerSettings.value, result.value[index].amountOfRerollsLeft)
    result.value[index] = rerolledResult
}


</script>

<template>
    <div class="flex flex-col justify-center items-center gap-20 ">
        <RandomizerSettingsCard @randomize="setRandomizerSettings" />
        <RandomizerResult :results="result" @reroll="reroll" />
    </div>
</template>