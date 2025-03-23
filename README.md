# Elect-on-Chain 🌠
Sample voting dApp

## Description 
Elect-on-Chain is an academic project led by three CS engineering students at [IMT Nord Europe](https://imt-nord-europe.fr). 
The goal of this project is to develop our first blockchain project on the Etherum blockchain. The project consists of a sample voting dApp.

## Features 
+ Vote workflow status administration for contract owner.
+ Whitelist addresses to vote for contract owner.
+ Proposal submission for any whitelisted user.
+ Voting power of 1 per address.

### Vote workflow status
*A voting session workflow follows these steps*
+ RegisteringVoters
+ ProposalsRegistrationStarted
+ ProposalsRegistrationEnded
+ VotingSessionStarted
+ VotingSessionEnded
+ VotesTallied
+ VotingSessionCanceled

At the end of the voting process, the proposal with the most votes will win !

### Additional features
*Not in the frontend yet !*
+ In case of less than 33% rate of voters, votes will be canceled


## Project structure 🛠️
```
/
├── frontend/ # React frontend
│   └── src/
│        └── app/
│             └── components/ # UI components
│             └── page.tsx/ # Index page
│             └── contracts/ # ABI
│             └── hooks/ # Hooks for contract communication
│
├── backend/ # Smart contracts backend
│   ├── hardhat.config.ts # Hardhat configuration
│   └── contracts/        # Smart contracts code here
|   └── ignition/         # Deployment scripts
|    └── test/             # Smart contracts unit tests

```

## How to deploy in local 🏭

### Backend deployment
*Running a HardHat node*

```bash
pnpm i
npx hardhat node
```
*Deploying smart contract to our node*

Before deployment, we need to specify the contract's owner. To do so, please take one of the private key generated during the previous command and paste it into a .env file.

```
touch .env # Add the private key as PRIVATE_KEY
npx hardhat ignition deploy ./ignition/modules/deploy.ts --network localhost
```

### Frontend deployment
*Prerequisite : deploy smart contract first*

In order for our front to communicate with the smart contract, we need to create a .env file, and paste the address of the smart contract within the environment variable NEXT_PUBLIC_CONTRACT_ADDRESS.

```
pnpm i
pnpm run dev
```
Everything should compile 🔥

## Tech stack 🤖
+ For smart-contracts : Solidity, HardHat, OpenZepplin
+ For frontend : React, Typescript, ShacCn, Wagmi, TanStack, RainbowKit

## Authors 📚
*Each of the authors have participated both in the frontend and the backend*
- [@VIVIER_Mikael](https://github.com/mikaelvivier)
- [@PRODHOMME Louison](https://github.com/louizoom)
- [@ENDIGNOUS_Arnaud](https://github.com/Piryth)
