import { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { useLayout } from "@/hooks/use-layout";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import { Button } from "@/components/ui/button";
import { Sun, Moon, LayoutDashboard, Menu } from "lucide-react";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { theme, setTheme } = useTheme();
  const { layout, setLayout } = useLayout();

  // Toggle theme between dark and light
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Toggle layout between sidebar and topnav
  const toggleLayout = () => {
    setLayout(layout === "sidebar" ? "topnav" : "sidebar");
  };

  return (
    <div className="flex w-full min-h-screen">
      {layout === "sidebar" && <Sidebar />}
      {layout === "topnav" && <TopNavbar />}

      <main 
        className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${
          layout === "topnav" ? "mt-16" : "mt-0"
        }`}
      >
        <div className="flex items-center justify-end space-x-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleLayout}
            aria-label="Toggle layout"
          >
            {layout === "sidebar" ? <Menu className="h-5 w-5" /> : <LayoutDashboard className="h-5 w-5" />}
          </Button>
        </div>

        {children}
      </main>
    </div>
  );
}