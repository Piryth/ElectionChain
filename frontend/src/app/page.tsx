'use client';

import {ProposalsDataTable} from "@/app/components/ProposalsDataTable";
import {useBlockchain} from "@/app/context/BlockchainContext";

export default function Home() {

    const {voteStatus} = useBlockchain()

    return (
        <div className="flex  flex-col w-[80%]">

            <h1 className="text-4xl font-bold ml-auto mr-auto mt-8">Proposals</h1>
            <ProposalsDataTable></ProposalsDataTable>
        </div>
    );
}