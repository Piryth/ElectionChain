const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployContract } = require("./utils");

describe("Testing Increment/Decrement contract", async () => {
    let alice;
    let aliceAddr;
    let contract;

    before(async () => {
        [alice] = await ethers.getSigners();
        aliceAddr = await alice.getAddress();

        //deploy contract
        contract = await deployContract("IncrementDecrement");
    });

    it("should increment the counter", async () => {
        await contract.increment();
        expect(await contract.counter()).to.equal(1);
    });
    it("should reset the counter", async () => {
        expect(await contract.counter()).to.equal(1);
        await contract.reset();
        expect(await contract.counter()).to.equal(0);
    });
    it("should decrement the counter", async () => {
        await contract.decrement();
        expect(await contract.counter()).to.equal(-1);
    });
});