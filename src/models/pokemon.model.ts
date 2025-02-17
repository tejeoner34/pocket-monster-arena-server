export interface Pokemon {
  abilities: Ability[];
  forms: Species[];
  id: number;
  moves: Move[];
  name: string;
  order: number;
  sprites: Sprites;
  stats: Stat[];
  types: RawPokemonType[];
  weight: number;
  hp: number;
  speed: number;
  power: number;
  processedTypes: PokemonType[];
  arenaMoves: ArenaMoves;
  status: ArenaPokemonStatus;
}

export type ArenaPokemonStatus =
  | 'alive'
  | 'defeated'
  | 'attacking'
  | 'waiting'
  | 'stunned'
  | 'idle';
export const arenaPokemonStatus: Record<ArenaPokemonStatus, ArenaPokemonStatus> = {
  alive: 'alive',
  defeated: 'defeated',
  attacking: 'attacking',
  waiting: 'waiting',
  stunned: 'stunned',
  idle: 'idle',
};

export type ArenaMoves = [MoveDetail, MoveDetail, MoveDetail, MoveDetail];

export interface ArenaPokemon extends Pokemon {
  currentHealth: number;
  currentPercentageHealth: string;
  isAlive: boolean;
}

export interface Ability {
  ability: Species;
  is_hidden: boolean;
  slot: number;
}

export interface Species {
  name: string;
  url: string;
}

export interface Move {
  move: Species;
}

export interface Sprites {
  back_default: string;
  back_female: string;
  back_shiny: string;
  back_shiny_female: null | string;
  front_default: string;
  front_female: string;
  front_shiny: string;
  front_shiny_female: string;
  animated?: Sprites;
}

export interface Stat {
  base_stat: number;
  effort: number;
  stat: Species;
}

export interface MoveDetail {
  accuracy: number;
  id: number;
  meta: Meta;
  name: string;
  names: Name[];
  power: number;
  pp: number;
  type: Type;
}

export interface Type {
  name: PokemonType;
  url: string;
}

export interface RawPokemonType {
  slot: number;
  type: Type;
}

export interface Meta {
  crit_rate: number;
  flinch_chance: number;
}

export interface Name {
  language: Language;
  name: string;
}

export interface Language {
  name: string;
  url: string;
}

export type PokemonType =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy';
