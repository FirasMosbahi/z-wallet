// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ZCoin is ERC20 {
    uint256 public token_price = 100; // Set your desired token price
    uint256 public supply = 10*50;
    event test(uint256 value);
    event ZCoinSold(address seller,uint256 amount);

    constructor() ERC20("ZToken", "ZTK") {
        _mint(address(this), supply);
    }

    function buy() public payable {
        uint256 tokensToBuy = msg.value/token_price;
        require(
            supply > tokensToBuy,
            "Not enough tokens available"
        );
        _transfer(address(this), msg.sender, tokensToBuy);
        supply -= tokensToBuy;
        emit ZCoinSold(msg.sender, tokensToBuy);
    }
    function transferCoin(address from,address to,uint256 amount) public{
        _transfer(from, to, amount);
    }
}