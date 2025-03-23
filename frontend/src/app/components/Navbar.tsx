import {ConnectButton} from "@rainbow-me/rainbowkit";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList
} from "@/app/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/app/components/ui/navigation-menu"
import Link from "next/link";

const components: { title: string, href: string, description: string }[] = [
    {
        title: "home",
        href: "/",
        description: "Home",
    },
    {
        title: "voters",
        href: "/voter",
        description: "Voters page",
    },
    {
        title: "proposals",
        href: "/proposals",
        description: "Proposals page",
    },
    {
        title: "profile",
        href: "/about",
        description: "Profile page",
    }
]

export default function Navbar() {

    return <NavigationMenu className="mt-8 m-4" >
        <NavigationMenuList className="flex w-[100vw] justify-evenly gap-x-2">
            <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Home
                </NavigationMenuLink>
            </Link>
            <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Profile
                    </NavigationMenuLink>
                </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <Link href="/voter" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Voters
                    </NavigationMenuLink>
                </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <ConnectButton></ConnectButton>
            </NavigationMenuItem>
        </NavigationMenuList>
    </NavigationMenu>
}