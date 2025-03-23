// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import {VotingStructures} from "./VotingStructures.sol";

/// @title Voting Events Contract
/// @notice Contains events emitted by the Voting contract
contract VotingEvents is VotingStructures {

    // =================================== EVENTS ======================================

    /// @notice Event emitted when a voter is registered
    /// @param voterAddress Address of the registered voter
    event VoterRegistered(address voterAddress);

    /// @notice Event emitted when the workflow status changes
    /// @param previousStatus Previous workflow status
    /// @param newStatus New workflow status
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);

    /// @notice Event emitted when a proposal is registered
    /// @param proposalId ID of the registered proposal
    event ProposalRegistered(uint proposalId);

    /// @notice Event emitted when a vote is cast
    /// @param voter Address of the voter who cast the vote
    /// @param proposalId ID of the proposal voted for
    event Voted(address voter, uint proposalId);

}