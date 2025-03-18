import {Contract, Signer} from "ethers";
import {ethers} from "hardhat";

export const deployContract = async (
    contractName: string,
    args: any[] = []
): Promise<Contract> => {
    const [signer] = await ethers.getSigners();
    const ContractFactory = await ethers.getContractFactory(contractName);
    const contract = await ContractFactory.connect(signer).deploy(...args);
    await contract.deployed();

    return contract;
};

module.exports = { deployContract};