// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

/// @title Interface du contrat de vote
/// @notice Interface pour interagir avec le contrat Voting
interface IVoting {

    /// @notice Enregistre un électeur
    /// @param _voter Adresse de l'électeur à enregistrer
    function registerVoter(address _voter) external;

    /// @notice Enregistre une proposition
    /// @param _description Description de la proposition
    function registerProposal(string memory _description) external;

    /// @notice Vote pour une proposition
    /// @param _proposalId ID de la proposition pour laquelle voter
    function vote(uint _proposalId) external;

    /// @notice Comptabilise les votes
    function tallyVotes() external;

    /// @notice Récupère la proposition gagnante
    /// @return description Description de la proposition gagnante
    /// @return voteCount Nombre de votes de la proposition gagnante
    function getWinner() external view returns (string memory description, uint voteCount);

}