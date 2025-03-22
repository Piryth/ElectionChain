// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

/// @title Interface du contrat de vote
/// @author Team
/// @notice Interface pour interagir avec le contrat Voting
interface IVoting {

    function registerVoter(address _voter) external;
    function registerProposal(string memory _description) external;
    function vote(uint _proposalId) external;
    function tallyVotes() external;
    function getWinner() external view returns (string memory description, uint voteCount);

}
