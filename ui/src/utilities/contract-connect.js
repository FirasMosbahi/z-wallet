import { ethers } from "ethers";
import Web3 from "web3";
import abi from "../contracts-config/z-wallet-abi.json";
const zWalledContractConnect = async (contractAddress) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const network = await provider.getNetwork();
  const zWallet = new ethers.Contract(contractAddress, abi, provider);
  return [provider, zWallet];
};
