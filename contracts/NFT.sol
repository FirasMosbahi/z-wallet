// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  address public owner;

  constructor(string memory _name, string memory _symbol)
  ERC721(_name, _symbol)
  {
    owner = msg.sender;
  }

  //minting function with the uri of the image uploaded to ipfs
  function mint(string memory tokenURI) public payable {
    _tokenIds.increment();

    uint256 newItemId = _tokenIds.current();
    _mint(msg.sender, newItemId);
    _setTokenURI(newItemId, tokenURI);
  }

  //transfer function
  function transferNFT(
    address from,
    address to,
    uint256 tokenId
  ) public {
    require(
      _isApprovedOrOwner(msg.sender, tokenId),
      "ERC721: transfer caller is not owner nor approved"
    );
    _transfer(from, to, tokenId);
  }

  function totalSupply() public view returns (uint256) {
    return _tokenIds.current();
  }

  function withdraw() public {
    require(msg.sender == owner);
    (bool success, ) = owner.call{value: address(this).balance}("");
    require(success);
  }
}
