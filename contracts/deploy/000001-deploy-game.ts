import { DeployFunction } from 'hardhat-deploy/types'

const deployer: DeployFunction = async hre => {
  const { deployer } = await hre.getNamedAccounts()

  // Write deployer in file
  const fs = require('fs')
  fs.writeFileSync('../backend/deployer.txt', deployer)
  await hre.deployments.deploy('Main', { from: deployer, log: true, args: [deployer] })
}


export default deployer


