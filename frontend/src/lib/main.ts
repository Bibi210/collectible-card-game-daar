import { ethers } from 'ethers'
import * as ethereum from './ethereum'
import { contracts } from '@/contracts.json'
import Main from '@/abis/Main.json'


export const correctChain = () => {
  return 128123
}

const mainAddr = "0x27c7DbE57fa7E477d3B85f1833d8D988de571617"

export const init = async (details: ethereum.Details) => {
  const { provider, signer } = details
  const network = await provider.getNetwork()
  console.log(network)
  console.log("Main Address: ", mainAddr)
  if (correctChain() !== network.chainId) {
    console.error('Please switch to HardHat')
    return null
  }

  const contract = new ethers.Contract(mainAddr, Main, provider)
  const deployed = await contract.deployed()
  if (!deployed) return null
  const contract_ = signer ? contract.connect(signer) : contract
  return contract_ as any
}
