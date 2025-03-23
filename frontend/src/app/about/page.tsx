"use client"

import {useBlockchain} from "@/app/context/BlockchainContext";
import {Input} from "@/app/components/ui/input";
import {Label} from "@/app/components/ui/label";
import {Badge} from "@/app/components/ui/badge";
import {useOpenVotes} from "@/app/hooks/useOpenVotes";
import {useEndVotingSession} from "@/app/hooks/useOpenVotes";
import {useTallyVotes} from "@/app/hooks/useOpenVotes";
import {useCancelVotes} from "@/app/hooks/useOpenVotes";
import {Button} from "@/app/components/ui/button";
import { useState, useEffect } from "react";

enum WorkflowStatus {
    RegisteringVoters,
    ProposalsRegistrationStarted,
    ProposalsRegistrationEnded,
    VotingSessionStarted,
    VotingSessionEnded,
    VotesTallied,
    VotingSessionCanceled
}

export default function About() {

    const {mutate: openVotes, isPending: isOpening} = useOpenVotes();
    const {mutate: closeVotes, isPending: isClosing} = useEndVotingSession();
    const {mutate: tallyVotes, isPending: isTallying} = useTallyVotes();
    const {mutate: cancelVotes, isPending: isCanceling} = useCancelVotes();

    const {address, isAdmin, isRegistered, hasVoted, voteStatus} = useBlockchain();
    const [currentAction, setCurrentAction] = useState("open");

    useEffect(() => {
        if (voteStatus === WorkflowStatus.VotingSessionEnded) {
            setCurrentAction("tally");
        } else if (voteStatus === WorkflowStatus.VotesTallied) {
            setCurrentAction("cancel");
        }
    }, [voteStatus]);

    const handleOpenVotes = () => {
        console.log("Opening votes..."); // Vérifie si la fonction est appelée
        openVotes(undefined, {
            onSuccess: () => {
                console.log("Proposal registration opened successfully");
                setCurrentAction("close");
            },
            onError: (error) => {
                console.error("Error opening votes:", error); // Ajoute un log pour l'erreur
            }
        });
    };


    const handleCloseVotes = () => {
        closeVotes(undefined, {
            onSuccess: () => {
                setCurrentAction("tally");
                console.log("Voting session closed successfully");
            }
        });
    };

    const handleTallyVotes = () => {
        tallyVotes(undefined, {
            onSuccess: () => {
                setCurrentAction("cancel");
                console.log("Votes tallied successfully");
            }
        });
    };

    const handleCancelVotes = () => {
        cancelVotes(undefined, {
            onSuccess: () => {
                console.log("Voting session canceled successfully");
            }
        });
    };

    return <div className="w-[90vw] mr-auto ml-auto mt-10 grid grid-cols-2 grid-rows-1 gap-4">
        <div className="flex flex-col w-[80%] gap-12">
            <h1 className={"text-3xl font-bold"}>Profile</h1>

            <div>
                <Label className="mb-2" htmlFor="address">Address</Label>
                <Input
                    id="address"
                    value={address}
                    disabled
                    type="text"
                />
            </div>

            <Badge>{isAdmin ? "Admin" : "User"}</Badge>

            <p>Voting power : {hasVoted || !isRegistered ? "0" : "1"}</p>

            <p>{isRegistered ? "User is registered to vote" : "User is unable to vote. Please contact your administrator"}</p>
            <p>Vote status : {WorkflowStatus[voteStatus]}</p>
        </div>
        <div>
            <h1 className={"text-3xl font-bold"}>Actions</h1>

            {isAdmin ? (
                <div>
                    Hello admin
                    <div className="flex gap-4 mt-4">
                        {currentAction === "open" && (
                            <Button disabled={isOpening} onClick={handleOpenVotes}>Open Votes</Button>
                        )}
                        {currentAction === "close" && (
                            <Button disabled={isClosing} onClick={handleCloseVotes}>Close Votes</Button>
                        )}
                        {currentAction === "tally" && (
                            <Button disabled={isTallying} onClick={handleTallyVotes}>Tally Votes</Button>
                        )}
                        {currentAction === "cancel" && (
                            <Button disabled={isCanceling} onClick={handleCancelVotes}>Cancel Voting Session</Button>
                        )}
                    </div>
                </div>
            ) : (<p>You have no right</p>)}
        </div>
    </div>
}
