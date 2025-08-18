"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LayoutDashboard, LogOutIcon, Settings2, UserIcon } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/api/auth";

export function UserDropdown() {
  const { data: user } = useUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer" asChild>
        <UserAvatar />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <div className="flex items-center gap-2">
            <UserAvatar />
            <div>
              <span className="text-sm font-medium">
                {user?.displayName ||
                  user?.providers[0]?.username ||
                  "Logged in as"}
              </span>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-foreground" asChild>
          <Link href="/dashboard">
            <LayoutDashboard />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-foreground" asChild>
          <Link href="/dashboard/settings">
            <Settings2 />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          className="text-foreground"
          asChild
        >
          <Link href="/logout">
            <LogOutIcon />
            Logout
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const UserAvatar = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof Avatar>
>(function UserAvatar(props, ref) {
  return (
    <Avatar ref={ref} {...props}>
      <AvatarImage src="" />
      <AvatarFallback>
        <UserIcon className="size-4" />
      </AvatarFallback>
    </Avatar>
  );
});
