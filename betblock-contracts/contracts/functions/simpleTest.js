import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config();

const testValidation = async () => {
	await axios.get('https://api.betblock.fi/validateKey', {
		headers: {
			"x-api-key": Deno.env.get('NFT_API_KEY'),
		},
	}).then((res) => {
		console.log(res.data)
	}).catch((err) => {
		console.error(err.message)
	})
}

const testFunction = async () => {
	await axios.get('https://api.betblock.fi/generateImage', {
		headers: {
			"x-api-key": Deno.env.get('NFT_API_KEY'),
		},
		params: {
			'words': 'futuristic football team battling out in the Superbowl',
			tokenId: 0,

		}
	}).then((res) => {
		console.log(res.data)
	}).catch((err) => {
		console.error(err.message)
	})
}

testValidation();
testFunction();