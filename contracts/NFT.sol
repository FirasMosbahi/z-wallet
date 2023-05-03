// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721Enumerable, Ownable{
  using Strings for uint256;
  string _baseURI;
  string public baseExtension = "json";
  string public baseImage = "webp";
  bool public paused = false;
  event Minted(
    uint256 id,
    address indexed nftOwner,
    uint256 cost,
    string indexed tokenURI,
    uint256 timestamp
  );
  struct MintedStruct {
    uint256 id;
    address nftOwner;
    uint256 cost;
    string imageURL;
    uint256 timestamp;
  }
  MintedStruct[] public minted;
  constructor(string memory _name,string memory _symbol,string memory _initBaseURI) ERC721(_name,_symbol) {
    _baseURI = _initBaseURI;
  }
  function setBaseURI(string memory _newBaseURI) public  onlyOwner {
    _baseURI = _newBaseURI;
  }
  function mint(uint256 _cost) public {
    uint256 supply = totalSupply();
    _safeMint(msg.sender, supply+1);
    minted.push(MintedStruct(supply+1,msg.sender,_cost,toImage(supply+1),block.timestamp));
    emit Minted(supply+1,msg.sender,_cost,tokenURI(supply+1),block.timestamp);
  }
  function tokenURI(uint256 tokenId) public view virtual override returns (string memory){
    require(_exists(tokenId),"ERC721Metadata:No token with this id");
    return bytes(_baseURI).length > 0
    ? string(abi.encodePacked(_baseURI,tokenId,baseImage))
    : "";
  }
  function toImage(uint256 tokenId) internal view virtual returns (string memory) {
    return bytes(_baseURI).length > 0
    ? string(abi.encodePacked(_baseURI,tokenId,baseImage))
    : "";
  }
  function getAnNFt(uint256 tokenId) public view returns (MintedStruct memory){
    return minted[tokenId-1];
  }
  function transferTo(address to, uint256 tokenId) public {
    require(msg.sender == minted[tokenId-1].nftOwner , "only the owner of the nft can send it");
    minted[tokenId-1].nftOwner = to;
  }
}
