import { ethers } from "hardhat";
import * as dotenv from 'dotenv';
dotenv.config;

async function main() {
    const myTokenContractFactory = await ethers.getContractFactory('MyToken');
    const myTokenContract = await myTokenContractFactory.deploy();
    await myTokenContract.deployed();

    const totalSupply = myTokenContract.
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
