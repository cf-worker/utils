import { removeAccents } from "./removeAccents.ts"

/**
 * Converts a string to a slug by lowercasing, trimming, and replacing whitespace with hyphens.
 * Unreserved Characters:
 * Alphabetic characters: a-z, A-Z
 * Digits: 0-9
 * Hyphen: -
 * Underscore: _
 * Period: .
 * Tilde: ~
 * Exclamation mark: !
 * Asterisk: *
 * Single quote: '
 * Parentheses: ( and )
 *
 * @param {string} text - The string to be converted to a slug.
 * @return {string} The slugified string.
 * @see https://github.com/simov/slugify/blob/master/slugify.js
 */
export function slugify(text: string): string {
  // @TODO: translate all accent characters to without accents
  return removeAccents(text.toLowerCase().trim().replaceAll(/\s+/g, "-"))
}
