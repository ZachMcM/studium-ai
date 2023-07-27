"use client";

import { CreditCard, LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import ThemeButton from "./ThemeButton";
import { Skeleton } from "./ui/skeleton";

export default function UserDropdown() {
  const { data: session } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className=" cursor-pointer">
        <Avatar>
          <AvatarImage src={session?.user.image || ""} />
          <AvatarFallback>
            <Skeleton className="h-8 w-8 rounded-full"/>
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mx-4">
        <DropdownMenuLabel>
          <p className="text-sm font-medium">{session?.user.name}</p>
          <p className="text-xs font-medium text-muted-foreground">{session?.user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator/>
        <DropdownMenuGroup>
          <Link href="/feedback">
            <DropdownMenuItem>Feedback</DropdownMenuItem>
          </Link>
          <Link href="/dashboard/notes">
            <DropdownMenuItem>Dashboard</DropdownMenuItem>
          </Link>
          <ThemeButton/>
        </DropdownMenuGroup>
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
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
