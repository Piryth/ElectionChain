const { ethers } = require('hardhat');

const deployContract = async (contractName, args) => {
    [signer] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory(contractName);
    const contract = await Contract.connect(signer).deploy(...(args || []));
    await contract.deployed();

    return contract;
};

module.exports = { deployContract};