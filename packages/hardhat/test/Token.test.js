const { expect, assert } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

describe("Token", function () {
  let deployer;
  let deployeraddy;
  let account1addy;
  let account1;
  let Token;
  let token;

  beforeEach(async () => {
    [deployer, account1] = await ethers.getSigners();

    deployeraddy = deployer.address;
    account1addy = account1.address;
    Token = await ethers.getContractFactory("Token");
    token = await Token.deploy();
    await token.deployed();
  })

  describe("Token Deployment", function () {

    it("should deploy to an address", async () => {
      expect(await token.address).to.not.be.null;
      expect(await token.address).to.be.properAddress;

      // make sure we have all properties set
      expect(await token.name()).to.equal("The Forge of Chains");
      expect(await token.symbol()).to.equal("TFC");
      expect(await token.IMAGE_URI()).to.equal("https://ipfs.io/ipfs/QmcWrgVBPpAURR3jjcYoBGsa1UT7trG7Ze6DfGaEvMAebm/");
      expect(await token.IRON()).to.equal(0);
      expect(await token.CARBON()).to.equal(1);
      expect(await token.WOOD()).to.equal(2);

      expect(await token.balanceOf(token.address, 0)).to.equal(0);
      expect(await token.balanceOf(token.address, 1)).to.equal(0);
      expect(await token.balanceOf(token.address, 2)).to.equal(0);
      expect(await token.balanceOf(token.address, 3)).to.equal(0);
      expect(await token.balanceOf(token.address, 4)).to.equal(0);
      expect(await token.balanceOf(token.address, 5)).to.equal(0);
      expect(await token.balanceOf(token.address, 6)).to.equal(0);
    })
  })

  describe("Token Core Contract", function () {
    it("should mint correctly", async () => {
      let tx = await token.mint(account1addy, 0, 1);
      await tx.wait();
      expect(await token.balanceOf(account1addy, 0)).to.equal(1);

      tx = await token.mint(account1addy, 2, 10);
      await tx.wait();

      expect(await token.balanceOf(account1addy, 2)).to.equal(10);
      // dont affect id 1:
      expect(await token.balanceOf(account1addy, 0)).to.equal(1);
    })

    it("should burn correctly", async () => {
      let tx = await token.mint(account1addy, 0, 1);
      await tx.wait();

      expect(await token.balanceOf(account1addy, 0)).to.equal(1);

      tx = await token.mint(account1addy, 2, 4);
      await tx.wait();
      expect(await token.balanceOf(account1addy, 2)).to.equal(4);

      // first, we need approval, so try without - should throw
      await expect(token.burn(account1addy, 0, 1)).to.be.revertedWith("ERC1155: caller is not token owner nor approved");

      // now give approval first
      tx = await token.connect(account1).setApprovalForAll(deployeraddy, true);
      await tx.wait();

      await expect(token.burn(account1addy, 0, 1));
      expect(await token.balanceOf(account1addy, 0)).to.equal(0);

      await expect(token.burn(account1addy, 2, 2));
      expect(await token.balanceOf(account1addy, 2)).to.equal(2);

      await expect(token.burn(account1addy, 2, 2));
      expect(await token.balanceOf(account1addy, 2)).to.equal(0);
    })

    it("should burn a batch correctly", async () => {
      let tx = await token.mint(account1addy, 0, 1);
      await tx.wait();

      expect(await token.balanceOf(account1addy, 0)).to.equal(1);

      tx = await token.mint(account1addy, 2, 2);
      await tx.wait();
      expect(await token.balanceOf(account1addy, 2)).to.equal(2);

      tx = await token.mint(account1addy, 1, 1);
      await tx.wait();
      expect(await token.balanceOf(account1addy, 1)).to.equal(1);

      // now we have 3 different token types. Now burn them all in one call:
      // first, we need approval, so try without - should throw
      await expect(token.burn(account1addy, 0, 1)).to.be.revertedWith("ERC1155: caller is not token owner nor approved");

      // now give approval first
      tx = await token.connect(account1).setApprovalForAll(deployeraddy, true);
      await tx.wait();

      tx = await token.burnBatch(account1addy, [0, 1, 2], [1, 1, 1]);
      await tx.wait();

      expect(await token.balanceOf(account1addy, 0)).to.equal(0);
      expect(await token.balanceOf(account1addy, 1)).to.equal(0);
      expect(await token.balanceOf(account1addy, 2)).to.equal(1);

      tx = await token.burnBatch(account1addy, [2], [1]);
      await tx.wait();
      
      expect(await token.balanceOf(account1addy, 2)).to.equal(0);
    })

    it("should return the uri for a token ID", async () => {
      expect(await token.uri(0)).to.equal("https://ipfs.io/ipfs/QmTdMVgk11h5hFjp7vbnb8h8NFm1o9rQZjoBSoiDpYSDwi/0");
      expect(await token.uri(1)).to.equal("https://ipfs.io/ipfs/QmTdMVgk11h5hFjp7vbnb8h8NFm1o9rQZjoBSoiDpYSDwi/1");
      expect(await token.uri(100)).to.equal("https://ipfs.io/ipfs/QmTdMVgk11h5hFjp7vbnb8h8NFm1o9rQZjoBSoiDpYSDwi/100");

      let errorhappened;
      try {
        await token.uri(-1);
        errorhappened = false;
      } catch {
        errorhappened = true;
      }
      assert(errorhappened);
    })
  })
});