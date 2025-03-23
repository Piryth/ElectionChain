import { useMutation } from "@tanstack/react-query";
import { useAccount, useConfig, useWalletClient } from "wagmi";
import { writeContract } from "@wagmi/core";
import { votingAbi } from "@/app/contracts/Voting";

type RegisterVoterProps = {
    voter: string;
};

export const useRegisterVoter = () => {
    const { address } = useAccount(); // Get connected user
    const config = useConfig(); // Wagmi config
    const walletClient = useWalletClient();

    return useMutation({
        mutationKey: ["registerVoter", address], // Query key for caching
        mutationFn: async ({ voter }: RegisterVoterProps) => {
            if (!address) throw new Error("Connect your wallet first");

            // Get the wallet client (to send transaction)
            if (!walletClient) throw new Error("No wallet client found");

            // Send the transaction to register voter
            const txHash = await writeContract(config, {
                address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
                abi: votingAbi,
                functionName: "registerVoter",
                args: [voter],
            });

            console.log("Transaction Hash:", txHash);
            return txHash;
        }
    });
};