// SPDX-License-Identifier: MIT
//TODO: ad setters for nft attributes and add events
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./ZCoin.sol";

contract MyNFT is ERC721URIStorage {
    address payable owner;
    uint256 public tokenCounter;
    struct NFTData {
        uint256 id;
        string name;
        string description;
        string uri;
        uint256 cost;
        bool isForSale;
        address owner;
    }
    event NFTMinted(
        uint256 id,
        string name,
        string description,
        string uri,
        uint256 cost,
        bool isForSale,
        address owner
    );
    event test(uint256 amount , uint256 required);
    event NFTSold(uint256 id, address buyer, address seller, uint256 price);
    event ReceivedEth(address sender, uint256 amount);
    NFTData[] public allNFTs;
    constructor() ERC721("TheAwesomeNFT", "TANFT") {
        owner = payable (msg.sender);
        tokenCounter = 0;
    }
    fallback() external payable {
        emit ReceivedEth(msg.sender, msg.value);
    }

    receive() external payable {
        emit ReceivedEth(msg.sender, msg.value);
    }
    function mintNFT(
        uint256 _id,
        string memory _tokenURI,
        address _owner
    ) public {
        _mint(_owner, _id);
        _setTokenURI(_id, _tokenURI);
    }
    function transferNFT(uint256 _tokenId, address _newOwner,address _previousOwner) public {
        _transfer(_previousOwner, _newOwner, _tokenId);
    }
}