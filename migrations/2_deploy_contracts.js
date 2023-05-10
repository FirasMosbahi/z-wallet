var nft = artifacts.require("./MyNFT.sol");
var zCoin=artifacts.require("./ZCoin.sol");
module.exports = async function(deployer) {
 await deployer.deploy(zCoin);
 const zCoinInstance = await zCoin.deployed();
 await deployer.deploy(nft,zCoinInstance.address);
};
