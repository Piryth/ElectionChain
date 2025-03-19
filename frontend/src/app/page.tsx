'use client';

import { useReadContract } from "wagmi";
import { abi } from "./abi";

export default function Home() {
    const { data } = useReadContract({
        abi,
        address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        functionName: 'balanceOf',
        args: ['0x6B175474E89094C44Da98b954EedeAC495271d0F'],
        chainId: 1,
    })
    return (
        <p>BalanceOf on the mainnet : {data && data.toString()}</p>
    );
}