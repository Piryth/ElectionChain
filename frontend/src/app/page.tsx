'use client';

import {DataTable} from "@/app/components/DataTable";

export default function Home() {

    return (
        <div className="flex justify-center flex-col w-[80%]">
            <h1 className="text-4xl font-bold m-16">Proposals</h1>
            <DataTable></DataTable>
        </div>
    );
}