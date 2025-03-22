"use client"

import {useBlockchain} from "@/app/context/BlockchainContext";
import {Input} from "@/app/components/ui/input";
import {Label} from "@/app/components/ui/label";
import {Badge} from "@/app/components/ui/badge";

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

    const {address, isAdmin, isRegistered, hasVoted,voteStatus} = useBlockchain();

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
                <div>Hello admin</div>
            ) : (<p>You have no right</p>)}

        </div>

    </div>
}