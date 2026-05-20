import { expect, test } from "bun:test"
import { privateKeyToBase64, publicKeyToBase64 } from "./hybridKeyPair.ts"
import { generateHybridKeyPair } from "./hybridKeyPair.ts"
import { decrypt } from "./decrypt.ts"
import { deobfuscate } from "./deobfuscate.ts"
import { getObfuscationTestFixture, getRsaTestFixture } from "./hybridTestFixtures.ts"

test("hybridKeyPair CLI outputs JSON with base64 keys", async () => {
  if (!("Deno" in globalThis)) return

  const command = new Deno.Command(Deno.execPath(), {
    args: ["run", "-A", "cli.ts", "hybridKeyPair", "--format", "base64"],
    env: coverageEnv(),
    stdout: "piped",
    stderr: "piped",
  })
  const { code, stdout } = await command.output()
  const output = new TextDecoder().decode(stdout).trim()
  const parsed = JSON.parse(output)

  expect(code).toBe(0)
  expect(parsed.format).toBe("base64")
  expect(typeof parsed.publicKey).toBe("string")
  expect(typeof parsed.privateKey).toBe("string")
  expect(parsed.publicKey.includes("\n")).toBe(false)
  expect(parsed.privateKey.includes("\n")).toBe(false)
})

test("hybridKeyPair CLI outputs JSON with pem keys by default", async () => {
  if (!("Deno" in globalThis)) return

  const command = new Deno.Command(Deno.execPath(), {
    args: ["run", "-A", "cli.ts", "hybridKeyPair"],
    env: coverageEnv(),
    stdout: "piped",
    stderr: "piped",
  })
  const { code, stdout } = await command.output()
  const parsed = JSON.parse(new TextDecoder().decode(stdout))

  expect(code).toBe(0)
  expect(parsed.format).toBe("pem")
  expect(parsed.publicKey.startsWith("-----BEGIN PUBLIC KEY-----")).toBe(true)
  expect(parsed.privateKey.startsWith("-----BEGIN PRIVATE KEY-----")).toBe(true)
})

test("hybridKeyPair CLI outputs JSON with JWK keys via -f", async () => {
  if (!("Deno" in globalThis)) return

  const command = new Deno.Command(Deno.execPath(), {
    args: ["run", "-A", "cli.ts", "hybridKeyPair", "-f", "jwk"],
    env: coverageEnv(),
    stdout: "piped",
    stderr: "piped",
  })
  const { code, stdout } = await command.output()
  const parsed = JSON.parse(new TextDecoder().decode(stdout))

  expect(code).toBe(0)
  expect(parsed.format).toBe("jwk")
  expect(JSON.parse(parsed.publicKey).kty).toBe("RSA")
  expect(JSON.parse(parsed.privateKey).kty).toBe("RSA")
})

test("hybridKeyPair CLI fails for invalid formats", async () => {
  if (!("Deno" in globalThis)) return

  const command = new Deno.Command(Deno.execPath(), {
    args: ["run", "-A", "cli.ts", "hybridKeyPair", "--format", "bogus"],
    env: coverageEnv(),
    stdout: "piped",
    stderr: "piped",
  })
  const { code, stderr } = await command.output()

  expect(code).toBe(1)
  expect(new TextDecoder().decode(stderr)).toMatch("Invalid format. Use pem, base64, or jwk")
})

test("hybridEncrypt CLI encrypts stdin and hybridDecrypt CLI restores it", async () => {
  if (!("Deno" in globalThis)) return

  const { publicKey, privateKey } = await generateHybridKeyPair()
  const publicKeyText = await publicKeyToBase64(publicKey)
  const privateKeyText = await privateKeyToBase64(privateKey)
  const encrypt = new Deno.Command(Deno.execPath(), {
    args: ["run", "-A", "cli.ts", "hybridEncrypt", publicKeyText],
    env: coverageEnv(),
    stdin: "piped",
    stdout: "piped",
    stderr: "piped",
  })
  const encryptProcess = encrypt.spawn()
  const writer = encryptProcess.stdin.getWriter()
  await writer.write(new TextEncoder().encode("hello from cli"))
  await writer.close()
  const encrypted = await encryptProcess.output()
  const token = new TextDecoder().decode(encrypted.stdout).trim()

  expect(encrypted.code).toBe(0)
  expect(token.length > 0).toBe(true)

  const decrypt = new Deno.Command(Deno.execPath(), {
    args: ["run", "-A", "cli.ts", "hybridDecrypt", privateKeyText],
    env: coverageEnv(),
    stdin: "piped",
    stdout: "piped",
    stderr: "piped",
  })
  const decryptProcess = decrypt.spawn()
  const decryptWriter = decryptProcess.stdin.getWriter()
  await decryptWriter.write(new TextEncoder().encode(token))
  await decryptWriter.close()
  const decrypted = await decryptProcess.output()

  expect(decrypted.code).toBe(0)
  expect(new TextDecoder().decode(decrypted.stdout).trim()).toBe("hello from cli")
})

test("encrypt CLI encrypts stdin and decrypt CLI restores it", async () => {
  if (!("Deno" in globalThis)) return

  const encrypted = await runCliWithStdin(["encrypt", "secret"], "hello from cli")
  const token = encrypted.stdout.trim()

  expect(encrypted.code).toBe(0)
  expect(await decrypt(token, "secret")).toBe("hello from cli")

  const decrypted = await runCliWithStdin(["decrypt", "secret"], token)

  expect(decrypted.code).toBe(0)
  expect(decrypted.stdout.trim()).toBe("hello from cli")
})

test("obfuscate CLI obfuscates stdin and deobfuscate CLI restores it", async () => {
  if (!("Deno" in globalThis)) return

  const obfuscated = await runCliWithStdin(["obfuscate"], "hello from cli")
  const token = obfuscated.stdout.trim()

  expect(obfuscated.code).toBe(0)
  expect(await deobfuscate(token)).toBe("hello from cli")

  const deobfuscated = await runCliWithStdin(["deobfuscate"], token)

  expect(deobfuscated.code).toBe(0)
  expect(deobfuscated.stdout.trim()).toBe("hello from cli")
})

test("deobfuscate CLI accepts an explicit private key argument", async () => {
  if (!("Deno" in globalThis)) return

  const { privateKeyText, secretTokenWithoutKey } = await getObfuscationTestFixture()
  const deobfuscated = await runCliWithStdin(["deobfuscate", privateKeyText], secretTokenWithoutKey)

  expect(deobfuscated.code).toBe(0)
  expect(deobfuscated.stdout.trim()).toBe("secret value")
})

test("rsaEncrypt CLI encrypts stdin and rsaDecrypt CLI restores it", async () => {
  if (!("Deno" in globalThis)) return

  const { privateKeyText, publicKeyText } = await getRsaTestFixture()
  const encrypted = await runCliWithStdin(["rsaEncrypt", publicKeyText], "hello from cli")
  const token = encrypted.stdout.trim()

  expect(encrypted.code).toBe(0)
  expect(token.length > 0).toBe(true)

  const decrypted = await runCliWithStdin(["rsaDecrypt", privateKeyText], token)

  expect(decrypted.code).toBe(0)
  expect(decrypted.stdout.trim()).toBe("hello from cli")
})

test("encrypt CLI fails when the key argument is missing", async () => {
  if (!("Deno" in globalThis)) return

  const { code, stderr } = await runCliWithStdin(["encrypt"], "")

  expect(code).toBe(1)
  expect(stderr).toMatch("Missing key argument")
})

test("decrypt CLI fails when the key argument is missing", async () => {
  if (!("Deno" in globalThis)) return

  const { code, stderr } = await runCliWithStdin(["decrypt"], "")

  expect(code).toBe(1)
  expect(stderr).toMatch("Missing key argument")
})

test("hybridEncrypt CLI fails when the key argument is missing", async () => {
  if (!("Deno" in globalThis)) return

  const command = new Deno.Command(Deno.execPath(), {
    args: ["run", "-A", "cli.ts", "hybridEncrypt"],
    env: coverageEnv(),
    stdin: "piped",
    stdout: "piped",
    stderr: "piped",
  })
  const process = command.spawn()
  await process.stdin.close()
  const { code, stderr } = await process.output()

  expect(code).toBe(1)
  expect(new TextDecoder().decode(stderr)).toMatch("Missing public key argument")
})

test("hybridDecrypt CLI fails when the key argument is missing", async () => {
  if (!("Deno" in globalThis)) return

  const command = new Deno.Command(Deno.execPath(), {
    args: ["run", "-A", "cli.ts", "hybridDecrypt"],
    env: coverageEnv(),
    stdin: "piped",
    stdout: "piped",
    stderr: "piped",
  })
  const process = command.spawn()
  await process.stdin.close()
  const { code, stderr } = await process.output()

  expect(code).toBe(1)
  expect(new TextDecoder().decode(stderr)).toMatch("Missing private key argument")
})

test("rsaEncrypt CLI fails when the key argument is missing", async () => {
  if (!("Deno" in globalThis)) return

  const { code, stderr } = await runCliWithStdin(["rsaEncrypt"], "")

  expect(code).toBe(1)
  expect(stderr).toMatch("Missing public key argument")
})

test("rsaDecrypt CLI fails when the key argument is missing", async () => {
  if (!("Deno" in globalThis)) return

  const { code, stderr } = await runCliWithStdin(["rsaDecrypt"], "")

  expect(code).toBe(1)
  expect(stderr).toMatch("Missing private key argument")
})

test("CLI fails for unknown commands", async () => {
  if (!("Deno" in globalThis)) return

  const command = new Deno.Command(Deno.execPath(), {
    args: ["run", "-A", "cli.ts", "bogus"],
    env: coverageEnv(),
    stdout: "piped",
    stderr: "piped",
  })
  const { code, stderr } = await command.output()

  expect(code).toBe(1)
  expect(new TextDecoder().decode(stderr)).toMatch('Unknown command "bogus"')
})

test("CLI without arguments prints help for all commands", async () => {
  if (!("Deno" in globalThis)) return

  const command = new Deno.Command(Deno.execPath(), {
    args: ["run", "-A", "cli.ts"],
    env: coverageEnv(),
    stdout: "piped",
    stderr: "piped",
  })
  const { code, stdout, stderr } = await command.output()
  const output = new TextDecoder().decode(stdout)

  expect(code).toBe(0)
  expect(new TextDecoder().decode(stderr)).toBe("")
  expect(output).toMatch("Usage:")
  expect(output).toMatch("bun cli.ts <command> [arguments]")
  expect(output).toMatch("encrypt <key>")
  expect(output).toMatch("decrypt <key>")
  expect(output).toMatch("rsaEncrypt <publicKey>")
  expect(output).toMatch("rsaDecrypt <privateKey>")
  expect(output).toMatch("hybridEncrypt <publicKey>")
  expect(output).toMatch("hybridDecrypt <privateKey>")
  expect(output).toMatch("hybridKeyPair [--format <pem|base64|jwk>]")
  expect(output).toMatch("obfuscate")
  expect(output).toMatch("deobfuscate [privateKey]")
  expect(output).toMatch('Example: echo "hello" | bun cli.ts encrypt "secret"')
  expect(output).toMatch('Example: echo "$TOKEN" | bun cli.ts decrypt "secret"')
  expect(output).toMatch('Example: echo "hello" | bun cli.ts rsaEncrypt "$PUBLIC_KEY"')
  expect(output).toMatch('Example: echo "$TOKEN" | bun cli.ts rsaDecrypt "$PRIVATE_KEY"')
  expect(output).toMatch('Example: echo "hello" | bun cli.ts hybridEncrypt "$PUBLIC_KEY"')
  expect(output).toMatch('Example: echo "$TOKEN" | bun cli.ts hybridDecrypt "$PRIVATE_KEY"')
  expect(output).toMatch("Example: bun cli.ts hybridKeyPair --format base64")
  expect(output).toMatch('Example: echo "hello" | bun cli.ts obfuscate')
  expect(output).toMatch('Example: echo "$TOKEN" | bun cli.ts deobfuscate')
})

async function runCliWithStdin(args: string[], input: string) {
  const command = new Deno.Command(Deno.execPath(), {
    args: ["run", "-A", "cli.ts", ...args],
    env: coverageEnv(),
    stdin: "piped",
    stdout: "piped",
    stderr: "piped",
  })
  const process = command.spawn()
  const writer = process.stdin.getWriter()
  if (input) {
    await writer.write(new TextEncoder().encode(input))
  }
  await writer.close()
  const { code, stdout, stderr } = await process.output()

  return {
    code,
    stderr: new TextDecoder().decode(stderr),
    stdout: new TextDecoder().decode(stdout),
  }
}

function coverageEnv(): Record<string, string> {
  try {
    const coverageDir = Deno.env.get("DENO_COVERAGE")
    return coverageDir ? { DENO_COVERAGE: coverageDir } : {}
  } catch {
    return {}
  }
}
