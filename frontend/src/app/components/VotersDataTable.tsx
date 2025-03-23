import React, { useEffect, useMemo, useState } from "react";
import {
    ColumnDef,
    flexRender,
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Input } from "@/app/components/ui/input";
import { useGetVoters } from "@/app/hooks/useGetVoters";

type VoterData = {
    isRegistered: boolean;
    hasVoted: boolean;
    votedProposalId: bigint;
    voterAddress: string;
}

export const VotersDataTable = () => {
    const [filter, setFilter] = useState("");
    const [voterList, setVoterList] = useState<VoterData[]>([]);

    const columns: ColumnDef<VoterData>[] = [
        {
            accessorKey: "voterAddress",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Address <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
        },
        { accessorKey: "hasVoted", header: "Voted" },
        { accessorKey: "votedProposalId", header: "Voted Proposal ID" },
    ];

    const filteredData = useMemo(() => {
        return voterList.filter((voter) =>
            voter.voterAddress.toLowerCase().includes(filter.toLowerCase())
        );
    }, [filter, voterList]);

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const { data, isLoading } = useGetVoters();

    useEffect(() => {
        if (data) {
            setVoterList(data);
            console.log(data);
        }
    }, [data, isLoading]);

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="p-4 space-y-4">
            <div className="flex justify-between gap-4">
                <Input
                    placeholder="Search voters..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-1/3"
                />
            </div>

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
                                    No voters found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

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
};