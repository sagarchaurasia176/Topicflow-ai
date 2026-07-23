'use client';
import { Button } from "@radix-ui/themes";
import { Avatar } from "@radix-ui/themes";
import { useSession, signOut } from "next-auth/react";

interface RadixDropdownMenuCheckboxDemoProps {
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
  align?: "start" | "center" | "end";
  alignOffset?: number;
}

export function RadixDropdownMenuCheckboxDemo({
  side = "bottom",
  sideOffset = 4,
  align = "end",
  alignOffset = 0,
}: RadixDropdownMenuCheckboxDemoProps) {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  // Get user data from session
  const user = session?.user;
  const userName = user?.name || "User";
  const userEmail = user?.email || "";
  const userImage = user?.image || "";

  return (
    <div className="relative inline-block text-left">
      <Button className="cursor-pointer" variant="soft">
        <Avatar
          src={userImage}
          className="cursor-pointer"
          fallback={userName.charAt(0).toUpperCase()}
          size="2"
          radius="full"
        />
      </Button>
      
      {/* Simple dropdown (you can enhance this with radix-ui dropdown if needed) */}
      <div className="hidden group-hover:block absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
        <div className="py-1" role="menu">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{userName}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{userEmail}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            role="menuitem"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
