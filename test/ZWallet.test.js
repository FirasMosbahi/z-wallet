const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;

const ZWallet = artifacts.require('./ZWallet.sol');
const NFT = artifacts.require('./NFT.sol');
const ZCoin = artifacts.require('./ZCoin.sol');

contract('ZWallet', (accounts) => {
  let [owner, user, user2] = accounts;
  let zWallet;
  let nftContract;
  let zCoinContract;
  const mintCostWithEth = web3.utils.toWei('0.1', 'ether');
  const mintCostWithZtk = web3.utils.toWei('10', 'ether');

  before(async () => {
    zWallet = await ZWallet.new(10, 10, 100, 1, mintCostWithEth, mintCostWithZtk);

  });

  describe('Deployment', async () => {
    it('should deploy the ZWallet contract', async () => {
      assert.notEqual(zWallet.address, '');
      assert.notEqual(zWallet.address, undefined);
      assert.notEqual(zWallet.address, null);
      assert.notEqual(zWallet.address, 0x0);
      console.log(ZWallet.address);
    });

    /*it('should deploy the NFT contract', async () => {
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
    });*/

    it('should set the owner', async () => {
      const contractOwner = await zWallet.owner();
      assert.equal(contractOwner, owner);
    });
  });
 
  describe('ZCoin buying', async () => {
    it('should buy ZCoin with Ether', async () => {
       owner=zWallet.owner();
       zCoinContract=zWallet.zCoinContract;
       console.log(zCoinContract);
       await zWallet.buyZCoin({from:"0x3Fdd1274b5dfD6a5a054078f5a77C8114fF244fe",to:"0x3E8ea3741Fd597f29eb205F31Ee14A5aD4a07142",value: web3.utils.toWei("1", "ether")});
      /* assert.strictEqual(
        finalBalance.toString(),
        initialBalance.add(web3.utils.toBN("1")).toString(),
        "ZCoin balance was not increased by 1"
      );*/
    });
  });
  
});
