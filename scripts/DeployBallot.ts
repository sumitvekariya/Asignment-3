import { formatBytes32String } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { proposals } from "../constants/proposals";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import tokenizedBallotABI from '../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json';
import { BALLOT_CONTRACT_ADDRESS, MY_TOKEN_CONTRACT_ADDRESS } from "../constants/addresses";
import { TokenizedBallot__factory } from "../typechain-types";
import { TokenizedBallot } from "../typechain-types/contracts/TokenizedBallot.sol";
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

    const proposalsByteLike = proposals.map(p => formatBytes32String(p));

    console.log('Wallet Balance:', balance);

    const anotherWallet = new ethers.Wallet(process.env.ANOTHER_PRIVATE_KEY ?? '');
    const anotherSigner = anotherWallet.connect(provider);

    if (balance < 0.1) {
        throw new Error('Not enough balance');
    }

    const tokenizedBallotContractFactory = new TokenizedBallot__factory(signer);
    let tokenizedBallotContract: TokenizedBallot;

    if (!BALLOT_CONTRACT_ADDRESS) {
        console.log('TokenizedBallot Contract deployment started');
        const currentBlock = await ethers.provider.getBlock('latest');
        tokenizedBallotContract = await tokenizedBallotContractFactory.deploy(proposalsByteLike, MY_TOKEN_CONTRACT_ADDRESS, currentBlock.number);
        const deployed = await tokenizedBallotContract.deployed();
        console.log({deployed});
        console.log('Ballot Contract deployed successfully');
    } else {
        tokenizedBallotContract = new ethers.Contract(BALLOT_CONTRACT_ADDRESS, tokenizedBallotABI.abi, signer) as TokenizedBallot;
    }
  

}
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });