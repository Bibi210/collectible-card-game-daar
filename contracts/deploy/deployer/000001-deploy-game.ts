import { DeployFunction } from 'hardhat-deploy/types'
import { setEnv } from '../server'
import { Contract } from 'ethers';

const deployer: DeployFunction = async hre => {
  const Main = await hre.ethers.getContractFactory("Main");
  const { deployer } = await hre.getNamedAccounts();
  const main = (await Main.deploy(deployer)) as Contract;
  await main.deployed();
  console.log("Main deployed to:", main.address);
  console.log("Deployer: ", deployer)
  await setEnv(main, hre)
}

export default deployer


