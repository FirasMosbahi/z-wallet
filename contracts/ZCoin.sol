// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract ZCoin is ERC20Capped, ERC20Burnable {
  address payable public owner;
  uint256 public blockReward;
  uint256 public cappedAt;
  uint256 public rate;
  modifier onlyOwner() {
    require(msg.sender == owner, "Only the owner can call this function");
    _;
  }

  constructor(
    uint256 _blockReward,
    uint256 _initialValue,
    uint256 _cappedAt,
    uint256 _rate
  ) ERC20("Z-Token", "ZTK") ERC20Capped(_cappedAt * (10**18)) {
    owner = payable(msg.sender);
    cappedAt = _cappedAt * (10**18);
    _mint(owner, _initialValue * (10**18));
    blockReward = _blockReward * (10**18);
    rate = _rate;
  }

  //minting function
  function _mint(address account, uint256 amount)
  internal
  virtual
  override(ERC20Capped, ERC20)
  {
    require(
      ERC20.totalSupply() + amount <= cap(),
      "ERC20Capped: cap exceeded"
    );
    super._mint(account, amount);
  }

  //mining reward callback
  function _mintMinerReward() internal {
    _mint(block.coinbase, blockReward);
  }

  //mining reward function
  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 value
  ) internal virtual override {
    if (
      from != address(0) &&
      to != block.coinbase &&
      block.coinbase != address(0)
    ) {
      _mintMinerReward();
    }
    super._beforeTokenTransfer(from, to, value);
  }

  //buy ZCoin with Eth function
//  function buyWithEtherum() public payable {
//    _transfer(owner,msg.sender,msg.value * rate);
//  }

  //Transfer function
  function transferTo(address from,address to, uint256 amount) public {
    _transfer(from, to, amount);
    emit Transfer(from, to, amount);
  }

  function setBlockReward(uint256 _reward) public onlyOwner {
    blockReward = _reward * (10**18);
  }

  function setRate(uint256 _rate) public onlyOwner {
    rate = _rate;
  }
  //function destroy() public onlyOwner {
  //  selfdestruct(owner);
  //}
}
