import { useState } from "react";
import { Home, User, Users, Settings, LogOut, Menu } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./mobile-menu";

interface TopNavbarProps {
  className?: string;
}

export function TopNavbar({ className }: TopNavbarProps) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  const handleLogout = async () => {
    await logout();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <nav className={cn("fixed top-0 left-0 right-0 bg-background-100 border-b border-border z-10 h-16", className)}>
        <div className="container mx-auto px-4 flex items-center justify-between h-full">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Dashboard Admin</h1>
          </div>
          
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="p-2 rounded-md hover:bg-secondary/50" 
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setLocation("/")}
              className={cn(
                "p-2 text-sm rounded-md flex items-center",
                isActive("/")
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : "hover:bg-secondary/50"
              )}
            >
              <Home className="mr-2 h-4 w-4" />
              <span>Início</span>
            </button>
            <button
              onClick={() => setLocation("/profile")}
              className={cn(
                "p-2 text-sm rounded-md flex items-center",
                isActive("/profile")
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : "hover:bg-secondary/50"
              )}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </button>
            {user?.role === "admin" && (
              <button
                onClick={() => setLocation("/users")}
                className={cn(
                  "p-2 text-sm rounded-md flex items-center",
                  isActive("/users")
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "hover:bg-secondary/50"
                )}
              >
                <Users className="mr-2 h-4 w-4" />
                <span>Gerenciar Usuários</span>
              </button>
            )}
            <button
              onClick={() => setLocation("/settings")}
              className={cn(
                "p-2 text-sm rounded-md flex items-center",
                isActive("/settings")
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : "hover:bg-secondary/50"
              )}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </button>
            <button
              onClick={handleLogout}
              className="p-2 text-sm rounded-md flex items-center hover:bg-secondary/50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={mobileMenuOpen} onClose={toggleMobileMenu} />
    </>
  );
}
