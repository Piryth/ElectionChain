import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const VotingModule = buildModule("VotingModule", (m) => {
  // Déploie le smart contract Voting
  const voting = m.contract("Voting");

  // Log pour vérifier le déploiement
  console.log("Voting contract deployment initiated");

  return { voting };
});

export default VotingModule;