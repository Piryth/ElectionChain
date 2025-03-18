const { expect } = require("chai");
const { ethers } = require("hardhat");
const {deployContract} = require("./utils");

describe("Whitelist addresses", async () => {

    let Whitelist, whitelist, owner, addr1, addr2;

    beforeEach(async function () {
        // Deploy contract before each test
        [owner, addr1, addr2] = await ethers.getSigners();

        whitelist = await deployContract("Whitelist")
    });

    it("Should deploy and set the deployer as authorized", async function () {
        expect(await whitelist.whitelist(owner.address)).to.equal(true);
    });

    it("Should allow the owner to authorize another address", async function () {
        await whitelist.authorize(addr1.address);
        expect(await whitelist.whitelist(addr1.address)).to.equal(true);
    });

    it("Should emit Authorized event when an address is authorized", async function () {
        await expect(whitelist.authorize(addr1.address))
            .to.emit(whitelist, "Authorized")
            .withArgs(addr1.address);
    });

    it("Should prevent unauthorized addresses from authorizing others", async function () {
        await expect(
            whitelist.connect(addr1).authorize(addr2.address)
        ).to.be.revertedWith("Unauthorized");
    });
})