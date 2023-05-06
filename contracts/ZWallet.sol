// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "./NFT.sol";
import "./ZCoin.sol";

contract ZWallet {
  address payable public owner;
  string nftBaseURI;
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
    string imageURL;
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
    string memory _nftBaseURI,
    uint256 _mintCostETH,
    uint256 _mintCostZTK
  ) {
    owner = payable(msg.sender);
    nftContract = new NFT("z-awesome-nfts", "z-nft", _nftBaseURI);
    nftBaseURI = _nftBaseURI;
    zCoinContract = new ZCoin(
      _zBlockReward,
      _zInitialValue,
      _zCappedAt,
      _zRate
    );
    mintingNFTCostWithETH = _mintCostETH;
    mintingNFTCostWithZTK = _mintCostZTK;
  }

  function buyZCoin() public payable {
    zCoinContract.buyWithEtherum{value: msg.value}();
  }

  function mintNFTWithEth(bool _forSale, uint256 _cost) public payable {
    nftContract.mint();
    nfts.push(
      MintedNFTsStruct(
        nftContract.totalSupply(),
        msg.sender,
        nftContract.toImage(nftContract.totalSupply()),
        _forSale,
        _cost,
        block.timestamp
      )
    );
    emit NFTMinted(
      nftContract.totalSupply(),
      msg.sender,
      nftContract.toImage(nftContract.totalSupply()),
      _forSale,
      _cost,
      block.timestamp
    );
  }

  function mintNFTWithZTK(bool _forSale, uint256 _cost) public {
    require(zCoinContract.balanceOf(msg.sender) >= mintingNFTCostWithZTK);
    zCoinContract.transferTo(owner, _cost);
    nftContract.mint();
    nfts.push(
      MintedNFTsStruct(
        nftContract.totalSupply(),
        msg.sender,
        nftContract.toImage(nftContract.totalSupply()),
        _forSale,
        _cost,
        block.timestamp
      )
    );
    emit NFTMinted(
      nftContract.totalSupply(),
      msg.sender,
      nftContract.toImage(nftContract.totalSupply()),
      _forSale,
      _cost,
      block.timestamp
    );
  }

  function sellNFT(uint256 nftId) public {
    for (uint256 i = 0; i < nfts.length; i++) {
      if (nfts[i].id == nftId) {
        require(zCoinContract.balanceOf(msg.sender) >= nfts[i].cost);
        require(nfts[i].forSale == true);
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
