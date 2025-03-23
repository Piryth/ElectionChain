// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import {VotingStructures} from "./VotingStructures.sol";

/// @title Contrat des événements de vote
/// @notice Contient les événements émis par le contrat de vote
contract VotingEvents is VotingStructures {

    // =================================== EVENTS ======================================

    /// @notice Événement émis lorsqu'un électeur est enregistré
    /// @param voterAddress Adresse de l'électeur enregistré
    event VoterRegistered(address voterAddress);

    /// @notice Événement émis lors d'un changement de statut du workflow
    /// @param previousStatus Statut précédent du workflow
    /// @param newStatus Nouveau statut du workflow
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);

    /// @notice Événement émis lorsqu'une proposition est enregistrée
    /// @param proposalId ID de la proposition enregistrée
    event ProposalRegistered(uint proposalId);

    /// @notice Événement émis lorsqu'un vote est effectué
    /// @param voter Adresse de l'électeur ayant voté
    /// @param proposalId ID de la proposition votée
    event Voted(address voter, uint proposalId);

}