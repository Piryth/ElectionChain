'use client'

import React, {useEffect, useMemo, useState} from "react";
import {
    ColumnDef,
    flexRender,
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel
} from "@tanstack/react-table";
import {ArrowUpDown} from "lucide-react";
import {useGetProposals} from "@/app/hooks/useGetProposals";
import {ProposalForm} from "@/app/components/ProposalForm";
import {Button} from "@/app/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/app/components/ui/table";
import {Input} from "@/app/components/ui/input";
import {useBlockchain} from "@/app/context/BlockchainContext";
import {toast} from "sonner";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/app/components/ui/tooltip";
import {useVote} from "@/app/hooks/useVote";
import {useQueryClient} from "@tanstack/react-query";


type Proposal = {
    name: string,
    description: string,
    numberOfVotes: number,
    voted: boolean
}

type ProposalData = {
    description: string;
    voteCount: bigint; // Using bigint because voteCount is stored as 0n (BigInt)
};

type ProposalsResponse = {
    proposals: ProposalData[];
};

enum WorkflowStatus {
    RegisteringVoters,
    ProposalsRegistrationStarted,
    ProposalsRegistrationEnded,
    VotingSessionStarted,
    VotingSessionEnded,
    VotesTallied,
    VotingSessionCanceled
}

const tooltips = (status: number) => {
    switch (status) {
        case WorkflowStatus.RegisteringVoters:
            return "Voting is not opened"
        case WorkflowStatus.VotingSessionStarted:
            return ""
        default:
            return "Voting session has ended"
    }
}

const isUnableToVote = (status: WorkflowStatus, isRegistered: boolean, hasVoted: boolean): boolean => {
    return !(status === WorkflowStatus.ProposalsRegistrationStarted && isRegistered && !hasVoted);
}

export const ProposalsDataTable = () => {

    const {voteStatus, isRegistered, hasVoted} = useBlockchain()
    const {mutate} = useVote();
    const queryClient = useQueryClient();

    const [filter, setFilter] = useState("");
    const [proposalList, setProposalList] = useState<Proposal[]>([]);

    const columns: ColumnDef<Proposal>[] = [
        {
            accessorKey: "name",
            header: ({column}) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Name <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            ),
        },
        {accessorKey: "description", header: "Description"},
        {
            accessorKey: "numberOfVotes",
            header: ({column}) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Votes <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            ),
            cell: ({row}) => <span className="font-medium">{row.getValue("numberOfVotes")}</span>,
        },
        {
            accessorKey: "vote",
            header: "Vote",
            cell: ({row}) => (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Button disabled={isUnableToVote(voteStatus, isRegistered, hasVoted)}
                                    variant="outline"
                                    onClick={() => handleVote(row.index)}
                                    className={isUnableToVote(voteStatus, isRegistered, hasVoted)? "" : "bg-blue-500 text-white hover:bg-blue-600" + " cursor-pointer"}
                            >
                                Vote
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent hidden={!isUnableToVote(voteStatus, isRegistered, hasVoted)}>
                            <p>
                                {tooltips(voteStatus)}
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ),
        },
    ];

    const filteredData = useMemo(() => {
        return proposalList.filter((proposal) =>
            proposal.name.toLowerCase().includes(filter.toLowerCase())
        );
    }, [filter, proposalList]);

    // Table instance
    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const {data, isLoading} = useGetProposals()

    useEffect(() => {
        if (data) {
            const {proposals} = data as ProposalsResponse

            const mappedProposals: Proposal[] = proposals.map(proposal => ({
                name: proposal.description,
                numberOfVotes: Number(proposal.voteCount),
                description: "Coming soon",
                voted: false,
            }))

            console.log("Mapped proposals : ", mappedProposals)
            setProposalList([...mappedProposals]);
        }
    }, [data, isLoading])

    if (isLoading) return <div>Loading...</div>;

    const handleVote = (index: number) => {

        mutate(
            {proposalId: index},
            {
                onSuccess: () => {
                    console.log("Submitted successfully!");
                    queryClient.invalidateQueries({ queryKey: ['vote'] });
                    toast.success(`You voted for "${proposalList[index].name}"!" 🎉`, {
                        duration: 3000, // Show for 3 seconds
                    });
                },
                onError: (error) => {
                    console.error("Error submitting proposal:", error);
                    toast.error("Failed to submit the form. Please try again.");
                },
            }
        );

    };

    return (
        <div className="p-4 space-y-4">
            <div className="flex justify-between gap-4">
                {/* Search Bar */}
                <Input
                    placeholder="Search proposals..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-1/3"
                />
                <ProposalForm></ProposalForm>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center">
                                    No proposals found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-end space-x-2">
                <Button
                    variant="outline"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    );


}