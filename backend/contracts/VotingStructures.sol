// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

/// @title Définition des structures de vote
/// @notice Contient les structures des électeurs et propositions
contract VotingStructures {

    // =================================== STRUCTURES ======================================

    /// @notice Structure représentant un électeur
    /// @param isRegistered Indique si l'électeur est enregistré
    /// @param hasVoted Indique si l'électeur a voté
    /// @param votedProposalId ID de la proposition votée par l'électeur
    /// @param voterAddress Adresse de l'électeur
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        int votedProposalId;
        address voterAddress;
    }

    /// @notice Structure représentant une proposition
    /// @param description Description de la proposition
    /// @param voteCount Nombre de votes pour la proposition
    struct Proposal {
        string description;
        uint voteCount;
    }

    /// @notice Structure contenant une liste de propositions
    struct Proposals {
        Proposal[] proposals;
    }

    /// @notice Enumération des statuts du workflow
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