import { ethers } from "ethers";
import Web3 from "web3";
import abi from "../contracts-config/zwallet-abi.json";
const zWalledContractConnect = async (nftContractAddress) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const network = await provider.getNetwork();
  const zWallet = new ethers.Contract(nftContractAddress, abi, provider);
  return [provider, zWallet];
};
