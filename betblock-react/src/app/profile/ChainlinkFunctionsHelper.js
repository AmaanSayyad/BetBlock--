/*
This file is just a hack around functions-toolkit being unstable
Notice that we use Viem here instead
*/
import EthCrypto from 'eth-crypto'
import {getContract} from 'viem'
import {FunctionsRouterSource} from './ChainlinkRouterInfo'
import {FunctionsCoordinatorSource} from './ChainlinkCoordinatorInfo'
import {publicFujiClient} from '../ViemClient'

const routerFuji = '0xA9d587a00A31A52Ed70D6026794a8FC5E2F5dCb0';

const getDONPublicKey = async () => {
	const functionsCoordinatorAddress = await publicFujiClient.readContract({
		address: routerFuji,
		abi: FunctionsRouterSource.abi,
		functionName: 'getContractById',
		args: ['0x66756e2d6176616c616e6368652d66756a692d31000000000000000000000000']})

	const donPublicKey = (await publicFujiClient.readContract({
		address: functionsCoordinatorAddress,
		abi: FunctionsCoordinatorSource.abi,
		functionName: 'getDONPublicKey'
	})).slice(2)
	return donPublicKey
}

export const encryptSecretsUrls = async (secretsUrls) => {
  if (!Array.isArray(secretsUrls) || secretsUrls.length === 0) {
    throw Error('Must provide an array of secrets URLs')
  }
  if (!secretsUrls.every(url => typeof url === 'string')) {
    throw Error('All secrets URLs must be strings')
  }
  try {
    secretsUrls.forEach(url => new URL(url))
  } catch (e) {
    throw Error(`Error encountered when attempting to validate a secrets URL: ${e}`)
  }

  const donPublicKey = await getDONPublicKey()
  const encrypted = await EthCrypto.encryptWithPublicKey(donPublicKey, secretsUrls.join(' '))
  return '0x' + EthCrypto.cipher.stringify(encrypted)
}