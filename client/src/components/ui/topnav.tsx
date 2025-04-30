import { useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, Home, User, UserCog, Settings, LogOut } from "lucide-react";
import { useLocation, Link } from "wouter";
import { Button } from "./button";
import { useAuth } from "@/hooks/use-auth";
import { ThemeToggle } from "./theme-toggle";
import { LayoutToggle } from "./layout-toggle";

export function TopNav() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logoutMutation } = useAuth();
  
  const isAdmin = user?.role === "admin";

  const links = [
    { href: "/", icon: Home, label: "Início", active: location === "/" },
    { href: "/profile", icon: User, label: "Perfil", active: location === "/profile" },
    { 
      href: "/users", 
      icon: UserCog, 
      label: "Gerenciar Usuários", 
      active: location === "/users",
      adminOnly: true
    },
    { href: "/settings", icon: Settings, label: "Configurações", active: location === "/settings" },
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-background-100 border-b border-border z-10 transition-all duration-300">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Dashboard Admin</h1>
          </div>
          
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            {links.map((link, index) => {
              if (link.adminOnly && !isAdmin) return null;
              
              return (
                <Link key={index} href={link.href}>
                  <a
                    className={cn(
                      "p-2 text-sm rounded-md hover:bg-secondary/50 flex items-center",
                      link.active ? "bg-primary/10 text-primary" : ""
                    )}
                  >
                    <link.icon className="h-4 w-4 mr-2" />
                    <span>{link.label}</span>
                  </a>
                </Link>
              );
            })}
            
            <button
              onClick={handleLogout}
              className="p-2 text-sm rounded-md hover:bg-secondary/50 flex items-center"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>Sair</span>
            </button>
            
            <div className="ml-4 flex items-center space-x-2">
              <ThemeToggle />
              <LayoutToggle />
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-background/80 z-50">
          <div className="bg-background-100 w-64 h-full p-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-bold">Menu</h1>
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            <nav>
              <ul className="space-y-2">
                {links.map((link, index) => {
                  if (link.adminOnly && !isAdmin) return null;
                  
                  return (
                    <li key={index}>
                      <Link href={link.href}>
                        <a
                          className={cn(
                            "flex items-center p-2 text-sm rounded-md hover:bg-secondary/50",
                            link.active ? "bg-primary/10 text-primary" : ""
                          )}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <link.icon className="h-5 w-5 mr-2" />
                          <span>{link.label}</span>
                        </a>
                      </Link>
                    </li>
                  );
                })}
                
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center p-2 text-sm rounded-md hover:bg-secondary/50"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    <span>Sair</span>
                  </button>
                </li>
                
                <li className="pt-4">
                  <div className="flex justify-between">
                    <ThemeToggle />
                    <LayoutToggle />
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
