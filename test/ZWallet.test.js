const { expect } = require("chai");
const { assert } = require("chai");
const web3 = require('web3');
const BigNumber = web3.utils.BN;
const ZCoin = artifacts.require('ZCoin');

contract('ZCoin', async (accounts) => {
  let zCoinInstance;

  before(async () => {
    zCoinInstance = await ZCoin.deployed();
  });

  it('should deploy ZCoin contract', async () => {
    assert.ok(zCoinInstance.address);
  });

  it('should allow users to buy tokens', async () => {
    const tokenPrice1 =await zCoinInstance.token_price;
    console.log(tokenPrice1.toString());
    const tokenPrice=new BigNumber(tokenPrice1).toNumber();
   
    const tokensToBuy = 10;
    const totalCost = tokenPrice * tokensToBuy;


    // Account 1 buys tokens
    const account1 = accounts[1];
    const initialAccount1Balance = await web3.eth.getBalance(account1);
    const tx = await zCoinInstance.buy({ from: account1, value: totalCost });
    const gasUsed = tx.receipt.gasUsed;
    const txCost = gasUsed * (await web3.eth.getGasPrice());
    const finalAccount1Balance = await web3.eth.getBalance(account1);

    assert.equal(
      finalAccount1Balance.toString(),
      initialAccount1Balance
        .minus(totalCost)
        .minus(txCost)
        .toString(),
      'Account 1 balance should decrease by the total cost plus transaction fee'
    );

    assert.equal(
      (await zCoinInstance.balanceOf(account1)).toString(),
      tokensToBuy.toString(),
      'Account 1 should receive the correct amount of tokens'
    );

    assert.equal(
      (await zCoinInstance.balanceOf(zCoinInstance.address)).toString(),
      (10**21 - tokensToBuy).toString(),
      'ZCoin contract should have the correct remaining token supply'
    );
  })
});
