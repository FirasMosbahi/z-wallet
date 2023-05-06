// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721Enumerable, Ownable {
  using Strings for uint256;
  string private baseURI;
  string public baseExtension = "json";
  string public baseImage = "webp";

  constructor(
    string memory _name,
    string memory _symbol,
    string memory _initBaseURI
  ) ERC721(_name, _symbol) {
    baseURI = _initBaseURI;
  }

  function setBaseURI(string memory _newBaseURI) public onlyOwner {
    baseURI = _newBaseURI;
  }

  function mint() public {
    uint256 supply = totalSupply();
    _safeMint(msg.sender, supply);
    //    minted.push(MintedStruct(supply+1,msg.sender,toImage(supply+1),block.timestamp));
    //    emit Minted(supply+1,msg.sender,tokenURI(supply+1),block.timestamp);
  }

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

  function tokenURI(uint256 tokenId)
  public
  view
  virtual
  override
  returns (string memory)
  {
    require(_exists(tokenId), "ERC721Metadata:No token with this id");
    return
    bytes(baseURI).length > 0
    ? string(abi.encodePacked(baseURI, tokenId, baseImage))
    : "";
  }

  function toImage(uint256 tokenId)
  public
  view
  virtual
  returns (string memory)
  {
    return
    bytes(baseURI).length > 0
    ? string(abi.encodePacked(baseURI, tokenId, baseImage))
    : "";
  }
  //  function getAnNFt(uint256 tokenId) public view returns (MintedStruct memory){
  //    return minted[tokenId-1];
  //  }
  //  function transferTo(address to, uint256 tokenId) public {
  //    require(msg.sender == minted[tokenId-1].nftOwner , "only the owner of the nft can send it");
  //    minted[tokenId-1].nftOwner = to;
  //  }
}
