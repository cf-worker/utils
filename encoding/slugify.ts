/**
 * @see https://github.com/simov/slugify/blob/master/slugify.js
 */
export function slugify(text: string): string {
  // @TODO: translate all accent characters to without accents
  return text.toLowerCase().trim().replaceAll(/\s+/g, "-")
}
