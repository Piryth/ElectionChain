// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

/// @title Définition des structures de vote
/// @notice Contient les structures des électeurs et propositions
contract VotingStructures {

    // =================================== STRUCTURES ======================================
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        int votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

    struct Proposals {
        Proposal[] proposals;
    }

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
