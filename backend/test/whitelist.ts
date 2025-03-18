import {expect} from "chai";
import {ethers} from "hardhat";
import {Contract, Signer} from "ethers";
import {deployContract} from "./utils";

describe("Whitelist addresses", function () {
  let whitelist: Contract;
    let owner: Signer, addr1: Signer, addr2: Signer;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();

        whitelist = await deployContract("Whitelist")
    });

    it("Should deploy and set the deployer as authorized", async function () {
        expect(await whitelist.whitelist(await owner.getAddress())).to.equal(true);
    });

    it("Should allow the owner to authorize another address", async function () {
        await whitelist.authorize(await addr1.getAddress());
        expect(await whitelist.whitelist(await addr1.getAddress())).to.equal(true);
    });

    it("Should emit Authorized event when an address is authorized", async function () {
        await expect(whitelist.authorize(await addr1.getAddress()))
            .to.emit(whitelist, "Authorized")
            .withArgs(await addr1.getAddress());
    });

    it("Should prevent unauthorized addresses from authorizing others", async function () {
        await expect(
            whitelist.connect(addr1).authorize(await addr2.getAddress())
        ).to.be.revertedWith("Unauthorized");
    });
});
