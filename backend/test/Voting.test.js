const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Voting Contract", function () {
    let Voting, voting, owner, voter1;

    beforeEach(async function () {
        [owner, voter1] = await ethers.getSigners();
        Voting = await ethers.getContractFactory("Voting");
        voting = await Voting.deploy();
    });

    it("should register a voter correctly", async function () {
        await voting.registerVoter(voter1.address);
        const voter = await voting.voters(voter1.address);

        expect(voter.isRegistered).to.equal(true);
        expect(voter.hasVoted).to.equal(false);
    });


    it("should allow voting and determine the correct winner", async function () {
        // Ajout de l'électeur
        await voting.registerVoter(voter1.address);

        // Démarrage de l'enregistrement des propositions
        await voting.startProposalsRegistration();
        await voting.connect(voter1).registerProposal("Proposal 1");
        await voting.endProposalsRegistration();

        // Démarrage de la session de vote
        await voting.startVotingSession();
        await voting.connect(voter1).vote(0);
        await voting.endVotingSession();

        // Comptage des votes
        await voting.tallyVotes();

        // Vérification du gagnant
        const winner = await voting.getWinner();
        expect(winner.description).to.equal("Proposal 1");
    });

});
