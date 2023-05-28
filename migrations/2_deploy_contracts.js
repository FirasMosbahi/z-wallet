var nft = artifacts.require("./MyNFT.sol");
var zCoin=artifacts.require("./ZCoin.sol");
module.exports = async function(deployer) {
    const tokenPrice = 100; // Set your desired token price
  const initialSupply = 100000000; // Set your desired initial suppl
 await deployer.deploy(zCoin,tokenPrice,initialSupply);
 await deployer.deploy(nft);
};
