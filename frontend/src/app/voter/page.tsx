'use client';

import {VotersDataTable} from "@/app/components/VotersDataTable";

export default function Page() {

    return <>
        <div className="flex  flex-col w-[80%]">

            <h1 className="text-4xl font-bold ml-auto mr-auto mt-8">Proposals</h1>
            <VotersDataTable></VotersDataTable>
        </div>
    </>

}