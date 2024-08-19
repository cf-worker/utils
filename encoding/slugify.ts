/**
 * Converts a string to a slug by lowercasing, trimming, and replacing whitespace with hyphens.
 *
 * @param {string} text - The string to be converted to a slug.
 * @return {string} The slugified string.
 * @see https://github.com/simov/slugify/blob/master/slugify.js
 */
export function slugify(text: string): string {
  // @TODO: translate all accent characters to without accents
  return text.toLowerCase().trim().replaceAll(/\s+/g, "-")
}
