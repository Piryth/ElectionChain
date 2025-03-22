'use client';

import {DataTable} from "@/app/components/DataTable";
import {useOpenVotes} from "@/app/hooks/useOpenVotes";
import {toast} from "sonner";
import {Button} from "@/app/components/ui/button";

export default function Home() {

    const {data: vote, error, isFetching, refetch} = useOpenVotes();

    const openVotes = () => {
        console.log("Opening votes")
        refetch().then(() => {
            if (!error) {
                console.log("Votes are opened with success !")
                console.log(vote)
            }
        })
        toast(
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">Votes are opened with success !</code>
        </pre>
        );
    }


    return (
        <div className="flex justify-center flex-col w-[80%]">

            <h1 className="text-4xl font-bold m-16">Proposals</h1>
            <DataTable></DataTable>
            <Button disabled={isFetching} onClick={openVotes}>Open votes</Button>
        </div>


    );
}