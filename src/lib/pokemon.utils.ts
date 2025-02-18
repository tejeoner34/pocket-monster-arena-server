import { ArenaPokemon } from '../models/pokemon.model.js';
import { getRemainingHP } from './pokemon-moves-types-relationships.js';

export const updatePokemonHealth = (pokemon: ArenaPokemon) => {
  const remainingHP = getRemainingHP({
    pokemonHP: pokemon.currentHealth,
    receivedAttackEffectivinessIndex: 1,
    attackerBasePower: 100,
    attacksPower: 100,
  });
  pokemon.currentHealth = remainingHP;
  pokemon.currentPercentageHealth = `${remainingHP}%`;
  pokemon.isAlive = pokemon.currentHealth > 0;
  pokemon.status = pokemon.isAlive ? 'idle' : 'defeated';
};
