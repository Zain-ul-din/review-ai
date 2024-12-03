/* eslint-disable @next/next/no-img-element */
"use client";
import { Home, MessageCircle, Settings, Star } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ROUTES } from "@/lib/constants";
import { usePathname } from "next/navigation";
import { SignedIn, useClerk, useUser } from "@clerk/nextjs";
import { Avatar } from "./ui/avatar";
import { Button } from "./ui/button";

// Menu items.
const items = [
  {
    title: "Home",
    url: ROUTES.dashboard,
    icon: Home,
  },
  {
    title: "New Campaign",
    url: ROUTES.newCampaign,
    icon: Star,
  },
  {
    title: "Feedback",
    url: ROUTES.feedback,
    icon: MessageCircle,
  },
  // Not planned atm
  // {
  //   title: "Calendar",
  //   url: "#",
  //   icon: Calendar,
  // },
  // {
  //   title: "Search",
  //   url: "#",
  //   icon: Search,
  // },
  // {
  //   title: "Settings",
  //   url: "#",
  //   icon: Settings,
  // },
];

export function AppSidebar() {
  const pathname = usePathname();

  const user = useUser();

  const { openUserProfile } = useClerk();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="my-4">Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem className="px-2" key={item.title}>
                  <SidebarMenuButton
                    variant={pathname === item.url ? "outline" : "default"}
                    isActive={pathname === item.url}
                    asChild
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SignedIn>
          <div className="flex items-center mb-4 mx-2">
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <img
                  src={user.user?.imageUrl}
                  alt={user.user?.fullName || ""}
                />
              </Avatar>
              <p>{user.user?.fullName}</p>
            </div>
            <Button
              size={"icon"}
              className="ml-auto"
              variant={"secondary"}
              onClick={() => openUserProfile()}
            >
              <Settings />
            </Button>
          </div>
        </SignedIn>
      </SidebarFooter>
    </Sidebar>
  );
}
