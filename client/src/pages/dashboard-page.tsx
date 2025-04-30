import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import { Welcome } from "@/components/dashboard/welcome";
import { UserManagement } from "@/components/dashboard/user-management";
import { useTheme } from "@/hooks/use-theme";
import { useLayout } from "@/hooks/use-layout";
import { Button } from "@/components/ui/button";
import { Sun, Moon, LayoutDashboard, Menu } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { layout, setLayout } = useLayout();
  const [location] = useLocation();
  const [currentScreen, setCurrentScreen] = useState<string>("/");

  // Update current screen based on location
  useEffect(() => {
    setCurrentScreen(location);
  }, [location]);

  // Toggle theme between dark and light
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Toggle layout between sidebar and topnav
  const toggleLayout = () => {
    setLayout(layout === "sidebar" ? "topnav" : "sidebar");
  };

  // Determine which screen to display
  const renderScreen = () => {
    switch (currentScreen) {
      case "/":
        return <Welcome />;
      case "/users":
        return user?.role === "admin" ? <UserManagement /> : <Welcome />;
      default:
        return <Welcome />;
    }
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

        {renderScreen()}
      </main>
    </div>
  );
}
