// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./NFT.sol";
import "./ZCoin.sol";

contract ZWallet {
  address zCoinContractAddress;
  address nftContractAddress;
  address payable public owner;
  NFT nftContract;
  ZCoin zcoinContract;
  constructor(address memory _zCoinContractAddress,address memory _nftContractAddress) public {
    owner = payable(msg.sender);
    zCoinetContractAddress = _zCoinContractAddress;
    nftContractAddress = _nftContractAddress;
    nftContract = NFT()
  }
}
