// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

/// @title Voting Structures Definition
/// @notice Contains structures for voters and proposals
contract VotingStructures {

    // =================================== STRUCTURES ======================================

    /// @notice Structure representing a voter
    /// @param isRegistered Indicates if the voter is registered
    /// @param hasVoted Indicates if the voter has voted
    /// @param votedProposalId ID of the proposal voted for by the voter
    /// @param voterAddress Address of the voter
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        int votedProposalId;
        address voterAddress;
    }

    /// @notice Structure representing a proposal
    /// @param description Description of the proposal
    /// @param voteCount Number of votes for the proposal
    struct Proposal {
        string description;
        uint voteCount;
    }

    /// @notice Structure containing a list of proposals
    struct Proposals {
        Proposal[] proposals;
    }

    /// @notice Enumeration of workflow statuses
    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied,
        VotingSessionCanceled
    }

}