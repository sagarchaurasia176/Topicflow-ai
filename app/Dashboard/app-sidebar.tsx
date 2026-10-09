"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Home, Map, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useGlobalContextApiState } from "@/app/context/GlobalStateManager";
import { signOut } from "next-auth/react";

export function AppSidebar() {
  const { User: user } = useGlobalContextApiState();
  return (
    <Sidebar collapsible="icon" className="bg-white border-r border-gray-200">
      <SidebarHeader className="p-6 border-b border-gray-200">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
          </div>
          <span className="text-base font-bold text-gray-900">TopicFlow</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarMenu className="space-y-1">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Home"
                className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 font-medium rounded-lg transition-colors"
              >
                <Link href="/Dashboard">
                  <Home className="h-5 w-5" />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="My Roadmaps"
                className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 font-medium rounded-lg transition-colors"
              >
                <Link href="/Dashboard/Roadmap-generate">
                  <Map className="h-5 w-5" />
                  <span>My Roadmaps</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-200">
        <SidebarMenu>

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign Out"
              className="text-red-600 hover:bg-red-50 hover:text-red-700 font-medium rounded-lg transition-colors w-full"
              onClick={async () => {
                await signOut({ callbackUrl: "/" });
              }}
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
