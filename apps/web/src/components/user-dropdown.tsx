import { LogOutIcon, UserIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import { authClient } from "@/lib/auth-client";
import { getInitials } from "@/lib/utils";

interface Props {
  avatar: string | null | undefined;
  name: string;
  email: string;
}

export function UserDropdown({ avatar = "", name, email }: Props) {
  async function handleSignOut() {
    await authClient.signOut();
  }

  return (
    <Menu>
      <MenuTrigger render={<button className="cursor-pointer" type="button" />}>
        <Avatar className="border">
          <AvatarImage src={avatar || ""} />
          <AvatarFallback>
            {name ? getInitials(name) : <UserIcon className="size-4" />}
          </AvatarFallback>
        </Avatar>
      </MenuTrigger>
      <MenuPopup align="end" className="data-[side=none]:opacity-0">
        <MenuGroup>
          <MenuGroupLabel>{name || email}</MenuGroupLabel>
          <MenuSeparator />
        </MenuGroup>
        <MenuItem onClick={handleSignOut} variant="destructive">
          <LogOutIcon />
          Logout
        </MenuItem>
      </MenuPopup>
    </Menu>
  );
}
