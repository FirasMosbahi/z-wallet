const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;

const ZWallet = artifacts.require('./ZWallet.sol');
const NFT = artifacts.require('./NFT.sol');
const ZCoin = artifacts.require('./ZCoin.sol');

contract('ZWallet', (accounts) => {
  const [owner, user1, user2] = accounts;
  let zWallet;
  let nftContract;
  let zCoinContract;
  const mintCostWithEth = web3.utils.toWei('0.1', 'ether');
  const mintCostWithZtk = web3.utils.toWei('10', 'ether');

  before(async () => {
    zCoinContract = await ZCoin.new(10, 10, 100, 1);
    nftContract = await NFT.new('z-awesome-nfts', 'z-nft');
    zWallet = await ZWallet.new(10, 10, 100, 1, mintCostWithEth, mintCostWithZtk);

  });

  describe('Deployment', async () => {
    it('should deploy the ZWallet contract', async () => {
      assert.notEqual(zWallet.address, '');
      assert.notEqual(zWallet.address, undefined);
      assert.notEqual(zWallet.address, null);
      assert.notEqual(zWallet.address, 0x0);
    });

    it('should deploy the NFT contract', async () => {
      assert.notEqual(nftContract.address, '');
      assert.notEqual(nftContract.address, undefined);
      assert.notEqual(nftContract.address, null);
      assert.notEqual(nftContract.address, 0x0);
    });

    it('should deploy the ZCoin contract', async () => {
      assert.notEqual(zCoinContract.address, '');
      assert.notEqual(zCoinContract.address, undefined);
      assert.notEqual(zCoinContract.address, null);
      assert.notEqual(zCoinContract.address, 0x0);
    });

    it('should set the owner', async () => {
      const contractOwner = await zWallet.owner();
      assert.equal(contractOwner, owner);
    });
  });
 /*
  describe('ZCoin buying', async () => {
    it('should buy ZCoin with Ether', async () => {
        const balanceBefore = await zCoinContract.balanceOf(user1);
        const value = web3.utils.toWei('0.5', 'ether');
        const gasPrice = await web3.eth.getGasPrice();
        const gasCost = await zWallet.buyZCoin.estimateGas({ from: user1, value: value });
        const cost = parseInt(gasPrice) * parseInt(gasCost);
        const balanceBeforeWallet = await web3.eth.getBalance(zWallet.address);
        const balanceBeforeOwner = await web3.eth.getBalance(owner);
        await zWallet.buyZCoin({ from: user1, value: value });
        const balanceAfter = await zCoinContract.balanceOf(user1);
        const balanceAfterWallet = await web3.eth.getBalance(zWallet.address);
        const balanceAfterOwner = await web3.eth.getBalance(owner);
        assert.isTrue(balanceAfter > balanceBefore);
        assert.equal(balanceAfterWallet - balanceBeforeWallet, value - cost);
        assert.equal(balanceBeforeOwner - balanceAfterOwner, cost);
    });
  });*/
  
});
