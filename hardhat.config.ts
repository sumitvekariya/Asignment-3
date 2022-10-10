import { HardhatUserConfig } from "hardhat/config";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import "@nomicfoundation/hardhat-toolbox";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.17',
    // settings: {
    //   optimizer: {
    //     enabled: true,
    //     runs: 200,
    //   },
    // },
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      // accounts: [process.env.PRIVATE_KEY as string]
    },
    // goerli: {
    //   url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
    //   // gas: 2500000,
    //   // gasPrice: 10000000000,
    //   allowUnlimitedContractSize: true,
    //   accounts: [process.env.PRIVATE_KEY as string, process.env.ACC1_PRIVATE_KEY as string, process.env.ACC2_PRIVATE_KEY as string,]
    // }
  }
};

export default config;
