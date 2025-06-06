<script setup lang="ts">
import type { RandomizedResult } from '@/types/Randomizer'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Dices } from 'lucide-vue-next'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { track } from '@vercel/analytics'

const emit = defineEmits<{
    (e: 'reroll', index: number): void
}>()

defineProps<{
    results: RandomizedResult[]
}>()

const reroll = (index: number) => {
    track('Reroll')
    emit('reroll', index)
}

</script>

<template>
    <div class="flex flex-col justify-center items-center w-full">
        <div class="flex flex-col justify-center items-center w-full gap-4">
            <Card v-for="(result, index) in results" :key="result.champion.id"
                class="w-2/3 bg-white/5 backdrop-blur-md border border-foreground/10 shadow-sm">
                <div class="flex flex-row justify-end items-center w-full absolute top-0 right-0 p-4 gap-4">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <p>{{ result.amountOfRerollsLeft }} / {{ result.amountOfRerolls }} </p>
                            </TooltipTrigger>
                            <TooltipContent>
                                Amount of rerolls left
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Button variant="ghost" class="w-10 h-10 hover:cursor-pointer"
                                    :disabled="result.amountOfRerollsLeft === 0" @click="reroll(index)">
                                    <Dices class="!w-8 !h-8" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Reroll your champion
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <CardHeader class="flex flex-col justify-center items-center gap-4">
                    <CardTitle class="text-6xl font-bold">{{ result.champion.name }}</CardTitle>
                    <CardDescription>
                        <img :src="result.champion.iconUrl" alt="Champion Image" class="w-32 h-32 rounded-full" />
                    </CardDescription>
                </CardHeader>
                <CardContent class="flex flex-col justify-center items-center w-full gap-4">
                    <div v-if="result.items" class="flex flex-col justify-center items-center w-full gap-4">
                        <h1 class="text-2xl font-bold">Items</h1>
                        <div class="flex flex-row justify-center items-center w-full flex-wrap gap-4">
                            <div v-for="item in result.items" :key="item.id"
                                class="flex flex-row  justify-center items-center gap-4 w-1/4">
                                <img :src="item.iconUrl" alt="Item Image" class="w-12 h-12 rounded-full" />
                                <p>{{ item.name }}</p>
                            </div>
                        </div>
                    </div>

                    <div v-if="result.summonerSpells" class="flex flex-col justify-center items-center w-full gap-4">
                        <h1 class="text-2xl font-bold">Summoner Spells</h1>
                        <div class="flex flex-row justify-center items-center w-full flex-wrap gap-4">
                            <div v-for="summonerSpell in result.summonerSpells" :key="summonerSpell.id"
                                class="flex flex-row  justify-center items-center gap-4 w-1/4">
                                <img :src="summonerSpell.iconUrl" alt="Summoner Spell Image"
                                    class="w-12 h-12 rounded-full" />
                                <p>{{ summonerSpell.name }}</p>
                            </div>
                        </div>
                    </div>

                    <div v-if="result.runes" class="flex flex-col justify-center items-center w-full gap-4">
                        <h1 class="text-2xl font-bold">Runes</h1>
                        <div class="flex flex-row justify-center items-center w-full flex-wrap gap-4">
                            <div v-for="rune in result.runes" :key="rune.id"
                                class="flex flex-row  justify-center items-center gap-4 w-1/4">
                                <img :src="rune.iconUrl" alt="Rune Image" class="w-12 h-12 rounded-full" />
                                <p>{{ rune.name }}</p>
                            </div>
                        </div>
                    </div>

                    <div v-if="result.lane" class="flex flex-col justify-center items-center w-full gap-4">
                        <h1 class="text-2xl font-bold">Lane</h1>
                        <div class="flex flex-row justify-center items-center w-full flex-wrap gap-4">
                            <div class="flex flex-row  justify-center items-center gap-4 w-1/4">
                                <img :src="result.lane.image.full" alt="Lane Image" class="w-10 h-10 rounded-full" />
                                <p>{{ result.lane.name }}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
</template>