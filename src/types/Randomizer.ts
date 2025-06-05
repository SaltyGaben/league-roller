export interface RandomizerSettings {
  mode: string
  items: boolean
  summonerSpells: boolean
  runes: boolean
  lanes?: boolean
  amountOfItems?: number
  amountOfPlayers: number
  amountOfRerolls: number
}

export interface RandomizedResult {
  champion: Champion
  items?: Item[]
  summonerSpells?: SummonerSpell[]
  runes?: Rune[]
  lane?: Lane
  amountOfRerollsLeft: number
  amountOfRerolls: number
}

export interface Item {
  id: string
  name: string
  into?: string[]
  maps: Record<string, boolean>
  consumed?: boolean
  tags: string[]
  image: Image
  iconUrl?: string
}

export interface SummonerSpell {
  id: string
  name: string
  description: string
  modes: string[]
  image: Image
  iconUrl?: string
}

export interface Rune {
  id: string
  name: string
  description?: string
  icon: string
  image?: Image
  iconUrl?: string
}

export interface Lane {
  id: string
  name: string
  image: Image
}

export interface Champion {
  id: string
  key: string
  name: string
  image: Image
  iconUrl?: string
}

export interface Image {
  full: string
  group: string
  sprite: string
  h: number
  w: number
  x: number
  y: number
}

export interface Map {
  id: number
  available: boolean
}
