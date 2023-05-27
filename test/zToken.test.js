// Importing the dependencies
const { expect } = require('chai');
const { BN, ether, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const ZCoin = artifacts.require('ZCoin');
const MyNFT = artifacts.require('MyNFT');

contract('ZCoin', function ([deployer, user1, user2, user3]) {
  beforeEach(async function () {
    // Deploy ZCoin contract and mint some tokens for testing
    this.zcoin = await ZCoin.new({ from: deployer });
    this.initialSupply = new BN('500');

    // Transfer some tokens to user1 for testing
    //await this.zcoin.transfer(user1, 100, { from: deployer }); // 100 tokens instead of ether('100')
  });

  it('buy tokens', async function () {
    const value = ether('1');
    const expectedTokens = new BN('100000000000000000000');

    const receipt = await this.zcoin.buy({ from: user2, value });
    expectEvent(receipt, 'ZCoinSold', { seller: user2, amount: expectedTokens });

    expect(await this.zcoin.balanceOf(user2)).to.be.bignumber.equal(expectedTokens);
  });
});
