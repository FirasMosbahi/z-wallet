const ZCoin = artifacts.require("ZCoin");
const MyNFT = artifacts.require("MyNFT");
const ZWallet = artifacts.require("ZWallet");

module.exports = async function (deployer) {
  deployer.deploy(ZCoin, 100, 100000000) // Set your desired token price and initial supply
    .then(() => deployer.deploy(MyNFT))
    .then(() => deployer.deploy(
      ZWallet,
      ZCoin.address,
      MyNFT.address,
      10000, // Set your desired mint cost in Wei
      10 // Set your desired mint cost in ZTK
    ));
};
