// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract ZCoin is ERC20Capped , ERC20Burnable{
  address payable public owner;
  uint256 public blockReward;
  uint256 public initialValue;
  uint256 public cappedAt;
  ufixed8x8 public rate;
  modifier onlyOwner {
    require(msg.sender == owner,"Only the owner can call this function");
    _;
  }
  constructor(uint256 _blockReward,uint256 initialValue,uint256 _cappedAt) ERC20("Z-Token" , "ZTK") ERC20Capped(cappedAt * (10**18)) {
    owner = payable(msg.sender);
    miningReward = _miningReward * (10**18);
    cappedAt = _cappedAt * (10**18);
    _mint(owner,initialValue * (10**18));
    blockReward = _blockReward * (10**18);
  }
  function _mint(address account,uint256 amount) internal virtual override(ERC20Capped, ERC20) {
    require(ERC20.totalSupply() + amount <= cap(), "ERC20Capped: cap exceeded");
    super._mint(account, amount);
  }
  function _mintMinerReward() internal {
    _mint(block.coinbase,blockReward);
  }
  function _beforeTokenTransfer(address from,address to,uint256 value) internal virtual override{
    if(from != address(0) && to != block.coinbase && block.coinbase != address(0)){
      _mintMinerReward();
    }
    super._beforeTokenTransfer(from,to,value);
  }
  function setBlockReward(uint256 reward) public onlyOwner {
    blockReward = reward * (10**18);
  }

  function destroy() public onlyOwner {
    selfdestruct(owner);
  }
}
