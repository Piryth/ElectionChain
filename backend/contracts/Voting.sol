// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable {
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    WorkflowStatus public status;
    mapping(address => Voter) public voters;
    Proposal[] public proposals;
    uint public winningProposalId;

    constructor() Ownable(msg.sender){}

    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted(address voter, uint proposalId);

    modifier onlyRegisteredVoter() {
        require(voters[msg.sender].isRegistered, "Not a registered voter");
        _;
    }

    function registerVoter(address _voter) external onlyOwner {
        require(status == WorkflowStatus.RegisteringVoters, "Not allowed at this stage");
        require(!voters[_voter].isRegistered, "Already registered");
        voters[_voter].isRegistered = true;
        emit VoterRegistered(_voter);
    }

    function startProposalsRegistration() external onlyOwner {
        require(status == WorkflowStatus.RegisteringVoters, "Invalid status transition");
        status = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, status);
    }

    function registerProposal(string memory _description) external onlyRegisteredVoter {
        require(status == WorkflowStatus.ProposalsRegistrationStarted, "Proposals not open");
        proposals.push(Proposal(_description, 0));
        emit ProposalRegistered(proposals.length - 1);
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
        require(_proposalId < proposals.length, "Invalid proposal ID");

        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposalId = _proposalId;
        proposals[_proposalId].voteCount++;
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
        for (uint i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > maxVotes) {
                maxVotes = proposals[i].voteCount;
                winningProposalId = i;
            }
        }

        status = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, status);
    }

    function getWinner() external view returns (string memory description, uint voteCount) {
        require(status == WorkflowStatus.VotesTallied, "Votes not tallied yet");
        return (proposals[winningProposalId].description, proposals[winningProposalId].voteCount);
    }
}
