var nft = artifacts.require("./NFT.sol");
var zCoin=artifacts.require("./ZCoin.sol");
var zWallet=artifacts.require("./ZWallet.sol");
module.exports = async function(deployer) {
  const zBlockReward = 1000;
  const zInitialValue = 100000;
  const zCappedAt = 1000000;
  const zRate = 1;
  const nftBaseURI = "https://z-awesome-nfts.com/token/";
  const mintCostETH = web3.utils.toWei("0.1", "ether"); // 0.1 ether
  const mintCostZTK = web3.utils.toWei("1000", "ether"); // 1000 ZTK

  // Deploy contracts
  await deployer.deploy(nft, "z-awesome-nfts", "z-nft", nftBaseURI);
  const nftContract = await nft.deployed();

  await deployer.deploy(zCoin, zBlockReward, zInitialValue, zCappedAt, zRate);
  const zCoinContract = await zCoin.deployed();

  await deployer.deploy(
    zWallet,
    zBlockReward,
    zInitialValue,
    zCappedAt,
    zRate,
    nftBaseURI,
    mintCostETH,
    mintCostZTK
  );
  const zWalletContract = await zWallet.deployed();
  // Set the NFT and ZCoin contract addresses in ZWallet
  await zWalletContract.setNFTContract(nftContract.address);
  await zWalletContract.setZCoinContract(zCoinContract.address);
};
