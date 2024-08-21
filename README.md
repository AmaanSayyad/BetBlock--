### BetBlock

One of our team-mate was on etherscan exploring some transactions and saw an advertisement of [https://stake.com/](url) which was giving 200% bonus on first deposit, when our team-mate deposited the 120 USDT into this platform they gave him 360 USDT as total balance and when our teammate started playing game he was shocked to see that he was only able to play with $1 per game of Play Plinko Online - Pachinko Casino Game on Stake.com and was unable to increase the betting amount beyond $1 coz he was using the bonus scheme of 200% and when he tried to explore and play other games on the platform he got to know that this platform has cheated him under the name of wager limits.

When he tried to withdraw money they showed him this rule list of wager limit which said that if he wants to withdraw the deposited amount then he have to play $12,300 worth of game play and this was the big shock for him where he was explained a maths logic by their live support. Thereby, In the hope of getting the deposited money back he played the game Plinko entire night and lost all money.

He was very annoyed of this and that's how BetBlock born, which is a combination of gamefi and defi all in one platform where new web3 users can play games, perform gambling but have a safe, secure, transparent platform that does not scam any of their users. Also we wanted to address common issues in traditional gaming platforms.

### Problem
The traditional online gambling industry is plagued by several issues, including:
- **Unfair Game Outcomes:** Many platforms manipulate game results, leading to unfair play.

- **High Fees:** Users face exorbitant fees for deposits, withdrawals, and gameplay.

- **Restrictive Withdrawal Policies:** Withdrawal limits and conditions often prevent users from accessing their funds.

- **Bonus Drawbacks:** Misleading bonus schemes trap users with unrealistic wagering requirements.

- **Lack of True Asset Ownership:** Centralized platforms retain control over user assets, limiting their freedom and security.

### Solution
BetBlock addresses these problems by offering:
- **Provably Fair Gaming:** Utilizing the Chainlink VRF to ensure all game outcomes are transparent and verifiably fair.


- **Low Fees:** Leveraging the efficiency of Polygon and CrossFi Chain to minimize transaction costs.

- **Flexible Withdrawal Policies:** Providing users with unrestricted access to their funds.

- **Transparent Bonus Schemes:** Clear and Clean bonus terms without hidden traps.

- **True Asset Ownership:** Decentralized asset management ensures users have full control over their assets.

### Key Features
**BetBlock** offers a multifaceted platform with three main features:

**1. AI - Social Aspect:**
- Users create **AI-generated NFT profile pictures** (MicroGPT) based on keywords.
- View a **community leaderboard**.
- Explore other **players' profiles, recent activity, and ENS**.

**2. GameFi - Gaming Aspect:**
- **BetBlock** includes a fully functional **European roulette game**.
- Users can place various types of bets such as **straight, split, street, corner, six line, column, dozen, red, black, high, low, even, and odd.**
- The **roulette wheel**, powered by **Chainlink VRF, randomly generates winning values.**
- Winnings are automatically calculated and transferred to the users' wallets using **Chainlink Automation.**

**3. Defi - Lending Aspect:**
- Users can **deposit any tokens on any chain as collateral to borrow LINK.**
- Facilitates gameplay without the need to sell existing holdings.
- Ensures players have the necessary assets to participate in games seamlessly using **Chainlink Data Feeds** for real-time asset prices.

**Diverse Game Selection:** A variety of fully on-chain games, including roulette, blackjack, plinko, and more. As a (POC) Proof of Concept we developed fully on-chain Roulette but similar model can be applied to introduce the new casino games to the platform.

## How we built it
**BetBlock** was developed using a combination of **Chainlink services and blockchain technologies:**
- **MicroGPT and Chainlink Functions:** Used to mint **NFTs** on **Polygon with DALL-E3 (Open AI MicroGPT).**
- **IPFS Server:** We built our own server to save costs and ensure smooth integration with our internal API, which stores NFTs and metadata.
- **Polygon and CrossFi Network:** Deployed the roulette game logic for fast transaction speeds.
- **Chainlink VRF:** Implemented to randomly generate winning values in the roulette game.
- **Chainlink Automation:** Used to automate the roulette wheel spin, calculate winnings, and withdraw winnings to users' wallets.
- **Chainlink CCIP:** Implemented Chainlink CCIP for cross chain transfers and communication across chains to make it convenient for users and ease their struggle of jumping between chains.
- **Chainlink Data Feeds:** Employed to fetch the latest asset prices for calculating the maximum borrowable amounts in the lending contract and displaying up-to-date prices on the UI.
- Next.js, Javascript, Tailwind CSS, Solidity, Cosmos Wasm, Metamask Wallet.



### Challenges
- Setting up the DeFi part also posed challenges, as we contemplated creating our own platform token.
- **Integration of Multiple Chainlink Services:** Ensuring seamless integration of **Chainlink Functions, VRF, Automation, and Data Feeds** required careful planning and testing and understanding **Chainlink routers and supported chains** was initially difficult.
- Time constraints did not allowed us for implementing gasless transactions but we prioritized delivering a functional and reliable platform.
- **Cross-Chain Compatibility:** Deploying smart contracts across multiple chains and ensuring smooth interoperability was a complex task that demanded thorough testing and troubleshooting.

### What's next
All though started as a idea but now we are thinking to carry forward as a business model and expand further.

- Applying for Grants: Seeking funding to further develop and expand the platform.

- Mainnet Launch: Deploying on the mainnet for real-world use.

- User Testing: Conducting extensive user testing to refine the platform.

- Promoting the Product: Marketing to attract a wider audience.

- Introducing new games to the platform

- Explore additional DeFi features like staking, farming, yield strategies to offer more financial services within the platform.

- We also aim to implement gasless transactions to enhance user convenience.

- Enabling Developers to build more transparent games in our platform.

- Bringing in new monetization to compensate the casino games/ game creators.

- Having a inbuilt live streaming for gameplay, allow players to do streaming within the application.

Be the biggest gamefi/ gambling / games hub centre of the gaming industry.

## Getting Started

To start exploring BetBlock, follow these steps to set up the platform locally.

### Prerequisites

- Node.js
- Yarn
- Git
- A Web3 wallet (e.g., MetaMask)

### Setup

1. Clone the repository.
   
2. Install dependencies:
    ```bash
    cd betblock
    yarn install
    ```
3. Start the local development server:
    ```bash
    yarn start
    ```

### Smart Contract Deployment

Refer to the `betblock-contracts` README for detailed instructions on deploying the contracts to your preferred blockchain network.

BetBlock is more than just a platform, it's a launchpad for games, a new way to game powered by AI, and a glimpse into the future of decentralized entertainment.