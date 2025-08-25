"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Home,
  ShoppingCart,
  TrendingUp,
  Users,
  BarChart3,
  FolderOpen,
  Bitcoin,
  GraduationCap,
  Hospital,
  MessageSquare,
  Image,
  Kanban,
  StickyNote,
  MessageCircle,
  Mail,
  CheckSquare,
  Calendar,
  Key,
  UserSquare,
  User,
  Settings,
  CreditCard,
  Shield
} from "lucide-react"

import { NavMain } from "@/components/NavMain"
import { NavProjects } from "@/components/NavProjects"
import { NavUser } from "@/components/NavUser"
import { TeamSwitcher } from "@/components/TeamSwitcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/avatars/john-doe.jpg",
  },
  teams: [
    {
      name: "Shadcn UI Kit",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    }
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Default",
          url: "/",
        },
        {
          title: "E-commerce",
          url: "/ecommerce",
        },
        {
          title: "Sales",
          url: "/sales",
        },
        {
          title: "CRM",
          url: "/crm",
        },
        {
          title: "Website Analytics",
          url: "/analytics",
        },
        {
          title: "Project Management",
          url: "/project-management",
        },
        {
          title: "File Manager",
          url: "/file-manager",
        },
        {
          title: "Crypto",
          url: "/crypto",
        },
        {
          title: "Academy",
          url: "/academy",
        },
        {
          title: "Hospital",
          url: "/hospital",
        }
      ],
    },
    {
      title: "AI",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "AI Chat",
          url: "/ai-chat",
        },
        {
          title: "Image Generator",
          url: "/image-generator",
        },
      ],
    },
    {
      title: "Apps",
      url: "#",
      icon: SquareTerminal,
      items: [
        {
          title: "Kanban",
          url: "/kanban",
        },
        {
          title: "Notes",
          url: "/notes",
        },
        {
          title: "Chats",
          url: "/chats",
        },
        {
          title: "Mail",
          url: "/mail",
        },
        {
          title: "Todo List",
          url: "/todo",
        },
        {
          title: "Tasks",
          url: "/tasks",
        },
        {
          title: "Calendar",
          url: "/calendar",
        },
        {
          title: "API Keys",
          url: "/api-keys",
        },
      ],
    },
    {
      title: "Pages",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Users List",
          url: "/users",
        },
        {
          title: "Profile",
          url: "/profile",
        },
        {
          title: "Settings",
          url: "/settings",
        },
        {
          title: "Pricing",
          url: "/pricing",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}