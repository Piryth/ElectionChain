import { useMutation, useQuery } from "@tanstack/react-query";
import { useConfig } from "wagmi";
import { votingAbi } from "@/app/contracts/Voting";
import { readContract, writeContract } from "@wagmi/core";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export const useStartProposalsRegistration = () => {
    const config = useConfig();
    return useMutation({
        mutationFn: async () => {
            await writeContract(config, {
                address: contractAddress,
                abi: votingAbi,
                functionName: "startProposalsRegistration",
            });
        }
    });
};

export const useEndProposalsRegistration = () => {
    const config = useConfig();
    return useMutation({
        mutationFn: async () => {
            await writeContract(config, {
                address: contractAddress,
                abi: votingAbi,
                functionName: "endProposalsRegistration",
            });
        }
    });
};

export const useEndVotingSession = () => {
    const config = useConfig();
    return useMutation({
        mutationFn: async () => {
            await writeContract(config, {
                address: contractAddress,
                abi: votingAbi,
                functionName: "endVotingSession",
            });
        }
    });
};

export const useTallyVotes = () => {
    const config = useConfig();
    return useMutation({
        mutationFn: async () => {
            await writeContract(config, {
                address: contractAddress,
                abi: votingAbi,
                functionName: "tallyVotes",
            });
        }
    });
};

export const useCancelVotes = () => {
    const config = useConfig();
    return useMutation({
        mutationFn: async () => {
            await writeContract(config, {
                address: contractAddress,
                abi: votingAbi,
                functionName: "cancelVotes",
            });
        }
    });
};

export const useKillElected = () => {
    const config = useConfig();
    return useMutation({
        mutationFn: async () => {
            await writeContract(config, {
                address: contractAddress,
                abi: votingAbi,
                functionName: "killElected",
            });
        }
    });
};

export const useOpenVotes = () => {
    const config = useConfig();
    return useMutation({
        mutationFn: async () => {
            await writeContract(config, {
                address: contractAddress,
                abi: votingAbi,
                functionName: "openVotes",
            });
        }
    });
};
