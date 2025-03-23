import { useState } from "react";
import { useRegisterVoter } from "@/app/hooks/useRegisterVoter";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import {toast} from "sonner";
import {useBlockchain} from "@/app/context/BlockchainContext";

export const RegisterVoterForm = () => {
    const [voterAddress, setVoterAddress] = useState("");
    const { mutate: registerVoter, isPending } = useRegisterVoter();

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied,
        VotingSessionCanceled
    }


    const {voteStatus} = useBlockchain();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        registerVoter({ voter: voterAddress },
            {
                onSuccess: () => {
                    console.log("Submitted successfully!");
                    toast("Voter registered successfully : "+voterAddress);
                },
                onError: (error) => {
                    console.error("Error submitting proposal:", error);
                    toast.error("Failed to submit the form. Please try again.");
                },
            });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                disabled={voteStatus != WorkflowStatus.RegisteringVoters}
                placeholder="Enter voter address"
                value={voterAddress}
                onChange={(e) => setVoterAddress(e.target.value)}
                required
            />
            <Button type="submit" disabled={isPending}>
                {isPending ? "Registering..." : "Register Voter"}
            </Button>
        </form>
    );
};