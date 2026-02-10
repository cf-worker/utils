/**
 * Convert an integer to an IPv4 string.
 */
export function int2ip(int: number): string {
  return [
    (int >>> 24) & 255, // Extract the first 8 bits (highest byte)
    (int >>> 16) & 255, // Extract the second byte
    (int >>> 8) & 255, // Extract the third byte
    int & 255, // Extract the last 8 bits (lowest byte)
  ].join(".")
} // encoding/int2ip.test.ts
