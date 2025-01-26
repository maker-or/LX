import * as React from "react";
import { GalleryVerticalEnd } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuButton,
  SidebarInset,
  SidebarMenuItem,
  SidebarRail,
} from "~/components/ui/sidebar";
import { UserButton } from '@clerk/nextjs'

// This is sample data.
const data = {
  navMain: [
    {
      title: "File Upload",
      url: "/",
    },
    {
      title: "Question Generation",
      url: "/AI",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      variant="floating"
      {...props}
      className="bg-[#f7eee3] h-1/5 "
    >

      <SidebarContent className=" bg-[#f7eee3]  border-2 border-[#0c0c0c32] rounded-lg shadow-md">
        <SidebarGroup>
          <SidebarMenu className="bg-transparent">
          <UserButton/>
          





            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a
                    href={item.url}
                    className="font-medium text-[#0c0c0c] hover:text-gray-300 transition"
                  >
                    {item.title}
                  </a>

                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}