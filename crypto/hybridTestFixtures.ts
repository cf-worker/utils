import {
  generateHybridKeyPair,
  privateKeyToBase64,
  privateKeyToText,
  publicKeyToBase64,
  publicKeyToText,
} from "./hybridKeyPair.ts"
import { hybridEncrypt } from "./hybridEncrypt.ts"
import { generateObfuscationKeyPair, obfuscate } from "./obfuscate.ts"
import { rsaEncrypt } from "./rsaEncrypt.ts"

const TEST_RSA_MODULUS_LENGTH = 1024

let hybridFixturePromise:
  | Promise<{
    helloToken: string
    helloTokenFromTextKey: string
    objectToken: string
    privateKey: CryptoKey
    privateKeyBase64: string
    privateKeyText: string
    publicKey: CryptoKey
    publicKeyBase64: string
    publicKeyText: string
    wrongPrivateKey: CryptoKey
  }>
  | undefined

let obfuscationFixturePromise:
  | Promise<{
    keyPair: CryptoKeyPair
    privateKeyText: string
    secretTokenWithKey: string
    secretTokenWithoutKey: string
    helloTokenWithKey: string
  }>
  | undefined

let rsaFixturePromise:
  | Promise<{
    helloToken: string
    objectToken: string
    privateKey: CryptoKey
    privateKeyText: string
    publicKey: CryptoKey
    publicKeyText: string
    wrongPrivateKey: CryptoKey
  }>
  | undefined

export function getHybridTestFixture() {
  hybridFixturePromise ??= (async () => {
    const [{ publicKey, privateKey }, { privateKey: wrongPrivateKey }] = await Promise.all([
      generateHybridKeyPair({ modulusLength: TEST_RSA_MODULUS_LENGTH }),
      generateHybridKeyPair({ modulusLength: TEST_RSA_MODULUS_LENGTH }),
    ])
    const [publicKeyText, publicKeyBase64, privateKeyText, privateKeyBase64] = await Promise.all([
      publicKeyToText(publicKey),
      publicKeyToBase64(publicKey),
      privateKeyToText(privateKey),
      privateKeyToBase64(privateKey),
    ])
    const [helloToken, helloTokenFromTextKey, objectToken] = await Promise.all([
      hybridEncrypt("hello world", publicKey),
      hybridEncrypt("hello world", publicKeyText),
      hybridEncrypt({ hello: "world", count: 1 }, publicKey),
    ])

    return {
      helloToken,
      helloTokenFromTextKey,
      objectToken,
      privateKey,
      privateKeyBase64,
      privateKeyText,
      publicKey,
      publicKeyBase64,
      publicKeyText,
      wrongPrivateKey,
    }
  })()

  return hybridFixturePromise
}

export function getObfuscationTestFixture() {
  obfuscationFixturePromise ??= (async () => {
    const keyPair = await generateObfuscationKeyPair()
    const helloTokenWithKey = await obfuscate("hello world", { keyPair })
    const secretTokenWithKey = await obfuscate("secret value", { keyPair })
    const [, privateKeyText] = secretTokenWithKey.split(".")
    const secretTokenWithoutKey = await obfuscate("secret value", {
      keyPair,
      embedPrivateKey: false,
    })

    return {
      helloTokenWithKey,
      keyPair,
      privateKeyText,
      secretTokenWithKey,
      secretTokenWithoutKey,
    }
  })()

  return obfuscationFixturePromise
}

export function getRsaTestFixture() {
  rsaFixturePromise ??= (async () => {
    const [{ publicKey, privateKey }, { privateKey: wrongPrivateKey }] = await Promise.all([
      generateHybridKeyPair({ modulusLength: TEST_RSA_MODULUS_LENGTH }),
      generateHybridKeyPair({ modulusLength: TEST_RSA_MODULUS_LENGTH }),
    ])
    const [publicKeyText, privateKeyText] = await Promise.all([
      publicKeyToText(publicKey),
      privateKeyToText(privateKey),
    ])
    const [helloToken, objectToken] = await Promise.all([
      rsaEncrypt("hello", publicKey),
      rsaEncrypt({ hello: "world" }, publicKey),
    ])

    return {
      helloToken,
      objectToken,
      privateKey,
      privateKeyText,
      publicKey,
      publicKeyText,
      wrongPrivateKey,
    }
  })()

  return rsaFixturePromise
}
