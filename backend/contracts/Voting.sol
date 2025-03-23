// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
import {IVoting} from "./IVoting.sol";
import {VotingEvents} from "./VotingEvents.sol";

/// @title A sample voting smart contract
/// @author Mikael VIVIER, Louison Prodhomme, Arnaud Endignous
/// @notice You can use this contract for only the most basic simulation
/// @dev All function calls are currently implemented without side effects
/// @custom:experimental This is an experimental contract.
contract Voting is Ownable, IVoting, VotingEvents {

    // =================================== ATTRIBUTES ======================================

    /// @notice Current workflow status
    WorkflowStatus public status;

    /// @notice Mapping of voters by address
    mapping(address => Voter) public voters;

    /// @notice List of voter addresses
    address[] public voterAddresses;

    /// @notice Total number of voters
    uint public voterCount;

    /// @notice List of proposals
    uint public votes;
    Proposals private proposalsVar;

    /// @notice ID of the winning proposal
    uint public winningProposalId;

    // =================================== CONSTRUCTOR ======================================

    /// @notice Contract constructor
    constructor() Ownable(msg.sender){
        console.log("Registering address %s to vote", msg.sender);

        // Default voter value
        voters[msg.sender] = Voter(true, false, - 1, msg.sender);

        status = WorkflowStatus.RegisteringVoters;

        // Default proposal for testing
        proposalsVar.proposals.push(Proposal("First proposal", 0));

        // Add owner's address to the list of addresses
        voterAddresses.push(msg.sender);
    }

    // =================================== MODIFIERS ======================================

    /// @notice Checks if the caller is a registered voter
    modifier onlyRegisteredVoter() {
        require(voters[msg.sender].isRegistered, "Not a registered voter");
        _;
    }

    // =================================== METHODS ======================================

    /// @notice Registers a voter
    /// @param _voter Address of the voter to register
    function registerVoter(address _voter) external onlyOwner {
        require(status == WorkflowStatus.RegisteringVoters, "Not allowed at this stage");
        require(!voters[_voter].isRegistered, "Already registered");
        voters[_voter].isRegistered = true;
        voters[_voter].voterAddress = _voter;

        // Default value to -1
        voters[_voter].votedProposalId = - 1;
        voterCount++;

        voterAddresses.push(_voter);

        emit VoterRegistered(_voter);
    }

    /// @notice Starts proposal registration
    function startProposalsRegistration() external onlyOwner {
        require(status == WorkflowStatus.RegisteringVoters, "Invalid status transition");
        status = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, status);
    }

    /// @notice Registers a proposal
    /// @param _description Description of the proposal
    function registerProposal(string memory _description) external onlyRegisteredVoter {
        require(status == WorkflowStatus.ProposalsRegistrationStarted, "Proposals not open");

        console.log("Registering proposal %s", _description);
        proposalsVar.proposals.push(Proposal(_description, 0));
        console.log("Proposals count : ", proposalsVar.proposals.length);
        emit ProposalRegistered(proposalsVar.proposals.length - 1);
    }

    /// @notice Ends proposal registration
    function endProposalsRegistration() external onlyOwner {
        require(status == WorkflowStatus.ProposalsRegistrationStarted, "Invalid status transition");
        status = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, status);
    }

    /// @notice Starts the voting session
    function startVotingSession() external onlyOwner {
        require(status == WorkflowStatus.ProposalsRegistrationStarted, "Invalid status transition");
        status = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, status);
    }

    /// @notice Votes for a proposal
    /// @param _proposalId ID of the proposal to vote for
    function vote(uint _proposalId) external onlyRegisteredVoter {
        require(status == WorkflowStatus.VotingSessionStarted, "Voting not open");
        require(!voters[msg.sender].hasVoted, "Already voted");
        require(_proposalId < proposalsVar.proposals.length, "Invalid proposal ID");

        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposalId = int(_proposalId);
        proposalsVar.proposals[_proposalId].voteCount++;
        votes++;
        emit Voted(msg.sender, _proposalId);
    }

    /// @notice Ends the voting session
    function endVotingSession() external onlyOwner {
        require(status == WorkflowStatus.VotingSessionStarted, "Invalid status transition");
        status = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, status);
    }

    /// @notice Tallies the votes
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

    /// @notice Retrieves the winning proposal
    /// @return description Description of the winning proposal
    /// @return voteCount Number of votes for the winning proposal
    function getWinner() external view returns (string memory description, uint voteCount) {
        require(status == WorkflowStatus.VotesTallied, "Votes not tallied yet");
        return (proposalsVar.proposals[winningProposalId].description, proposalsVar.proposals[winningProposalId].voteCount);
    }

    /// @notice Cancels the votes if less than 34% of voters have voted
    function cancelVotes() external onlyOwner {
        require(status == WorkflowStatus.VotingSessionEnded, "Invalid status transition");
        uint votes = 0;
        if (votes * 100 / voterCount < 34) {
            status = WorkflowStatus.VotingSessionCanceled;
            emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, status);
        }
    }

    /// @notice Removes the winning proposal and designates the second most voted proposal as the winner
    function killElected() external onlyOwner {
        require(status == WorkflowStatus.VotesTallied, "Votes not tallied yet");
        require(proposalsVar.proposals.length > 1, "Not enough proposals to remove the winner");

        // Find the second highest vote
        uint secondMaxVotes = 0;
        uint secondWinnerId = 0;

        for (uint i = 0; i < proposalsVar.proposals.length; i++) {
            if (i == winningProposalId) continue; // Skip the current winner

            if (proposalsVar.proposals[i].voteCount > secondMaxVotes) {
                secondMaxVotes = proposalsVar.proposals[i].voteCount;
                secondWinnerId = i;
            }
        }
        winningProposalId = secondWinnerId;
    }

    /// @notice Returns the total number of proposals in the contract
    /// @return The number of proposals (length of the `proposals` array)
    function getProposals() public view onlyRegisteredVoter returns (Proposals memory) {
        return proposalsVar;
    }

    /// @notice Reads voter information from their address
    /// @param _address Address of the voter
    /// @return Voter information
    function getVoter(address _address) public view onlyRegisteredVoter returns (Voter memory) {
        return voters[_address];
    }

    /// @notice Checks if an account is the owner
    /// @param account Address of the account to check
    /// @return True if the account is the owner, otherwise false
    function isOwner(address account) public view onlyOwner returns (bool) {
        return account == owner();
    }

    /// @notice Returns voter data
    /// @dev Since we cannot return a mapping, we create an array and add voters one by one using our list of addresses
    /// @return List of voters
    function getAllVoterAddresses() public view returns (Voter[] memory) {
        uint256 length = voterAddresses.length;
        Voter[] memory voterList = new Voter[](length);

        for (uint256 i = 0; i < length; i++) {
            voterList[i] = voters[voterAddresses[i]];
            console.log(voters[voterAddresses[i]].voterAddress);
        }

        return voterList;
    }

}