// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ZCoin.sol";
import "./MyNFT.sol";

contract ZWallet {
    ZCoin private zCoinContract;
    address payable zCoinContractAddress;
    MyNFT private nftContract;
    address payable nftContractAddress;
    uint256 public nftMintCostInWei;
    uint256 public nftMintCostInZTK;
    event ZCoinSold(address seller, uint256 amount);
    uint256 public tokenCounter = 0;
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
    event NFTSold(uint256 id, address buyer, address seller, uint256 price);
    event ReceivedEth(address sender, uint256 amount);
    mapping(uint256=>NFTData) public allNFTs;
    constructor(
        address payable _zCoinAddress,
        address payable _nftContractAddress,
        uint256 _nftMintCostInWei,
        uint256 _nftMintCostInZTK
    ) {
        zCoinContractAddress = _zCoinAddress;
        zCoinContract = ZCoin(_zCoinAddress);
        nftContractAddress = _nftContractAddress;
        nftContract = MyNFT(_nftContractAddress);
        nftMintCostInWei = _nftMintCostInWei * (10**18);
        nftMintCostInZTK = _nftMintCostInZTK;
    }
    function getZCoinBalance(address account) public view returns(uint256){
        return zCoinContract.getBalance(account);
    }
    function transferZCoin(address from,address to, uint256 amount) public {
        zCoinContract.transferZCoin(from,to,amount);
    }
    function buyZCoin() public payable {
        uint256 tokensToBuy = (msg.value * zCoinContract.tokenPrice()) / 1 ether;
        require(
            zCoinContract.getBalance(zCoinContractAddress) >= tokensToBuy,
            "Not enough tokens available"
        );
        (bool success, ) = zCoinContractAddress.call{
            value: msg.value,
            gas: 1000000
        }("");
        require(success, "ETH transfer failed");
        zCoinContract.transferZCoin(
            zCoinContractAddress,
            msg.sender,
            tokensToBuy
        );
        emit ZCoinSold(msg.sender, tokensToBuy);
    }
    function mintNFTWithEth(
        string memory _tokenURI,
        string memory _name,
        string memory _description,
        uint256 _cost,
        bool _isForSale
    ) public payable {
        require(msg.value >= nftMintCostInWei, "You need ether to mint NFT");
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
        nftContract.mintNFT(newNFT.id, newNFT.uri, msg.sender);
        emit NFTMinted(
            newNFT.id,
            newNFT.name,
            newNFT.description,
            newNFT.uri,
            newNFT.cost,
            newNFT.isForSale,
            newNFT.owner
        );
        (bool success, ) = nftContractAddress.call{value: nftMintCostInWei, gas: 1000000}("");
        require(success, "ETH transfer failed");
    }

    function mintNFTWithZToken(
    string memory _tokenURI,
    string memory _name,
    string memory _description,
    uint256 _cost,
    bool _isForSale
) public returns(uint256){
    require(
        zCoinContract.getBalance(msg.sender) >= nftMintCostInZTK,
        "You need ZToken to mint NFT"
    );
    NFTData memory newNFT;
    newNFT.id = tokenCounter;
    newNFT.name = _name;
    newNFT.description = _description;
    newNFT.uri = _tokenURI;
    newNFT.cost = _cost;
    newNFT.isForSale = _isForSale;
    newNFT.owner = msg.sender;
    allNFTs[tokenCounter] = newNFT;
    tokenCounter += 1;
    nftContract.mintNFT(newNFT.id, newNFT.uri, msg.sender);
    emit NFTMinted(
        newNFT.id,
        newNFT.name,
        newNFT.description,
        newNFT.uri,
        newNFT.cost,
        newNFT.isForSale,
        newNFT.owner
    );        
    zCoinContract.transferZCoin(msg.sender, nftContractAddress, nftMintCostInZTK);
    return newNFT.id;
}

    function transferNFT(uint256 _tokenId) public returns (uint256){
        NFTData storage nft = allNFTs[_tokenId];
        require(nft.isForSale, "NFT is not for sale");
        require(msg.sender != nft.owner, "You are the owner of this NFT");
        require(zCoinContract.getBalance(msg.sender)>nft.cost , "You don't have enought coins tobuy this nft");
        address previousOwner = nft.owner;
        nft.owner = msg.sender;
        nftContract.transferNFT(_tokenId,msg.sender,previousOwner);
        zCoinContract.transferZCoin(msg.sender,previousOwner,nft.cost);
        emit NFTSold(_tokenId, previousOwner, msg.sender, nft.cost);
        return(nft.id);
    }
    function setNFTName(uint256 _id, string memory _name) public {
        require(allNFTs[_id].owner == msg.sender , "only the owner can modify a nft property");
        allNFTs[_id].name = _name;
    }

    function setNFTDescription(uint256 _id, string memory _description) public {
        require(allNFTs[_id].owner == msg.sender , "only the owner can modify a nft property");
        allNFTs[_id].description = _description;
    }

    function setNFTIsForSale(uint256 _id, bool _isForSale) public {
        require(allNFTs[_id].owner == msg.sender , "only the owner can modify a nft property");
        allNFTs[_id].isForSale = _isForSale;
    }
    function setNFTIsCost(uint256 _id, uint256 _cost) public {
        require(allNFTs[_id].owner == msg.sender , "only the owner can modify a nft property");
        allNFTs[_id].cost = _cost;
    }
}
