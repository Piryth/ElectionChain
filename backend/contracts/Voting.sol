// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
import {IVoting} from "./IVoting.sol";
import {VotingEvents} from "./VotingEvents.sol";

/// @title A sample voting smart contract
/// @author Mikael VIVIER, Louison Prodhom, Arnaud Endignous
/// @notice You can use this contract for only the most basic simulation
/// @dev All function calls are currently implemented without side effects
/// @custom:experimental This is an experimental contract.
contract Voting is Ownable, IVoting, VotingEvents {

    // =================================== ATTRIBUTES ======================================

    WorkflowStatus public status;
    mapping(address => Voter) public voters;
    uint public voterCount;
    Proposals private proposalsVar;
    uint public winningProposalId;

    // =================================== CONSTRUCTOR ======================================


    constructor() Ownable(msg.sender){
        console.log("Registering address %s to vote", msg.sender);

        // Default voter value
        voters[msg.sender] = Voter(true, false, -1);

        status = WorkflowStatus.RegisteringVoters;

        // Default proposal for testing purpose
        proposalsVar.proposals.push(Proposal("First proposal", 0));
    }


    // =================================== MODIFIERS ======================================

    modifier onlyRegisteredVoter() {
        require(voters[msg.sender].isRegistered, "Not a registered voter");
        _;
    }

    // =================================== METHODS ======================================


    function registerVoter(address _voter) external onlyOwner {
        require(status == WorkflowStatus.RegisteringVoters, "Not allowed at this stage");
        require(!voters[_voter].isRegistered, "Already registered");
        voters[_voter].isRegistered = true;

        // We set at -1 by default
        voters[_voter].votedProposalId = -1;
        voterCount++;
        emit VoterRegistered(_voter);
    }

    function startProposalsRegistration() external onlyOwner {
        require(status == WorkflowStatus.RegisteringVoters, "Invalid status transition");
        status = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, status);
    }

    function registerProposal(string memory _description) external onlyRegisteredVoter {
        require(status == WorkflowStatus.ProposalsRegistrationStarted, "Proposals not open");

        console.log("Registering proposal %s", _description);
        proposalsVar.proposals.push(Proposal(_description, 0));
        console.log("Proposals count : ", proposalsVar.proposals.length);
        emit ProposalRegistered(proposalsVar.proposals.length - 1);
    }

    function endProposalsRegistration() external onlyOwner {
        require(status == WorkflowStatus.ProposalsRegistrationStarted, "Invalid status transition");
        status = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, status);
    }

    function startVotingSession() external onlyOwner {
        require(status == WorkflowStatus.ProposalsRegistrationEnded, "Invalid status transition");
        status = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, status);
    }

    function vote(uint _proposalId) external onlyRegisteredVoter {
        require(status == WorkflowStatus.VotingSessionStarted, "Voting not open");
        require(!voters[msg.sender].hasVoted, "Already voted");
        require(_proposalId < proposalsVar.proposals.length, "Invalid proposal ID");

        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposalId = int(_proposalId);
        proposalsVar.proposals[_proposalId].voteCount++;
        emit Voted(msg.sender, _proposalId);
    }

    function endVotingSession() external onlyOwner {
        require(status == WorkflowStatus.VotingSessionStarted, "Invalid status transition");
        status = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, status);
    }

    function tallyVotes() external onlyOwner {
        require(status == WorkflowStatus.VotingSessionEnded, "Invalid status transition");

        uint maxVotes = 0;
        for (uint i = 0; i < proposalsVar.proposals.length; i++) {
            if (proposalsVar.proposals[i].voteCount > maxVotes) {
                maxVotes = proposalsVar.proposals[i].voteCount;
                winningProposalId = i;
            }
        }

        status = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, status);
    }

    function getWinner() external view returns (string memory description, uint voteCount) {
        require(status == WorkflowStatus.VotesTallied, "Votes not tallied yet");
        return (proposalsVar.proposals[winningProposalId].description, proposalsVar.proposals[winningProposalId].voteCount);
    }

    //fonctionnalité 1
    function cancelVotes() external onlyOwner{
        require(status == WorkflowStatus.VotingSessionEnded, "Invalid status transition");
        uint votes=0;
        if (votes * 100 / voterCount < 34) {
            status = WorkflowStatus.VotingSessionCanceled;
            emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, status);
        }
    }

    //fonctionnalité 2
    function killElected() external onlyOwner {
        require(status == WorkflowStatus.VotesTallied, "Votes not tallied yet");
        require(proposalsVar.proposals.length > 1, "Not enough proposals to remove the winner");

        // Trouver le deuxième plus grand vote
        uint secondMaxVotes = 0;
        uint secondWinnerId = 0;

        for (uint i = 0; i < proposalsVar.proposals.length; i++) {
            if (i == winningProposalId) continue; // Ignorer le gagnant actuel

            if (proposalsVar.proposals[i].voteCount > secondMaxVotes) {
                secondMaxVotes = proposalsVar.proposals[i].voteCount;
                secondWinnerId = i;
            }
        }
        winningProposalId=secondWinnerId;
    }

    /// @notice Returns the total number of proposals in the contract
    /// @dev This function returns the length of proposals. You can use it to fetch full array
    /// @return The number of proposals (length of the `proposals` array).
    function getProposals() public view onlyRegisteredVoter returns (Proposals memory) {
        return proposalsVar;
    }

    /// @notice Reads a voter from its address
    function getVoter(address _address) public view onlyRegisteredVoter returns (Voter memory) {
        return voters[_address];
    }

}
