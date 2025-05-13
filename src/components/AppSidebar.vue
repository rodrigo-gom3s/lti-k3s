<script setup>
import { AppWindow, Box, Boxes, CaseUpper, HardDriveUpload, MonitorCog, Workflow } from "lucide-vue-next"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from "@/components/ui/sidebar"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { RouterLink } from "vue-router";


// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "dashboard",
    icon: AppWindow,
  },
  {
    title: "Namespaces",
    url: "namespaces",
    icon: CaseUpper,
  },
  {
    title: "Pods",
    url: "",
    icon: Boxes,
  },
  {
    title: "Deployments",
    url: "",
    icon: HardDriveUpload,
  },
  {
    title: "Services",
    url: "",
    icon: MonitorCog,
  }
];

</script>

<template>
  <Sidebar class="text-blue-600">
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel class="mb-4">Kubernetes Manager</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
              <SidebarMenuItem v-for="item in items" :key="item.title" class="m-1">
                <SidebarMenuButton asChild>
                  <RouterLink :to="{ name: item.url }">
                    <component :is="item.icon" />
                    <span>{{ item.title }}</span>
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>