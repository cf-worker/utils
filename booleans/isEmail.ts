export const EMAIL_REGEXP =
  /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

/**
 * Loosely validate an email address.
 *
 * @param {string} string
 * @return {boolean}
 * @see https://emailregex.com/
 * @see https://github.com/segmentio/is-email/blob/master/lib/index.js
 * @see https://github.com/manishsaraan/email-validator/blob/master/index.js
 * @see https://github.com/mailcheck/mailcheck
 * @see https://github.com/fabian-hiller/valibot/pull/180/files
 * @see https://github.com/fabian-hiller/valibot/blob/4acb0b07c364a53f7714f43387c1402e9ae67977/library/src/regex.ts#L25
 */
export function isEmail(string: string): boolean {
  return string.length > 320 ? false : EMAIL_REGEXP.test(string)
}
