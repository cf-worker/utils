export function ip2int(ip: string): number {
  return ip.split(".")
    .map(Number) // Convert each octet to a number
    .reduce((int, octet) => (int << 8) + octet) >>> 0 // Apply unsigned shift
}
