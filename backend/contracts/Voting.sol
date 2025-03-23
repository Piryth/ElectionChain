// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
import {IVoting} from "./IVoting.sol";
import {VotingEvents} from "./VotingEvents.sol";

/// @title Un contrat de vote d'exemple
/// @notice Vous pouvez utiliser ce contrat pour une simulation de base
/// @dev Toutes les fonctions sont actuellement implémentées sans effets secondaires
/// @custom:experimental Ceci est un contrat expérimental
contract Voting is Ownable, IVoting, VotingEvents {

    // =================================== ATTRIBUTES ======================================

    /// @notice Statut actuel du workflow
    WorkflowStatus public status;

    /// @notice Mapping des électeurs par adresse
    mapping(address => Voter) public voters;

    /// @notice Liste des adresses des électeurs
    address[] public voterAddresses;

    /// @notice Nombre total d'électeurs
    uint public voterCount;

    /// @notice Liste des propositions
    Proposals private proposalsVar;

    /// @notice ID de la proposition gagnante
    uint public winningProposalId;

    // =================================== CONSTRUCTOR ======================================

    /// @notice Constructeur du contrat
    constructor() Ownable(msg.sender){
        console.log("Registering address %s to vote", msg.sender);

        // Valeur par défaut de l'électeur
        voters[msg.sender] = Voter(true, false, - 1, msg.sender);

        status = WorkflowStatus.RegisteringVoters;

        // Proposition par défaut pour les tests
        proposalsVar.proposals.push(Proposal("First proposal", 0));

        // Ajout de l'adresse du propriétaire à la liste des adresses
        voterAddresses.push(msg.sender);
    }

    // =================================== MODIFIERS ======================================

    /// @notice Vérifie si l'appelant est un électeur enregistré
    modifier onlyRegisteredVoter() {
        require(voters[msg.sender].isRegistered, "Not a registered voter");
        _;
    }

    // =================================== METHODS ======================================

    /// @notice Enregistre un électeur
    /// @param _voter Adresse de l'électeur à enregistrer
    function registerVoter(address _voter) external onlyOwner {
        require(status == WorkflowStatus.RegisteringVoters, "Not allowed at this stage");
        require(!voters[_voter].isRegistered, "Already registered");
        voters[_voter].isRegistered = true;
        voters[_voter].voterAddress = _voter;

        // Valeur par défaut à -1
        voters[_voter].votedProposalId = - 1;
        voterCount++;

        voterAddresses.push(_voter);

        emit VoterRegistered(_voter);
    }

    /// @notice Démarre l'enregistrement des propositions
    function startProposalsRegistration() external onlyOwner {
        require(status == WorkflowStatus.RegisteringVoters, "Invalid status transition");
        status = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, status);
    }

    /// @notice Enregistre une proposition
    /// @param _description Description de la proposition
    function registerProposal(string memory _description) external onlyRegisteredVoter {
        require(status == WorkflowStatus.ProposalsRegistrationStarted, "Proposals not open");

        console.log("Registering proposal %s", _description);
        proposalsVar.proposals.push(Proposal(_description, 0));
        console.log("Proposals count : ", proposalsVar.proposals.length);
        emit ProposalRegistered(proposalsVar.proposals.length - 1);
    }

    /// @notice Termine l'enregistrement des propositions
    function endProposalsRegistration() external onlyOwner {
        require(status == WorkflowStatus.ProposalsRegistrationStarted, "Invalid status transition");
        status = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, status);
    }

    /// @notice Démarre la session de vote
    function startVotingSession() external onlyOwner {
        require(status == WorkflowStatus.ProposalsRegistrationEnded, "Invalid status transition");
        status = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, status);
    }

    /// @notice Vote pour une proposition
    /// @param _proposalId ID de la proposition pour laquelle voter
    function vote(uint _proposalId) external onlyRegisteredVoter {
        require(status == WorkflowStatus.VotingSessionStarted, "Voting not open");
        require(!voters[msg.sender].hasVoted, "Already voted");
        require(_proposalId < proposalsVar.proposals.length, "Invalid proposal ID");

        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposalId = int(_proposalId);
        proposalsVar.proposals[_proposalId].voteCount++;
        emit Voted(msg.sender, _proposalId);
    }

    /// @notice Termine la session de vote
    function endVotingSession() external onlyOwner {
        require(status == WorkflowStatus.VotingSessionStarted, "Invalid status transition");
        status = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, status);
    }

    /// @notice Comptabilise les votes
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

    /// @notice Récupère la proposition gagnante
    /// @return description Description de la proposition gagnante
    /// @return voteCount Nombre de votes de la proposition gagnante
    function getWinner() external view returns (string memory description, uint voteCount) {
        require(status == WorkflowStatus.VotesTallied, "Votes not tallied yet");
        return (proposalsVar.proposals[winningProposalId].description, proposalsVar.proposals[winningProposalId].voteCount);
    }

    /// @notice Annule les votes si moins de 34% des électeurs ont voté
    function cancelVotes() external onlyOwner {
        require(status == WorkflowStatus.VotingSessionEnded, "Invalid status transition");
        uint votes = 0;
        if (votes * 100 / voterCount < 34) {
            status = WorkflowStatus.VotingSessionCanceled;
            emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, status);
        }
    }

    /// @notice Supprime la proposition gagnante et désigne la deuxième proposition la plus votée comme gagnante
    function killElected() external onlyOwner {
        require(status == WorkflowStatus.VotesTallied, "Votes not tallied yet");
        require(proposalsVar.proposals.length > 1, "Not enough proposals to remove the winner");

        // Trouver le deuxième plus grand vote
        uint secondMaxVotes = 0;
        uint secondWinnerId = 0;

        for (uint i = 0; i < proposalsVar.proposals.length; i++) {
            if (i == winningProposalId) continue; // Ignorer le gagnant actuel

            if (proposalsVar.proposals[i].voteCount > secondMaxVotes) {
                secondMaxVotes = proposalsVar.proposals[i].voteCount;
                secondWinnerId = i;
            }
        }
        winningProposalId = secondWinnerId;
    }

    /// @notice Retourne le nombre total de propositions dans le contrat
    /// @return Le nombre de propositions (longueur du tableau `proposals`)
    function getProposals() public view onlyRegisteredVoter returns (Proposals memory) {
        return proposalsVar;
    }

    /// @notice Lit les informations d'un électeur à partir de son adresse
    /// @param _address Adresse de l'électeur
    /// @return Les informations de l'électeur
    function getVoter(address _address) public view onlyRegisteredVoter returns (Voter memory) {
        return voters[_address];
    }

    /// @notice Vérifie si un compte est le propriétaire
    /// @param account Adresse du compte à vérifier
    /// @return Vrai si le compte est le propriétaire, sinon faux
    function isOwner(address account) public view onlyOwner returns (bool) {
        return account == owner();
    }

    /// @notice Retourne les données des électeurs
    /// @dev Comme nous ne pouvons pas retourner un mapping, nous créons un tableau et ajoutons les électeurs un par un en utilisant notre liste d'adresses
    /// @return La liste des électeurs
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