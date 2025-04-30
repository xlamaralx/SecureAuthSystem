import { cn } from "@/lib/utils";
import { Home, User, UserCog, Settings, LogOut } from "lucide-react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const [location] = useLocation();
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
  };

  return (
    <aside className="w-64 h-screen bg-background-100 border-r border-border flex-shrink-0 transition-all duration-300">
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-bold">Dashboard Admin</h1>
      </div>
      
      <nav className="mt-4 px-2">
        <ul className="space-y-1">
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
                  >
                    <link.icon className="h-5 w-5 mr-2" />
                    {!collapsed && <span>{link.label}</span>}
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
              {!collapsed && <span>Sair</span>}
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
