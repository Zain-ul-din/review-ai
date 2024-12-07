/* eslint-disable @next/next/no-img-element */
"use client";
import {
  ArrowLeft,
  Code,
  Home,
  MessageCircle,
  Settings,
  Star,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ROUTES } from "@/lib/constants";
import { usePathname, useRouter } from "next/navigation";
import { SignedIn, useClerk, useUser } from "@clerk/nextjs";
import { Avatar } from "./ui/avatar";
import { Logo } from "./icons/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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
    title: "Developer",
    url: ROUTES.developer,
    icon: Code,
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

  const { openUserProfile, signOut } = useClerk();
  const router = useRouter();

  return (
    <Sidebar>
      <SidebarHeader>
        <h1 className="text-lg mx-1 text-foreground font-medium flex items-center gap-2 mt-6">
          <Logo className="w-8 h-8" />
          Reviews Plethora
        </h1>
      </SidebarHeader>
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
            <DropdownMenu>
              <DropdownMenuTrigger className="ml-auto">
                <Settings className="w-5 h-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => openUserProfile()}>
                  <User />
                  profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    signOut({
                      redirectUrl: ROUTES.home,
                    }).then(() => {
                      router.push(ROUTES.home);
                    });
                  }}
                  className="text-red-500 focus:text-red-600"
                >
                  <ArrowLeft /> sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SignedIn>
      </SidebarFooter>
    </Sidebar>
  );
}
