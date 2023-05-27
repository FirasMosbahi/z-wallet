// SPDX-License-Identifier: MIT
//TODO: ad setters for nft attributes and add events
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./ZCoin.sol";
contract MyNFT is ERC721URIStorage {
    ZCoin private token;
    uint256 public tokenCounter;
    uint256 public price_in_wei = 10 ** 16;
    uint256 public price_ini_ztk = 10 ** 18;

    struct NFTData {
        uint256 id;
        string name;
        string description;
        string uri;
        uint256 cost;
        bool isForSale;
        address owner;
    }
    event NFTMinted(uint256 id,string name,string description,string uri,uint256 cost,bool isForSale,address owner);
    event NFTSold(uint256 id,address buyer,address seller,uint256 price);
    mapping(uint256 => NFTData) public allNFTs;

    constructor(address _token) ERC721("TheAwesomeNFT", "TANFT") {
        tokenCounter = 0;
        token = ZCoin(_token);
    }
    //function _burn(uint256 tokenId) internal override(ERC721URIStorage) {
    //    super._burn(tokenId);
    //    if (bytes(allNFTs[tokenId].uri).length != 0) {
    //        delete allNFTs[tokenId].uri;
    //    }
    //}
    function createCollectible(string memory _tokenURI,string memory _name,string memory _description,uint256 _cost,bool _isForSale) public payable returns (uint256) {
        require(msg.value == price_in_wei, "You need ether to mint NFT");
        NFTData memory newNFT;
        newNFT.id = tokenCounter;
        tokenCounter += 1;
        newNFT.name = _name;
        newNFT.description = _description;
        newNFT.uri = _tokenURI;
        newNFT.cost = _cost;
        newNFT.isForSale = _isForSale;
        newNFT.owner = msg.sender;
        allNFTs[newNFT.id] = newNFT;
        _mint(msg.sender, newNFT.id);
        _setTokenURI(newNFT.id, _tokenURI);
        payable(address(this)).transfer(msg.value);
        emit NFTMinted(newNFT.id, newNFT.name, newNFT.description, newNFT.uri, newNFT.cost, newNFT.isForSale, newNFT.owner);
        return newNFT.id;
    }

    function mintWithToken(string memory _tokenURI,string memory _name,string memory _description,uint256 _cost,bool _isForSale) public returns (uint256) {
        require(token.balanceOf(msg.sender) >= price_ini_ztk, "You need ZToken to mint NFT");
        NFTData memory newNFT;
        newNFT.id = tokenCounter;
        newNFT.name = _name;
        newNFT.description = _description;
        tokenCounter += 1;
        newNFT.uri = _tokenURI;
        newNFT.cost = _cost;
        newNFT.isForSale = _isForSale;
        newNFT.owner = msg.sender;

        allNFTs[newNFT.id] = newNFT;
        _mint(msg.sender, newNFT.id);
        _setTokenURI(newNFT.id, _tokenURI);
        token.transferCoin(msg.sender, address(this), price_ini_ztk);
        emit NFTMinted(newNFT.id,newNFT.name,newNFT.description, newNFT.uri, newNFT.cost, newNFT.isForSale, newNFT.owner);
        return newNFT.id;
    }
    function buyNFT(uint256 _tokenId) public {
        NFTData storage nft = allNFTs[_tokenId];
        require(nft.isForSale, "NFT is not for sale");
        require(token.balanceOf(msg.sender) == nft.cost, "insufficient balance");
        require(msg.sender != nft.owner, "You are the owner of this NFT");
        address previousOwner = nft.owner;
        nft.owner = msg.sender;
        _transfer(previousOwner, msg.sender, _tokenId);
        token.transferFrom(msg.sender, previousOwner, nft.cost);
        emit NFTSold(_tokenId, previousOwner, msg.sender, nft.cost);
    }
    function setNFTName(uint256 _id,string memory _name) public {
        allNFTs[_id].name = _name;
    }
    function setNFTDescription(uint256 _id,string memory _description) public {
        allNFTs[_id].description = _description;
    }
    function setNFTIsForSale(uint256 _id,bool _isForSale) public {
        allNFTs[_id].isForSale = _isForSale;
    }
}