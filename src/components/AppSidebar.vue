<script setup>
import { AppWindow, Box, Boxes, CaseUpper, HardDriveUpload, MonitorCog, Workflow, LogOut } from "lucide-vue-next"
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

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth"

const authStore = useAuthStore()

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
    <div class="mt-auto p-4 border-t">
      <div class="flex items-center justify-between space-x-4">
        <div>
          <p class="text-sm text-gray-500">Cluster IP: <span class="font-semibold">{{ authStore.ip }}</span></p>
        </div>
        <Button variant="outline" class="text-s px-2 py-1" @click="authStore.logout" alt-title="Logout">
          <LogOut class="w-4 h-4" />
        </Button>
      </div>
    </div>
  </Sidebar>
</template>