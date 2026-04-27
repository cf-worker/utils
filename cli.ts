import { args } from "./cli/args.ts"
import { setExitCode } from "./cli/setExitCode.ts"
import { stdin } from "./cli/stdin.ts"
import { encrypt } from "./crypto/encrypt.ts"
import { deobfuscate } from "./crypto/deobfuscate.ts"
import { decrypt } from "./crypto/decrypt.ts"
import { hybridDecrypt } from "./crypto/hybridDecrypt.ts"
import { hybridEncrypt } from "./crypto/hybridEncrypt.ts"
import { generateHybridKeyPairText, parseCliFormat } from "./crypto/hybridKeyPair.ts"
import { obfuscate } from "./crypto/obfuscate.ts"
import { rsaEncrypt } from "./crypto/rsaEncrypt.ts"
import { rsaDecrypt } from "./crypto/rsaDecrypt.ts"

type CommandHandler = (args: string[]) => Promise<void>
type CommandHelp = {
  args: string
  description: string
  example: string
}

const commandHelp: Record<string, CommandHelp> = {
  encrypt: {
    args: "<key>",
    description: "Encrypt stdin using AES-GCM with a password-derived key",
    example: 'echo "hello" | bun cli.ts encrypt "secret"',
  },
  deobfuscate: {
    args: "[privateKey]",
    description: "Deobfuscate stdin, optionally using an explicit base64 private key",
    example: 'echo "$TOKEN" | bun cli.ts deobfuscate',
  },
  decrypt: {
    args: "<key>",
    description: "Decrypt stdin using AES-GCM with a password-derived key",
    example: 'echo "$TOKEN" | bun cli.ts decrypt "secret"',
  },
  hybridDecrypt: {
    args: "<privateKey>",
    description: "Decrypt stdin using hybrid RSA-OAEP + AES-GCM",
    example: 'echo "$TOKEN" | bun cli.ts hybridDecrypt "$PRIVATE_KEY"',
  },
  hybridEncrypt: {
    args: "<publicKey>",
    description: "Encrypt stdin using hybrid RSA-OAEP + AES-GCM",
    example: 'echo "hello" | bun cli.ts hybridEncrypt "$PUBLIC_KEY"',
  },
  hybridKeyPair: {
    args: "[--format <pem|base64|jwk>]",
    description: "Generate an RSA key pair for hybrid encryption",
    example: "bun cli.ts hybridKeyPair --format base64",
  },
  obfuscate: {
    args: "",
    description: "Obfuscate stdin using the legacy RSA/AES-CBC token format",
    example: 'echo "hello" | bun cli.ts obfuscate',
  },
  rsaEncrypt: {
    args: "<publicKey>",
    description: "Encrypt stdin directly with RSA-OAEP",
    example: 'echo "hello" | bun cli.ts rsaEncrypt "$PUBLIC_KEY"',
  },
  rsaDecrypt: {
    args: "<privateKey>",
    description: "Decrypt stdin directly with RSA-OAEP",
    example: 'echo "$TOKEN" | bun cli.ts rsaDecrypt "$PRIVATE_KEY"',
  },
}

const commandHandlers: Record<string, CommandHandler> = {
  encrypt: async ([key]) => {
    if (!key) throw new Error("Missing key argument")
    console.log(await encrypt(await stdin(), key))
  },
  deobfuscate: async ([privateKey]) => {
    console.log(await deobfuscate(await stdin(), privateKey))
  },
  decrypt: async ([key]) => {
    if (!key) throw new Error("Missing key argument")
    console.log(await decrypt(await stdin(), key))
  },
  hybridDecrypt: async ([privateKeyText]) => {
    if (!privateKeyText) throw new Error("Missing private key argument")
    console.log(await hybridDecrypt(await stdin(), privateKeyText))
  },
  hybridEncrypt: async ([publicKeyText]) => {
    if (!publicKeyText) throw new Error("Missing public key argument")
    console.log(await hybridEncrypt(await stdin(), publicKeyText))
  },
  hybridKeyPair: async (commandArgs) => {
    const keyPair = await generateHybridKeyPairText(parseCliFormat(commandArgs))
    console.log(JSON.stringify(keyPair))
  },
  obfuscate: async () => {
    console.log(await obfuscate(await stdin()))
  },
  rsaEncrypt: async ([publicKeyText]) => {
    if (!publicKeyText) throw new Error("Missing public key argument")
    console.log(await rsaEncrypt(await stdin(), publicKeyText))
  },
  rsaDecrypt: async ([privateKeyText]) => {
    if (!privateKeyText) throw new Error("Missing private key argument")
    console.log(await rsaDecrypt(await stdin(), privateKeyText))
  },
}

function formatCommandList(): string {
  return Object.keys(commandHandlers).sort().join(", ")
}

function formatHelp(): string {
  const lines = [
    "Usage:",
    "  bun cli.ts <command> [arguments]",
    "",
    "Commands:",
    ...Object.keys(commandHelp).sort().map((commandName) => {
      const { args: commandArgs, description, example } = commandHelp[commandName]
      const usage = commandArgs ? `${commandName} ${commandArgs}` : commandName
      return `  ${usage}\n    ${description}\n    Example: ${example}`
    }),
  ]

  return lines.join("\n")
}

async function main(): Promise<void> {
  const [commandName, ...commandArgs] = args()

  if (!commandName) {
    console.log(formatHelp())
    return
  }

  const command = commandHandlers[commandName]

  if (!command) {
    throw new Error(`Unknown command "${commandName}". Available commands: ${formatCommandList()}`)
  }

  await command(commandArgs)
}

if (import.meta.main) {
  try {
    await main()
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    setExitCode(1)
  }
}
