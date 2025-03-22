import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,

} from "@/components/ui/navigation-menu"
import {ConnectButton} from "@rainbow-me/rainbowkit";

export default function Navbar() {

    return <NavigationMenu className="m-4">
            <NavigationMenuList className="flex w-[100vw] justify-evenly  gap-x-2">
                <NavigationMenuItem>
                    <a>Vote</a>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <a>Users</a>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <a>Submit proposal</a>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <ConnectButton></ConnectButton>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
}