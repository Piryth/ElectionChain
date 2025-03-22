"use client"

import {useBlockchain} from "@/app/context/BlockchainContext";

export default function About() {

    const {address, isRegistered, hasVoted, votedProposalId} = useBlockchain();


    return <div>
        <h1 className={"text-3xl font-bold"}>About current user</h1>
        <p>Address : {address}</p><br/>
        <p>{isRegistered ? "User is registered" : "User is not registered"}</p><br/>
        <p>{hasVoted ? "User has voted for " + votedProposalId : "User has still not voted"}</p><br/>
    </div>
}