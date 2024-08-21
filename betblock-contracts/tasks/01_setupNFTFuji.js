const { networks } = require("../networks")

/*
Code taken & adapted from https://github.com/smartcontractkit/ccip-defi-lending/blob/main/tasks/01_setupSender.js
*/
task("setup-nft-contract", "deploy ProfileNFTContract.sol").setAction(async (taskArgs, hre) => {
  if (network.name !== "fuji") {
    throw Error("This task is intended to be executed on the Fuji network.")
  }

  const ROUTER = networks[network.name].router
  const LINK = networks[network.name].linkToken

  console.log("\n__Compiling Contracts__")
  await run("compile")

  console.log(`\nDeploying ProfileNFTContract.sol to ${network.name}...`)
  const factory = await ethers.getContractFactory("ProfileNFTContract")
  const contract = await factory.deploy(ROUTER)

  console.log(`\nContract is deployed to ${network.name} at ${contract.address}`)
})