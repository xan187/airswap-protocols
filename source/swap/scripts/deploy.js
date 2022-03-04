/* eslint-disable no-console */
const { ethers, run } = require('hardhat')
const converterDeploys = require('@airswap/converter/deploys.js')
const stakingDeploys = require('@airswap/staking/deploys.js')
const { chainNames } = require('@airswap/constants')

async function main() {
  await run('compile')
  const [deployer] = await ethers.getSigners()
  console.log(`Deployer: ${deployer.address}`)

  const chainId = await deployer.getChainId()
  const protocolFeeWallet = converterDeploys[chainId]
  const stakingContract = stakingDeploys[chainId]
  const protocolFee = 30
  const protocolFeeLight = 7
  const rebateScale = 10
  const rebateMax = 100

  console.log(`Deploying on ${chainNames[chainId].toUpperCase()}`)
  console.log(`Fee wallet (Converter): ${protocolFeeWallet}`)
  console.log(`Staking: ${stakingContract}`)

  const swapFactory = await ethers.getContractFactory('Swap')
  const swapContract = await swapFactory.deploy(
    protocolFee,
    protocolFeeLight,
    protocolFeeWallet,
    rebateScale,
    rebateMax,
    stakingContract
  )
  await swapContract.deployed()
  console.log(`Deployed: ${swapContract.address}`)
  console.log(
    `\nVerify with "yarn verify --network ${chainNames[
      chainId
    ].toLowerCase()}"\n`
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
