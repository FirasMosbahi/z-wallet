import { ethers } from "ethers";
import Web3 from "web3";
import zwalletAbi from "../abi/ZWallet.json";
export const zWalledContractConnect = async (account) => {
  let web3 = new Web3(window.ethereum);
  const networkId = await web3.eth.net.getId();
  const zWalletContract = new web3.eth.Contract(
    zwalletAbi.abi,
    zwalletAbi.networks[networkId].address
  );
  zWalletContract.options.address = account;
  return zWalletContract;
};
