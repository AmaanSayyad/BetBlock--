import {createPublicClient, http, createWalletClient, custom} from 'viem'
import { avalancheFuji, mainnet } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import dotenv from 'dotenv'

dotenv.config();

const internalAccount = privateKeyToAccount(process.env.INTERNAL_WALLET_PRIVATE_KEY)

export const publicMainnetClient = createPublicClient({
	chain: mainnet,
	transport: http(),
})

export const publicFujiClient = createPublicClient({
	chain: avalancheFuji,
	transport: http()
});

export const internalFujiClient = createWalletClient({
	account: internalAccount,
	chain: avalancheFuji,
	transport: http()
})