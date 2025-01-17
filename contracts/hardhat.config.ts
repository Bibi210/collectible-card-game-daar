import 'dotenv/config'
import 'hardhat-deploy'
import { HardhatUserConfig } from 'hardhat/config'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import 'hardhat-gas-reporter'
import 'hardhat-abi-exporter'

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.20',
        settings: {
          optimizer: {
            enabled: true
          },
        },
      },
    ],
  },

  paths: {
    deploy: './deploy/deployer',
    sources: './src',
  },
  namedAccounts: {
    deployer: { default: 0 }
  },
  abiExporter: [{
    runOnCompile: true,
    path: '../frontend/src/abis',
    clear: true,
    flat: true,
    only: [],
    pretty: true,
  }, {
    runOnCompile: true,
    clear: true,
    flat: true,
    only: [],
    pretty: true,
  }],
  typechain: {
    outDir: '../typechain',
  },
  networks: {
    etherlink: {
      url: "https://node.ghostnet.etherlink.com",  // URL of your local node (if you have one running)
      accounts: [`fe2d46c2362a361b12bd9901955881ebad911161f23732f71866a06fa5ddc9b3`], // If you want to use a private key for deployment
    },
  },
}

export default config
