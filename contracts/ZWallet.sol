// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "./NFT.sol";
import "./ZCoin.sol";

//This contract has instance of NFT and ZCoin contracts and he is the only one who should be deployed
contract ZWallet {
  address payable public owner;
  NFT nftContract;
  ZCoin zCoinContract;
  uint256 public mintingNFTCostWithETH;
  uint256 public mintingNFTCostWithZTK;
  event NFTMinted(
    uint256 id,
    address indexed nftOwner,
    string indexed tokenURI,
    bool forSale,
    uint256 cost,
    uint256 timestamp
  );
  event NFTSold(uint256 nftId, address seller, address buyer);
  struct MintedNFTsStruct {
    uint256 id;
    address nftOwner;
    string imageURI;
    bool forSale;
    uint256 cost;
    uint256 timestamp;
  }
  MintedNFTsStruct[] public nfts;
  modifier onlyOwner() {
    require(msg.sender == owner, "Only the owner can call this function");
    _;
  }

  constructor(
    uint256 _zBlockReward,
    uint256 _zInitialValue,
    uint256 _zCappedAt,
    uint256 _zRate,
    uint256 _mintCostETH,
    uint256 _mintCostZTK
  ) {
    owner = payable(msg.sender);
    nftContract = new NFT("z-awesome-nfts", "z-nft");
    zCoinContract = new ZCoin(
      _zBlockReward,
      _zInitialValue,
      _zCappedAt,
      _zRate
    );
    mintingNFTCostWithETH = _mintCostETH;
    mintingNFTCostWithZTK = _mintCostZTK;
  }

  //ZCoin buying function
  function buyZCoin() public payable {
    zCoinContract.buyWithEtherum{value: msg.value}();
  }

  //minting nft with Eth function
  function mintNFTWithEth(
    string memory _tokenURI,
    bool _forSale,
    uint256 _cost
  ) public payable {
    require(msg.value == mintingNFTCostWithETH, "No enought Eths");
    nftContract.mint(_tokenURI);

    nfts.push(
      MintedNFTsStruct(
        nftContract.totalSupply(),
        msg.sender,
        _tokenURI,
        _forSale,
        _cost,
        block.timestamp
      )
    );
    emit NFTMinted(
      nftContract.totalSupply(),
      msg.sender,
      _tokenURI,
      _forSale,
      _cost,
      block.timestamp
    );
  }

  //minting nft with ZTK function
  function mintNFTWithZTK(
    string memory _tokenURI,
    bool _forSale,
    uint256 _cost
  ) public {
    require(
      zCoinContract.balanceOf(msg.sender) >= mintingNFTCostWithZTK,
      "ZTK balance is not enought"
    );
    zCoinContract.transferTo(owner, _cost);
    nftContract.mint(_tokenURI);
    nfts.push(
      MintedNFTsStruct(
        nftContract.totalSupply(),
        msg.sender,
        _tokenURI,
        _forSale,
        _cost,
        block.timestamp
      )
    );
    emit NFTMinted(
      nftContract.totalSupply(),
      msg.sender,
      _tokenURI,
      _forSale,
      _cost,
      block.timestamp
    );
  }

  //buying nft function
  function buyNFT(uint256 nftId) public {
    for (uint256 i = 0; i < nfts.length; i++) {
      if (nfts[i].id == nftId) {
        require(
          zCoinContract.balanceOf(msg.sender) >= nfts[i].cost,
          "No enought ZTK"
        );
        require(nfts[i].forSale == true, "This NFT is not for sale");
        zCoinContract.transferTo(nfts[i].nftOwner, nfts[i].cost);
        nftContract.transferNFT(
          nfts[i].nftOwner,
          msg.sender,
          nfts[i].id
        );
        address seller = nfts[i].nftOwner;
        nfts[i].nftOwner = msg.sender;
        emit NFTSold(nfts[i].id, seller, msg.sender);
      }
    }
  }
}
