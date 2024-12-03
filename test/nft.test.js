// Importing the dependencies
const { expect } = require('chai');
const { BN, ether, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const ZCoin = artifacts.require('ZCoin');
const MyNFT = artifacts.require('MyNFT');

contract('MyNFT', function ([deployer, user1, user2, user3]) {
    beforeEach(async function () {
    // Deploy ZCoin and MyNFT contracts and mint some tokens for testing
    this.zcoin = await ZCoin.new({ from: deployer });
    this.nft = await MyNFT.new(this.zcoin.address, { from: deployer });
    // Transfer some tokens to user1 for testing
    const value1 = ether('10');
    await this.zcoin.buy({ from: user2, value1 });
});


    it('create collectible', async function () {
        const value = ether('1');
        const tokenURI = 'https://example.com/token/1';
        const name = 'Token 1';
        const description = 'Description for Token 1';
        const cost = ether('1');
        const isForSale = true;

        const receipt = await this.nft.createCollectible(tokenURI, name, description, cost, isForSale, { from: user1, value });
        expectEvent(receipt, 'NFTMinted', { id: new BN('0'), name, description, uri: tokenURI, cost, isForSale, owner: user1 });

        expect(await this.nft.ownerOf('0')).to.equal(user1);
    });

    it('mint with token', async function () {
        const tokenURI = 'https://example.com/token/2';
        const name = 'Token 2';
        const description = 'Description for Token 2';
        const cost = ether('1');
        const isForSale = true;

        await this.zcoin.approve(this.nft.address, ether('1'), { from: user1 });
        const receipt = await this.nft.mintWithToken(tokenURI, name, description, cost, isForSale, { from: user1 });
        expectEvent(receipt, 'NFTMinted', { id: new BN('0'), name, description, uri: tokenURI, cost, isForSale, owner: user1 });

        expect(await this.nft.ownerOf('0')).to.equal(user1);
    });

    it('buy NFT', async function () {
        const tokenURI = 'https://example.com/token/3';
        const name = 'Token 3';
        const description = 'Description for Token 3';
        const cost = ether('1');
        const isForSale = true;

        // Mint a new NFT with token from user1
        await this.zcoin.approve(this.nft.address, ether('1'), { from: user1 });
        await this.nft.mintWithToken(tokenURI, name, description, cost, isForSale, { from: user1 });

        // User2 buys the NFT from user1
        await this.zcoin.transfer(user2, cost, { from: deployer }); // Ensure user2 has enough tokens
        await this.zcoin.approve(this.nft.address, cost, { from: user2 }); // Approve the NFT contract to spend user2's tokens
        const receipt = await this.nft.buyNFT(0, { from: user2 }); // 0 is the tokenID of the NFT

        // Validate the result
        expectEvent(receipt, 'NFTSold', { id: new BN('0'), buyer: user2, seller: user1, price: cost });
        expect(await this.nft.ownerOf('0')).to.equal(user2);
    });
})
