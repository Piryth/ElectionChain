import { http, createConfig } from 'wagmi'
import { hardhat } from 'wagmi/chains'
import {getDefaultConfig} from "@rainbow-me/rainbowkit";

export const config = getDefaultConfig({
    transports: {
        [hardhat.id]: http(),
    },
    appName: 'My RainbowKit App',
    projectId: '65af7ffc03881e7982d909862c11aa59',
    chains: [hardhat],
    ssr: true,
})