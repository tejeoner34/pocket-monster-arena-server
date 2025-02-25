import { ArenaPokemon, Pokemon, ReceivedMoveDetail } from '../models/pokemon.model.js';
import { User } from '../models/user.js';

export const getTurnOrder = (pokemons: Map<User['id'], Pokemon>): User['id'][] => {
  return Array.from(pokemons.entries())
    .sort(([, pokemonA], [, pokemonB]) => pokemonB.speed - pokemonA.speed)
    .map(([userId]) => userId);
};

export const initiatePokemonForArena = (pokemon: Pokemon, trainerId: User['id']): ArenaPokemon => ({
  ...pokemon,
  currentHealth: pokemon.hp,
  currentPercentageHealth: '100%',
  isAlive: true,
  status: 'idle',
  trainerId: trainerId,
  receivedAttackData: {} as ReceivedMoveDetail,
});
