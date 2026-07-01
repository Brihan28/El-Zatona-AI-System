import {
  LayoutDashboard,
  Upload,
  FileText,
  HelpCircle,
  Calendar,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import UserMenu from "@/components/UserMenu";

import { NavLink } from "@/components/NavLink";
// import UserMenu from "@/components/UserMenu";   // <-- we'll create this next

const mainNav = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Upload Lecture", url: "/upload", icon: Upload },
  { title: "AI Summary", url: "/summary", icon: FileText },
  { title: "Quizzes", url: "/quiz", icon: HelpCircle },
  { title: "Study Plan", url: "/study-plan", icon: Calendar },
];

function AppSidebarContent() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/* Logo */}
        <div className="p-4 flex items-center gap-2">
          <img
            src="/LOGO.png"
            alt="Logo"
            className="h-8 w-8 object-contain shrink-0"
          />

          {!collapsed && (
            <span className="font-heading text-sm font-bold text-foreground">
              EL-Zatona
            </span>
          )}
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-muted/50"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />

                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const DashboardLayout = ({
  children,
  title,
  subtitle,
}: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebarContent />

        <div className="flex-1 flex flex-col">
          {/* Top Navbar */}
          <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />

              <div>
                <h1 className="font-heading text-lg font-semibold text-foreground">
                  {title}
                </h1>

                {subtitle && (
                  <p className="text-xs text-muted-foreground">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* User Dropdown goes here */}
            <UserMenu />
          </header>

          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;