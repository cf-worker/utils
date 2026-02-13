/**
 * encoding/removeAccents module.
 * @module
 */
/**
 * Removes accents from a given string.
 *
 * @param {string} string - The string to remove accents from.
 * @return {string} The string without accents.
 */
export function removeAccents(string: string): string {
  return string.normalize("NFKD").replace(/\p{Diacritic}/gu, "") // /[\u0300-\u036f]/g
}
