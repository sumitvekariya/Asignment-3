import { ethers } from "hardhat";
import { MyToken, TokenizedBallot } from "../typechain-types";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import tokenizedBallotABI from '../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json';
import myTokenABI from '../artifacts/contracts/MyToken.sol/MyToken.json';
import { BALLOT_CONTRACT_ADDRESS, MY_TOKEN_CONTRACT_ADDRESS } from "../constants/addresses";
import { formatBytes32String } from "ethers/lib/utils";
import { proposals } from "../constants/proposals";
dotenv.config();

const setupProvider = () => {
    const options = {
        alchemy: process.env.ALCHEMY_API_KEY,
        infura: process.env.INFURA_API_KEY,
    }
    const provider = new ethers.providers.InfuraProvider('goerli', process.env.INFURA_API_KEY);
    return provider;
}

async function main() {
    const TOKENS_MINTED = ethers.utils.parseEther("0.1");
    const provider = setupProvider();
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? '');
    const signer = wallet.connect(provider);
    const balanceBN = await signer.getBalance();
    const balance = Number(ethers.utils.formatEther(balanceBN));
    console.log('Wallet Balance:', balance);

    const acc1Wallet = new ethers.Wallet(process.env.ACC1_PRIVATE_KEY ?? '');
    const acc1Signer = acc1Wallet.connect(provider);

    const acc2Wallet = new ethers.Wallet(process.env.ACC2_PRIVATE_KEY ?? '');
    const acc2Signer = acc2Wallet.connect(provider);

    // const myTokenContractWallet = new ethers.Wallet.


    const myTokenContract = new ethers.Contract(MY_TOKEN_CONTRACT_ADDRESS, myTokenABI.abi, signer) as MyToken;
    const tokenizedBallotContract = new ethers.Contract(BALLOT_CONTRACT_ADDRESS, tokenizedBallotABI.abi, myTokenContract.signer) as TokenizedBallot;

    // const totalSupply = await myTokenContract.totalSupply();
    // console.log(
    //   `The initial total supply of this contract after deployment is ${totalSupply}\n`
    // );

    // // Minting for acc1
    // try {
    //     const acc1MintTx = await myTokenContract.mint(acc1Signer.address, TOKENS_MINTED);
    //     const acc1MintTxReceipt = await acc1MintTx.wait();
    //     console.log({ acc1MintTxReceipt });
    // } catch (error) {
    //     console.log(error);
    // }
    // //

    // const totalSupplyAfter = await myTokenContract.totalSupply();
    // console.log(
    //   `The initial total supply of this contract after minting is ${ethers.utils.formatEther(
    //     totalSupplyAfter
    //   )}\n`
    // );

    // console.log("What is the current VotePower of acc1?");
    // const acc1InitialVotingPowerAfterMint = await myTokenContract.getVotes(
    //   acc1Signer.address
    // );
    // console.log(
    //   `The vote balance of acc1 after minting is ${ethers.utils.formatEther(
    //     acc1InitialVotingPowerAfterMint
    //   )}\n`
    // );

    // console.log("Delegating from acc1 to acc1");
    // const delegateTx = await myTokenContract.connect(acc1Signer).delegate(acc1Signer.address);
    // await delegateTx.wait();
    // const acc1InitialVotingPowerAfterDelegate = await myTokenContract.getVotes(
    //   acc1Signer.address
    // );
    // console.log(
    //   `The vote balance of acc1 after self delegating is ${ethers.utils.formatEther(
    //     acc1InitialVotingPowerAfterDelegate
    //   )}\n`
    // );
    // const currentBlock = await ethers.provider.getBlock("latest");
    // console.log(`The current block number is ${currentBlock.number}\n`);
    // const mintTx2 = await myTokenContract.mint(acc2Signer.address, TOKENS_MINTED);
    // mintTx2.wait();
    // const currentBlock2 = await ethers.provider.getBlock("latest");
    // console.log(`The current block number is ${currentBlock2.number}\n`);
    // const mintTx3 = await myTokenContract.mint(acc2Signer.address, TOKENS_MINTED);
    // mintTx3.wait();
    // const currentBlock3 = await ethers.provider.getBlock("latest");
    // console.log(`The current block number is ${currentBlock3.number}\n`);
    // let pastVotes = await Promise.all([
    //   await myTokenContract.getPastVotes(acc1Signer.address, 0),
    // ]);
    // console.log({ pastVotes });

    // // give minting role to addr1 & addr2
    // const addr1MintingRightsTx = await myTokenContract.grantRole(formatBytes32String('MINTER_ROLE'), acc1Signer.address);
    // const addr1MintingRightsTxReceipt = await addr1MintingRightsTx.wait();
    // console.log({addr1MintingRightsTxReceipt})

    // const addr2MintingRightsTx = await myTokenContract.grantRole(formatBytes32String('MINTER_ROLE'), acc2Signer.address);
    // const addr2MintingRightsTxReceipt = await addr2MintingRightsTx.wait();
    // console.log({addr2MintingRightsTxReceipt})

    // // check role of addr1 & addr2

    // const isAcc1Minter = await myTokenContract.hasRole(formatBytes32String('MINTER_ROLE'), acc1Signer.address);
    // const isAcc2Minter = await myTokenContract.hasRole(formatBytes32String('MINTER_ROLE'), acc2Signer.address);

    // console.log('Has Acc1 minting role?', isAcc1Minter);
    // console.log('Has Acc2 minting role?', isAcc2Minter);

    // const voteToProposal1Tx = await tokenizedBallotContract.connect(signer).vote(0, ethers.utils.parseEther("0.1"));
    // await voteToProposal1Tx.wait();

    // const voteToProposal2Tx = await tokenizedBallotContract.connect(signer).vote(1, ethers.utils.parseEther("0.2"));
    // await voteToProposal2Tx.wait();

    const winnerName = await tokenizedBallotContract.winnerName();

    console.log(`winner is ${winnerName}`);

    const currentBlock4 = await ethers.provider.getBlock("latest");
    console.log(`The current block number is ${currentBlock4.number}\n`);

    const pastVotes = await Promise.all([
        await myTokenContract.getPastVotes(acc1Signer.address, currentBlock4.number),
      ]);
    console.log({ pastVotes });

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
