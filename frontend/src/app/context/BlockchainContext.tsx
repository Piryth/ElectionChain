import React, {createContext, useContext, useEffect, useState, useCallback} from "react";
import {useAccount, useConfig} from "wagmi";
import {readContract} from "@wagmi/core"; // To read from the smart contract
import {votingAbi} from "../contracts/Voting"; // Import your contract's ABI

// Define the context state type
interface BlockchainContextType {
    address?: string;
    isRegistered: boolean;
    hasVoted: boolean;
    votedProposalId: number | undefined;
    refreshUserData: () => void;
    voteStatus: number
    isAdmin: boolean
}

type Voter = {
    isRegistered: boolean;
    hasVoted: boolean;
    votedProposalId: bigint;
}

// Create Context
const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

// Provider Component
export const BlockchainProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const {address, isConnected} = useAccount(); // Get user address
    const config = useConfig();

    // State for user data
    const [isRegistered, setIsRegistered] = useState<boolean>(false);
    const [hasVoted, setHasVoted] = useState<boolean>(false);
    const [votedProposalId, setVotedProposalId] = useState<number | undefined>(undefined)
    const [voteStatus, setVoteStatus] = useState<number>(-1)
    const [isAdmin, setIsAdmin] = useState<boolean>(false)


    // Function to fetch user-related data
    const fetchUserData = useCallback(async () => {
        if (!address || !isConnected) return;

        try {

            // Fetch if user has voted
            const voter = await readContract(config, {
                address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
                abi: votingAbi,
                functionName: "getVoter",
                args: [address],
            }) as Voter;

            const status = await readContract(config, {
                address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
                abi: votingAbi,
                functionName: "status",
                args: [],
            }) as number;

            const isOwner = await readContract(config, {
                address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
                abi: votingAbi,
                functionName: "isOwner",
                args: [address],
            }) as boolean;

            setIsRegistered(voter.isRegistered);
            setHasVoted(voter.hasVoted);
            setVotedProposalId(Number(voter.votedProposalId));
            setVoteStatus(status)
            setIsAdmin(isOwner)

        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }, [address, isConnected, config]);

    // Fetch data on mount & when address changes
    useEffect(() => {
        fetchUserData().then();
    }, [fetchUserData]);

    return (
        <BlockchainContext.Provider value={{address,isAdmin , isRegistered, voteStatus, votedProposalId ,hasVoted, refreshUserData: fetchUserData}}>
            {children}
        </BlockchainContext.Provider>
    );
};

// Custom hook to use the context
export const useBlockchain = () => {
    const context = useContext(BlockchainContext);
    if (!context) throw new Error("useBlockchain must be used within a BlockchainProvider");
    return context;
};
