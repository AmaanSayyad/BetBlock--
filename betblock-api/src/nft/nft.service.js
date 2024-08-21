import OpenAI from 'openai'
import dotenv from 'dotenv'
import {create} from 'ipfs-http-client'
import fs from 'fs'
import {mintAddress, mintABI} from './contractDetails.js'
import {publicFujiClient, internalFujiClient} from './ViemClients.js'
import {CID} from 'multiformats/cid'

dotenv.config();

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})
const ipfs = create({url: 'http://localhost:5001/api/v0'})
var env = process.env.NODE_ENV || 'development'

// Function to invoke DALL-E and generate an image based on provided words
export const invokeDallE = async (words) => {
    try {
        const image = await openai.images.generate({
            model: 'dall-e-3',
            prompt: words,
            n: 1,
            response_format: 'b64_json',
            size: '1024x1024'
        });
        return image.data[0].b64_json;
    } catch (error) {
        console.error('Failed to generate image: ', error);
        throw error;
    }
};

// Function to add generated image to IPFS and return the IPFS hash
export const addImageToIPFS = async (binaryData) => {
    try {
        const result = await ipfs.add(binaryData);
        const cid = CID.parse(result.cid.toString());
        console.log('Image added to IPFS. IPFS Hash: ', cid.toV1().toString());
        return cid.toV1().toString();
    } catch (error) {
        console.error('Error adding image to IPFS: ', error);
        throw error;
    }
};

// Function to add metadata associated with an NFT to IPFS
export const addMetadataToIPFS = async (cid, tokenId, words) => {
    try {
        const timestamp = Math.floor(Date.now() / 1000);
        const metadata = {
            name: `betblock bio ${tokenId}`,
            image: `ipfs://${cid}`,
            description: `betblock bio - newbie level: ${words}`,
            createdAt: timestamp,
        };
        const result = await ipfs.add(JSON.stringify(metadata));
        const cidObject = CID.parse(result.cid.toString());
        console.log('Metadata added to IPFS. IPFS Hash: ', cidObject.toV1().toString());
        return cidObject.toV1().toString();
    } catch (error) {
        console.error('Error adding metadata to IPFS: ', error);
        throw error;
    }
};

// Function to mint an NFT with a given token URI and token ID
export const mintNFT = async (uriCID, tokenId) => {
    const uri = `ipfs://${uriCID}`;
    try {
        const res = await publicFujiClient.simulateContract({
            address: mintAddress,
            abi: mintABI,
            functionName: 'mintBioToken',
            args: [uri, parseInt(tokenId)]
        });
        internalFujiClient.writeContract(res.request);
    } catch (error) {
        console.error('Error minting NFT: ', error);
        throw error;
    }
};