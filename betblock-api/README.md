## BetBlock API Documentation

Welcome to the BetBlock API! This service is at the heart of our innovative Web3 gaming platform, enabling the seamless integration of Chainlink Functions to mint unique, MicroGPT AI-generated NFT profile pictures. Leveraging the power of OpenAI's DALL-E and a self-hosted IPFS server, our API creates a bridge between smart contracts and dynamic NFT creation, enriching the user experience on the BetBlock platform.

## Overview

The BetBlock API is developed with Node.js and serves as a crucial component for handling requests from blockchain smart contracts. It utilizes Chainlink Functions to receive data (such as keywords and token IDs) for the generation of personalized NFTs. These NFTs are then stored on IPFS, providing a decentralized and efficient method for storing and referencing digital assets on the blockchain.

## Key Features

- MicroGPT AI-Generated NFT Minting: Utilizes OpenAI's DALL-E to generate unique images based on user-provided keywords, minting them as NFTs.

- IPFS Integration: Runs an IPFS server to store NFT images and metadata, generating CID (Content Identifier) v1 references that are used by smart contracts.

- Chainlink Functions Integration: Receives minting requests from smart contracts, ensuring a secure and decentralized process for NFT creation.

## Minting Process

1. NFT Creation Request: The process begins when a user decides to mint their NFT profile picture through the platform's React application.
2. Smart Contract Invocation: The user's request triggers a smart contract function call, which then sends a request to the BetBlock API via Chainlink Functions. This request includes essential data such as the user's chosen keywords for the NFT image and the token ID.
3. AI Image Generation: Upon receiving the request, the API invokes the OpenAI API, using the provided keywords to generate a unique image.
4. IPFS Storage: The generated image is added to the IPFS server, ensuring that it is stored in a decentralized manner. A CID v1 is created for the image, which serves as a permanent, immutable reference.
5. NFT Minting: The CID is sent back to the smart contract, completing the minting process. The user's NFT profile picture is now securely stored on the blockchain and referenced via IPFS.

## Getting Started

To integrate with the BetBlock API or to start minting your NFTs on the BetBlock platform, please refer to the following steps:

1. Ensure that you have a Web3 enabled browser or wallet that can interact with smart contracts on the blockchain network supported by BetBlock.
2. Visit the BetBlock platform and navigate to the profile creation or NFT minting section.
3. Follow the on-screen instructions to choose your keywords and initiate the NFT minting process.