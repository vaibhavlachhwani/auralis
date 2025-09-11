"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Cable, ChartNoAxesCombined, Gauge, History, Info } from "lucide-react";
import { VaibhavLogo } from "./logo/VaibhavLogo";
import { NavLink } from "react-router-dom";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <div>
                <ChartNoAxesCombined />
                <span className="text-base font-semibold">Auralis</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <NavLink to="/">
                  {({ isActive }) => (
                    <SidebarMenuButton
                      className="w-full justify-start"
                      variant={isActive ? "outline" : null}
                      tooltip={"Overview"}
                    >
                      <Gauge />
                      <span>Overview</span>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <NavLink to="/connections">
                  {({ isActive }) => (
                    <SidebarMenuButton
                      className="w-full justify-start"
                      variant={isActive ? "outline" : null}
                      tooltip={"Connections"}
                    >
                      <Cable />
                      <span>Connections</span>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <NavLink to="/history">
                  {({ isActive }) => (
                    <SidebarMenuButton
                      className="w-full justify-start"
                      variant={isActive ? "outline" : null}
                      tooltip={"History"}
                    >
                      <History />
                      <span>History</span>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <NavLink to="/about">
                  {({ isActive }) => (
                    <SidebarMenuButton
                      className="w-full justify-start"
                      variant={isActive ? "outline" : null}
                      tooltip={"About Auralis"}
                    >
                      <Info />
                      <span>About Auralis</span>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <a
                  href="https://www.vaibhavlachhwani.tech" // Replace with your actual URL
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SidebarMenuButton
                    className="w-full justify-start"
                    variant="default"
                    tooltip={"Built by Vaibhav Lachhwani"}
                  >
                    <VaibhavLogo width={20} height={20} />
                    <span>Vaibhav Lachhwani</span>
                  </SidebarMenuButton>
                </a>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
