import { ArenaPokemon } from '../models/pokemon.model.js';
import { getRemainingHP } from './pokemon-moves-types-relationships.js';

export const updatePokemonHealth = (pokemon: ArenaPokemon, attackerPokemon: ArenaPokemon) => {
  const remainingHP = getRemainingHP({
    pokemonHP: pokemon.currentHealth,
    receivedAttackEffectivinessIndex: pokemon.receivedAttackData.damageInfo.value,
    attackerBasePower: attackerPokemon.power,
    attacksPower: pokemon.receivedAttackData.power,
  });
  pokemon.currentHealth = remainingHP;
  pokemon.currentPercentageHealth = `${remainingHP}%`;
  pokemon.isAlive = pokemon.currentHealth > 0;
  pokemon.status = pokemon.isAlive ? 'idle' : 'defeated';
};
