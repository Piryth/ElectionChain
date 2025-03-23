// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

/// @title Voting Contract Interface
/// @notice Interface for interacting with the Voting contract
interface IVoting {

    /// @notice Registers a voter
    /// @param _voter Address of the voter to register
    function registerVoter(address _voter) external;

    /// @notice Registers a proposal
    /// @param _description Description of the proposal
    function registerProposal(string memory _description) external;

    /// @notice Votes for a proposal
    /// @param _proposalId ID of the proposal to vote for
    function vote(uint _proposalId) external;

    /// @notice Tallies the votes
    function tallyVotes() external;

    /// @notice Retrieves the winning proposal
    /// @return description Description of the winning proposal
    /// @return voteCount Number of votes for the winning proposal
    function getWinner() external view returns (string memory description, uint voteCount);

}