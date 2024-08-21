// All supported networks and related contract addresses are defined here.
//
// LINK token addresses: https://docs.chain.link/resources/link-token-contracts/
// Chain IDs: https://chainlist.org/?testnets=true

require("@chainlink/env-enc").config()

const DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS = 2

const npmCommand = process.env.npm_lifecycle_event
const isTestEnvironment = npmCommand == "test" || npmCommand == "test:unit"

// Set EVM private key (required)
const PRIVATE_KEY = process.env.PRIVATE_KEY

if (!isTestEnvironment && !PRIVATE_KEY) {
  throw Error("Set the PRIVATE_KEY environment variable with your EVM wallet private key")
}

const networks = {
  fuji: {
    url: process.env.AVALANCHE_FUJI_RPC_URL || "THIS HAS NOT BEEN SET",
    router: "0xA9d587a00A31A52Ed70D6026794a8FC5E2F5dCb0",
    chainSelector: "14767482510784806043",
    gasPrice: undefined,
    accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
    verifyApiKey: "THIS HAS NOT BEEN SET",
    chainId: 43113,
    confirmations: 2 * DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "AVAX",
    linkToken: "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846",
  },
}

module.exports = {
  networks,
}