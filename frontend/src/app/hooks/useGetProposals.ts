import { useQuery} from "@tanstack/react-query";
import {useAccount, useConfig, useWalletClient} from "wagmi";
import {votingAbi} from "@/app/contracts/Voting";
import {readContract} from "@wagmi/core";

type ProposalData = {
    description: string;
    voteCount: bigint; // Using bigint because voteCount is stored as 0n (BigInt)
};

type ProposalsResponse = {
    proposals: ProposalData[];
};

export const useGetProposals = () => {
    const { address } = useAccount(); // Get connected user
    const config = useConfig(); // Wagmi config
    const walletClient = useWalletClient();

    return useQuery<ProposalsResponse>({
        queryKey: ["getProposals", address], // Query key for caching
        queryFn: async () => {
            if (!address) throw new Error("Connect your wallet first");

            // Get the wallet client (to send transaction)
            if (!walletClient) throw new Error("No wallet client found");

            // Send the transaction to increment counter
            const txHash = await readContract(config, {
                address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
                abi: votingAbi,
                functionName: "getProposals",
                args: [], // No arguments for this function
            }) as ProposalsResponse;

            console.log("Transaction Hash:", txHash);
            return txHash;
        },
    });
};