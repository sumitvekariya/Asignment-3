import { formatBytes32String } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { proposals } from "../constants/proposals";
// import { Ballot, Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import myTokenABI from '../artifacts/contracts/MyToken.sol/MyToken.json';
import { BALLOT_CONTRACT_ADDRESS, MY_TOKEN_CONTRACT_ADDRESS } from "../constants/addresses";
import { MyToken__factory } from "../typechain-types";
import { MyToken } from "../typechain-types/contracts/TokenizedBallot.sol";
dotenv.config();

const setupProvider = () => {
    const options = {
        alchemy: process.env.ALCHEMY_API_KEY,
        infura: process.env.INFURA_API_KEY,
    }
    const provider = ethers.providers.getDefaultProvider('goerli', options);
    return provider;
}

async function main() {
    const provider = setupProvider();
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? '');
    const signer = wallet.connect(provider);
    const balanceBN = await signer.getBalance();
    const balance = Number(ethers.utils.formatEther(balanceBN));
    console.log('Wallet Balance:', balance);

    const anotherWallet = new ethers.Wallet(process.env.ANOTHER_PRIVATE_KEY ?? '');
    const anotherSigner = anotherWallet.connect(provider);

    if (balance < 0.1) {
        throw new Error('Not enough balance');
    }

    const myTokenContractFactory = new MyToken__factory(signer);
    let myTokenContract: MyToken;

    if (!MY_TOKEN_CONTRACT_ADDRESS) {
        console.log('MyToken Contract deployment started');
        myTokenContract = await myTokenContractFactory.deploy();
        const deployed = await myTokenContract.deployed();
        console.log({deployed});
        console.log('Ballot Contract deployed successfully');
    } else {
        myTokenContract = new ethers.Contract(BALLOT_CONTRACT_ADDRESS, myTokenABI.abi, signer) as MyToken;
    }
  

}
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });