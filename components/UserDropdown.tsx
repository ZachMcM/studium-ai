"use client";

import { CreditCard, LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import ThemeButton from "./ThemeButton";

export default function UserDropdown() {
  const { data: session } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src={session?.user.image || "https://images.unsplash.com/photo-1579546929662-711aa81148cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"} />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-4">
        <DropdownMenuLabel>{session?.user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator/>
        <DropdownMenuGroup>
          <Link href="/settings/profile">
            <DropdownMenuItem>
              <User className="h-4 w-4 mr-2"/>
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/settings/billing">
            <DropdownMenuItem>
              <CreditCard className="h-4 w-4 mr-2"/>
              <span>Billing</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/settings">
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2"/>
              <span>Settings</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator/>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOut className="h-4 w-4 mr-2"/>
            <span>Sign Out</span>
          </DropdownMenuItem>
          <ThemeButton/>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
