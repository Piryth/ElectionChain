'use client';

import {ProposalsDataTable} from "@/app/components/ProposalsDataTable";
import {useBlockchain} from "@/app/context/BlockchainContext";
import {RegisterVoterForm} from "@/app/components/RegisterVoterForm";

export default function Home() {

    const {voteStatus, isAdmin} = useBlockchain()

    return (
        <div className="flex  flex-col w-[80%]">

            <h1 className="text-4xl font-bold ml-auto mr-auto mt-8">Proposals</h1>
            <ProposalsDataTable></ProposalsDataTable>

            {isAdmin && (
                <>
                    <h2 className="text-3xl font-bold mt-16">Register Voter</h2>
                    <RegisterVoterForm></RegisterVoterForm>
                </>
            )}
        </div>
    );
}