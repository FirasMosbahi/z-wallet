var nft = artifacts.require("./NFT.sol");
var zCoin=artifacts.require("./ZCoin.sol");
var zWallet=artifacts.require("./ZWallet.sol");
module.exports = async function(deployer) {
  const zBlockReward = 1000;
  const zInitialValue = 100000;
  const zCappedAt = 1000000;
  const zRate = 1;
  const mintCostETH = web3.utils.toWei("0.1", "ether"); // 0.1 ether
  const mintCostZTK = web3.utils.toWei("1000", "ether"); // 1000 ZTK

  // Deploy contracts
  await deployer.deploy(nft, "z-awesome-nfts", "z-nft");

  await deployer.deploy(zCoin, zBlockReward, zInitialValue, zCappedAt, zRate);

  await deployer.deploy(
    zWallet,
    zBlockReward,
    zInitialValue,
    zCappedAt,
    zRate,
    mintCostETH,
    mintCostZTK
  );
};
