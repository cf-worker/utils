import { expect, test } from "bun:test"
import { privateKeyToBase64, publicKeyToBase64 } from "./hybridKeyPair.ts"
import { generateHybridKeyPair } from "./hybridKeyPair.ts"

test("hybridKeyPair CLI outputs JSON with base64 keys", async () => {
  if (!("Deno" in globalThis)) return

  const command = new Deno.Command(Deno.execPath(), {
    args: ["run", "-A", "crypto/hybridKeyPair.ts", "--format", "base64"],
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
    args: ["run", "-A", "crypto/hybridKeyPair.ts"],
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
    args: ["run", "-A", "crypto/hybridKeyPair.ts", "-f", "jwk"],
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
    args: ["run", "-A", "crypto/hybridKeyPair.ts", "--format", "bogus"],
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
    args: ["run", "-A", "crypto/hybridEncrypt.ts", publicKeyText],
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
    args: ["run", "-A", "crypto/hybridDecrypt.ts", privateKeyText],
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

test("hybridEncrypt CLI fails when the key argument is missing", async () => {
  if (!("Deno" in globalThis)) return

  const command = new Deno.Command(Deno.execPath(), {
    args: ["run", "-A", "crypto/hybridEncrypt.ts"],
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
    args: ["run", "-A", "crypto/hybridDecrypt.ts"],
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

function coverageEnv(): Record<string, string> {
  try {
    const coverageDir = Deno.env.get("DENO_COVERAGE")
    return coverageDir ? { DENO_COVERAGE: coverageDir } : {}
  } catch {
    return {}
  }
}
