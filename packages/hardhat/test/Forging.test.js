const { expect } = require("chai");
const { ethers } = require("hardhat");

function revertReason(reason) {
  return `VM Exception while processing transaction: reverted with reason string '${reason}'`;
}

describe("Forging", function () {
  let account1addy = null;
  let account1 = null;
  let account2 = null;
  let Token = null;
  let token = null;
  let Forging = null;
  let forging = null;
  let provider = null;
  let tx = null;

  beforeEach(async () => {
    provider = await ethers.provider;

    [, account1, account2] = await ethers.getSigners();

    account1addy = account1.address;

    // first deploy the token
    Token = await ethers.getContractFactory("Token");
    token = await Token.deploy();
    await token.deployed();

    Forging = await ethers.getContractFactory("Forging");
    forging = await Forging.deploy(token.address);
    await forging.deployed();

    // transfer ownership of token to the forging app
    token.transferOwnership(forging.address);
  });

  describe("Forging Deployment", function () {
    it("should deploy to an address", async () => {
      expect(await token.address).to.not.be.null; // eslint-disable-line no-unused-expressions
      expect(await token.address).to.be.properAddress; // eslint-disable-line no-unused-expressions

      expect(await forging.address).to.not.be.null; // eslint-disable-line no-unused-expressions
      expect(await forging.address).to.be.properAddress; // eslint-disable-line no-unused-expressions

      // make sure we have all properties set as expected
      expect(await forging.SHIELD()).to.equal(3);
      expect(await forging.CROSSBOW()).to.equal(4);
      expect(await forging.ARROW()).to.equal(5);
      expect(await forging.SWORD()).to.equal(6);
      expect(await forging.COOLDOWNPERIOD()).to.equal(60);
      expect(function () {
        forging.token();
      }).to.throw(); // private variable
    });

    it("should mint and also respect the cooldown timer", async () => {
      expect(await forging.balanceOf(account1addy, 0)).to.equal(0);
      expect(await forging.balanceOf(account1addy, 1)).to.equal(0);
      expect(await forging.balanceOf(account1addy, 2)).to.equal(0);

      // mint token 0
      tx = await forging.connect(account1).mint(0);
      await tx.wait();
      expect(await forging.balanceOf(account1addy, 0)).to.equal(1);

      // we are in a cooldown now, so cannot mint
      await expect(forging.connect(account1).mint(1)).to.be.revertedWith(
        revertReason("Cannot mint! In Cooldown")
      );

      // now advance the time so that we can mint again
      await provider.send("evm_increaseTime", [60 + 1]); // cooldown timer is 1 minute

      tx = await forging.connect(account1).mint(1);
      await tx.wait();
      expect(await forging.balanceOf(account1addy, 1)).to.equal(1);

      // but tokens >= id 3 do not have cooldowns
      tx = await forging.connect(account1).mint(3);
      await tx.wait();
      expect(await forging.balanceOf(account1addy, 3)).to.equal(1);

      tx = await forging.connect(account1).mint(4);
      await tx.wait();
      expect(await forging.balanceOf(account1addy, 4)).to.equal(1);
    });

    it("should return the correct uri", async () => {
      expect(await forging.uri(0)).to.equal(
        "https://ipfs.io/ipfs/QmTdMVgk11h5hFjp7vbnb8h8NFm1o9rQZjoBSoiDpYSDwi/0"
      );
      expect(await forging.uri(100)).to.equal(
        "https://ipfs.io/ipfs/QmTdMVgk11h5hFjp7vbnb8h8NFm1o9rQZjoBSoiDpYSDwi/100"
      );
      expect(await forging.uri(2)).to.equal(
        "https://ipfs.io/ipfs/QmTdMVgk11h5hFjp7vbnb8h8NFm1o9rQZjoBSoiDpYSDwi/2"
      );
    });

    it("should return the correct baseUri", async () => {
      expect(await forging.baseUri()).to.equal(
        "https://ipfs.io/ipfs/QmcWrgVBPpAURR3jjcYoBGsa1UT7trG7Ze6DfGaEvMAebm/"
      );
    });

    it("should handle a trade correctly", async () => {
      expect(await forging.balanceOf(account1addy, 0)).to.equal(0);
      expect(await forging.balanceOf(account1addy, 4)).to.equal(0);

      // first mint some ids
      tx = await forging.connect(account1).mint(0);
      await tx.wait();
      await provider.send("evm_increaseTime", [60 + 1]); // cooldown timer is 1 minute

      expect(await forging.balanceOf(account1addy, 0)).to.equal(1);
      expect(await forging.balanceOf(account1addy, 4)).to.equal(0);

      // cannot trade right off the bat:
      await expect(forging.connect(account1).trade([0], 4)).to.be.revertedWith(
        revertReason("ERC1155: caller is not token owner nor approved")
      );

      // the trade involves a burn, so give approval
      tx = await token
        .connect(account1)
        .setApprovalForAll(forging.address, true);
      await tx.wait();

      tx = await forging.connect(account1).trade([0], 4);
      await tx.wait();

      expect(await forging.balanceOf(account1addy, 0)).to.equal(0);
      expect(await forging.balanceOf(account1addy, 4)).to.equal(1);
    });

    it("should handle a forge correctly", async () => {
      // first mint some ids
      tx = await forging.connect(account1).mint(0);
      await tx.wait();
      await provider.send("evm_increaseTime", [60 + 1]); // cooldown timer is 1 minute
      tx = await forging.connect(account1).mint(1);
      await tx.wait();
      await provider.send("evm_increaseTime", [60 + 1]); // cooldown timer is 1 minute
      tx = await forging.connect(account1).mint(2);
      await tx.wait();
      await provider.send("evm_increaseTime", [60 + 1]); // cooldown timer is 1 minute

      expect(await forging.balanceOf(account1addy, 0)).to.equal(1);
      expect(await forging.balanceOf(account1addy, 1)).to.equal(1);
      expect(await forging.balanceOf(account1addy, 2)).to.equal(1);

      // first, make sure contract cannot just burn users tokens
      await expect(
        forging.connect(account1).forge([0, 1, 2])
      ).to.be.revertedWith(
        revertReason("ERC1155: caller is not token owner nor approved")
      );

      // so give permissions first
      tx = await token
        .connect(account1)
        .setApprovalForAll(forging.address, true);
      await tx.wait();

      tx = await forging.connect(account1).forge([0, 1, 2]);
      await tx.wait();

      expect(await forging.balanceOf(account1addy, 6)).to.equal(1);
      // we burned these
      expect(await forging.balanceOf(account1addy, 0)).to.equal(0);
      expect(await forging.balanceOf(account1addy, 1)).to.equal(0);
      expect(await forging.balanceOf(account1addy, 2)).to.equal(0);

      // try more combinations
      tx = await forging.connect(account1).mint(0);
      await tx.wait();
      await provider.send("evm_increaseTime", [60 + 1]); // cooldown timer is 1 minute
      tx = await forging.connect(account1).mint(1);
      await tx.wait();
      await provider.send("evm_increaseTime", [60 + 1]); // cooldown timer is 1 minute

      tx = await forging.connect(account1).forge([0, 1]);
      await tx.wait();
      expect(await forging.balanceOf(account1addy, 3)).to.equal(1);
      // we burned these
      expect(await forging.balanceOf(account1addy, 0)).to.equal(0);
      expect(await forging.balanceOf(account1addy, 1)).to.equal(0);

      // try more combinations
      tx = await forging.connect(account1).mint(0);
      await tx.wait();
      await provider.send("evm_increaseTime", [60 + 1]); // cooldown timer is 1 minute
      tx = await forging.connect(account1).mint(2);
      await tx.wait();
      await provider.send("evm_increaseTime", [60 + 1]); // cooldown timer is 1 minute

      tx = await forging.connect(account1).forge([0, 2]);
      await tx.wait();
      expect(await forging.balanceOf(account1addy, 5)).to.equal(1);
      // we burned these
      expect(await forging.balanceOf(account1addy, 0)).to.equal(0);
      expect(await forging.balanceOf(account1addy, 2)).to.equal(0);

      // try more combinations
      tx = await forging.connect(account1).mint(1);
      await tx.wait();
      await provider.send("evm_increaseTime", [60 + 1]); // cooldown timer is 1 minute
      tx = await forging.connect(account1).mint(2);
      await tx.wait();
      await provider.send("evm_increaseTime", [60 + 1]); // cooldown timer is 1 minute

      tx = await forging.connect(account1).forge([1, 2]);
      await tx.wait();
      expect(await forging.balanceOf(account1addy, 4)).to.equal(1);
      // we burned these
      expect(await forging.balanceOf(account1addy, 1)).to.equal(0);
      expect(await forging.balanceOf(account1addy, 2)).to.equal(0);

      await provider.send("evm_increaseTime", [60 + 1]); // cooldown timer is 1 minute

      tx = await forging.connect(account1).mint(1);
      await tx.wait();
      await provider.send("evm_increaseTime", [60 + 1]); // cooldown timer is 1 minute
      tx = await forging.connect(account1).mint(2);
      await tx.wait();
      await provider.send("evm_increaseTime", [60 + 1]); // cooldown timer is 1 minute

      await expect(forging.connect(account1).forge([1, 2])).to.emit(
        forging,
        "Forge"
      );
    });

    it("should return the correct total supply", async () => {
      tx = await forging.connect(account1).mint(1);
      await tx.wait();
      await provider.send("evm_increaseTime", [60 + 1]); // cooldown timer is 1 minute

      tx = await forging.connect(account2).mint(1);
      await tx.wait();
      await provider.send("evm_increaseTime", [60 + 1]); // cooldown timer is 1 minute

      expect(await forging.totalSupply(1)).to.equal(2);
    });
  });
});
