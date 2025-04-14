// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ZCoin is ERC20 {
    address payable owner;
    uint256 public tokenPrice; // Set your desired token price
    event ReceivedEth(address indexed sender, uint256 amount);
    event ZCoinTransfer(address sender,address receiver,uint256 amount);

    constructor(uint256 _tokenPrice, uint256 _initialSupply) ERC20("ZToken", "ZTK") {
        tokenPrice = _tokenPrice;
        _mint(address(this), _initialSupply);
    }

    fallback() external payable {
        emit ReceivedEth(msg.sender, msg.value);
    }

    receive() external payable {
        emit ReceivedEth(msg.sender, msg.value);
    }
    function getBalance(address account) public view returns (uint256){
        return balanceOf(account);
    }
    function transferZCoin(address from,address to, uint256 amount) public returns (bool) {
        _transfer(from, to, amount);
        return true;
    }
}