<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card'
import { Switch } from './ui/switch'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Dices } from 'lucide-vue-next'
import type { RandomizerSettings } from '../types/Randomizer'

const randomizerSettings = ref<RandomizerSettings>({
    mode: 'CLASSIC',
    items: false,
    summonerSpells: false,
    runes: false,
    lanes: false,
    amountOfItems: 1,
    amountOfPlayers: 1,
    amountOfRerolls: 0,
})

const tabs = [
    {
        label: 'Ranked',
        value: 'CLASSIC',
    },
    {
        label: 'ARAM',
        value: 'ARAM',
    },
    {
        label: 'Brawl',
        value: 'BRAWL',
    }
]

const setMode = (mode: string) => {
    randomizerSettings.value.mode = mode
}

const emit = defineEmits<{
    (e: 'randomize', settings: RandomizerSettings): void
}>()

const randomize = () => {
    emit('randomize', randomizerSettings.value)
}

</script>

<template>
    <div class="flex flex-col justify-center items-center w-full">
        <Card class="w-2/3 bg-white/5 backdrop-blur-md border border-foreground/10 shadow-sm">
            <CardHeader>
                <CardTitle class="text-2xl font-bold">
                    Randomizer Settings
                </CardTitle>
                <CardDescription>
                    Customize your randomizer settings
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div class="flex flex-row gap-2 justify-center items-center max-w-full flex-wrap">
                    <Button v-for="tab in tabs" :key="tab.value" @click="setMode(tab.value)"
                        class="w-50 h-12 text-lg hover:cursor-pointer"
                        :variant="randomizerSettings.mode === tab.value ? 'default' : 'secondary'">
                        {{ tab.label }}
                    </Button>
                </div>
                <div class="flex flex-row gap-4 pt-4 mt-4 w-full">
                    <div class="flex flex-col w-1/2">
                        <div class="flex flex-row items-center justify-between h-10">
                            <p>Items</p>
                            <Switch :model-value="randomizerSettings.items"
                                @update:model-value="randomizerSettings.items = $event"
                                class="!h-7 !w-11 [&>[data-slot=switch-thumb]]:!size-5 [&>[data-slot=switch-thumb]]:data-[state=unchecked]:!translate-x-1 hover:cursor-pointer" />
                        </div>
                        <div class="flex flex-row items-center justify-between h-10">
                            <p>Summoner Spells</p>
                            <Switch :model-value="randomizerSettings.summonerSpells"
                                @update:model-value="randomizerSettings.summonerSpells = $event"
                                class="!h-7 !w-11 [&>[data-slot=switch-thumb]]:!size-5 [&>[data-slot=switch-thumb]]:data-[state=unchecked]:!translate-x-1 hover:cursor-pointer" />
                        </div>
                        <div class="flex flex-row items-center justify-between h-10">
                            <p>Runes</p>
                            <Switch :model-value="randomizerSettings.runes"
                                @update:model-value="randomizerSettings.runes = $event"
                                class="!h-7 !w-11 [&>[data-slot=switch-thumb]]:!size-5 [&>[data-slot=switch-thumb]]:data-[state=unchecked]:!translate-x-1 hover:cursor-pointer" />
                        </div>
                    </div>
                    <div class="flex flex-col w-1/2">
                        <div v-if="randomizerSettings.items" class="flex flex-row items-center justify-between h-10">
                            <p>Amount of Items</p>
                            <Input type="number" class="w-24" v-model="randomizerSettings.amountOfItems" :max="6"
                                :min="1" />
                        </div>
                        <div class="flex flex-row items-center justify-between h-10">
                            <p>Amount of players</p>
                            <Input type="number" class="w-24" v-model="randomizerSettings.amountOfPlayers" :max="5"
                                :min="1" />
                        </div>
                        <div class="flex flex-row items-center justify-between h-10">
                            <p>Amount of rerolls allowed</p>
                            <Input type="number" class="w-24" v-model="randomizerSettings.amountOfRerolls" />
                        </div>
                    </div>
                </div>
                <div class="pt-4 w-full mt-4">
                    <Button class="w-full h-14 text-lg flex flex-row items-center justify-center gap-4"
                        @click="randomize">
                        <Dices class="!w-8 !h-8" />
                        <p class="text-xl">Randomize Champion</p>
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
</template>