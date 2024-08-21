const { networks } = require("../networks")

/*
Code taken & adapted from https://github.com/smartcontractkit/ccip-defi-lending/blob/main/tasks/01_setupSender.js
*/
task("setup-avalance-lending-contract", "deploy AvalancheLending.sol").setAction(async (taskArgs, hre) => {
  if (network.name !== "fuji") {
    throw Error("This task is intended to be executed on the Fuji network.")
  }

  const LINK = networks[network.name].linkToken

  console.log("\n__Compiling Contracts__")
  await run("compile")

  console.log(`\nDeploying AvalancheLending.sol to ${network.name}...`)
  const factory = await ethers.getContractFactory("AvalancheLending")
  const contract = await factory.deploy(ROUTER)

  console.log(`\nContract is deployed to ${network.name} at ${contract.address}`)
})