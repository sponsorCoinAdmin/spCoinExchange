require("@nomicfoundation/hardhat-toolbox");
require("hardhat-contract-sizer");
require("dotenv").config();

module.exports = {
  solidity: {
    version:  "0.7.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 2000,
      }
    }
  },
  networks: {
    hardhat: {
      forking: {
        enable: true,
        // url: "https://mainnet.infura.io/v3/{YOUR INFURA KEY HERE}"
        // or if using .env file use example similar to below
        // url: process.env.MAINNET_INFURA_TEST_URL
        url: process.env.GOERLI_INFURA_TEST_URL
        // url: process.env.SEPOLIA_INFURA_TEST_URL
      },
      mainnet: {
        url: process.env.MAINNET_ALCHEMY_TEST_URL,
        accounts: [process.env.WALLET_SECRET]
      },
      goerli: {
        url: process.env.GOERLI_ALCHEMY_TEST_URL,
        accounts: [process.env.WALLET_SECRET]
      },
      sepolia: {
        url: process.env.SEPOLIA_ALCHEMY_TEST_URL,
        accounts: [process.env.WALLET_SECRET]
      }  
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
    only: ["SPCoin"],
  }
};

