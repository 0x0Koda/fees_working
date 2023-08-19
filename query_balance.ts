import { ethers, Contract } from "ethers";
import * as dotenv from "dotenv";
import ERC20Abi from "./abi/erc20.json";
dotenv.config();

//const privateKey = process.env.privateKey as string;
const moonbeamRpcEndPoint = "http://localhost:8500/3";
(async () => {
    const tokenAddress = "0xCa01a1D0993565291051daFF390892518ACfAD3A";
    const userAddress = "0x3Ee2a1D8F972C046784c505B3dcE35d961356487";
    const provider = new ethers.providers.JsonRpcProvider(moonbeamRpcEndPoint);
    //const signer: ethers.Wallet = new ethers.Wallet(privateKey, provider);

    const token = new Contract(tokenAddress, ERC20Abi, provider);

    console.log(await token.balanceOf(userAddress));
    console.log(await provider.getBalance(userAddress));
})();
