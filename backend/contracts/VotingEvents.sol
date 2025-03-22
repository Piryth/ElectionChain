// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import {VotingStructures} from "./VotingStructures.sol";

contract VotingEvents is VotingStructures {

    // =================================== EVENTS ======================================

    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted(address voter, uint proposalId);

}
