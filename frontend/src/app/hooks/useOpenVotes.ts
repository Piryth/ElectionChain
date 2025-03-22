import {useMutation} from "@tanstack/react-query";
import {useAccount, useConfig, useWalletClient} from "wagmi";
import {writeContract} from "@wagmi/core";
import {votingAbi} from "@/app/contracts/Voting";


export const useOpenVotes = () => {
    const { address } = useAccount(); // Get connected user
    const config = useConfig(); // Wagmi config
    const walletClient = useWalletClient();


    return useMutation({
        mutationKey: ["startProposalsRegistration", address], // Query key for caching
        mutationFn: async () => {
            if (!address) throw new Error("Connect your wallet first");

            // Get the wallet client (to send transaction)
            if (!walletClient) throw new Error("No wallet client found");

            // Send the transaction to increment counter
            const txHash = await writeContract(config, {
                address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
                abi: votingAbi,
                functionName: "startProposalsRegistration",
                args: [], // No arguments for this function
            });

            console.log("Transaction Hash:", txHash);
            return txHash;
        },
    });
};