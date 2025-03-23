import { useQuery} from "@tanstack/react-query";
import {useAccount, useConfig, useWalletClient} from "wagmi";
import {votingAbi} from "@/app/contracts/Voting";
import {readContract} from "@wagmi/core";

type VoterData = {
    isRegistered: boolean;
    hasVoted: boolean;
    votedProposalId: number;
    voterAddress: string;
}

type VoterResponseData = {
    voters: VoterData[];
}

export const useGetVoters = () => {
    const { address } = useAccount(); // Get connected user
    const config = useConfig(); // Wagmi config
    const walletClient = useWalletClient();

    return useQuery<VoterResponseData>({
        queryKey: ["getVoters", address], // Query key for caching
        queryFn: async () => {
            if (!address) throw new Error("Connect your wallet first");

            // Get the wallet client (to send transaction)
            if (!walletClient) throw new Error("No wallet client found");

            // Send the transaction to increment counter
            const txHash = await readContract(config, {
                address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
                abi: votingAbi,
                functionName: "getAllVoterAddresses",
                args: [], // No arguments for this function
            }) as VoterResponseData;

            console.log("Transaction Hash:", txHash);
            return txHash;
        },
    });
};