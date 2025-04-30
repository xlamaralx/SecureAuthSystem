import { Home, User, Users, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();

  const isActive = (path: string) => location === path;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside className={cn("w-64 bg-background-100 border-r border-border h-screen overflow-y-auto flex-shrink-0 transition-all duration-300", className)}>
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-bold">Dashboard Admin</h1>
      </div>
      
      <nav className="mt-4 px-2">
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => setLocation("/")}
              className={cn(
                "flex items-center p-2 text-sm rounded-md w-full text-left",
                isActive("/")
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : "hover:bg-secondary/50"
              )}
            >
              <Home className="mr-2 h-5 w-5" />
              <span>Início</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setLocation("/profile")}
              className={cn(
                "flex items-center p-2 text-sm rounded-md w-full text-left",
                isActive("/profile")
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : "hover:bg-secondary/50"
              )}
            >
              <User className="mr-2 h-5 w-5" />
              <span>Perfil</span>
            </button>
          </li>
          {user?.role === "admin" && (
            <li>
              <button
                onClick={() => setLocation("/users")}
                className={cn(
                  "flex items-center p-2 text-sm rounded-md w-full text-left",
                  isActive("/users")
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "hover:bg-secondary/50"
                )}
              >
                <Users className="mr-2 h-5 w-5" />
                <span>Gerenciar Usuários</span>
              </button>
            </li>
          )}
          <li>
            <button
              onClick={() => setLocation("/settings")}
              className={cn(
                "flex items-center p-2 text-sm rounded-md w-full text-left",
                isActive("/settings")
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : "hover:bg-secondary/50"
              )}
            >
              <Settings className="mr-2 h-5 w-5" />
              <span>Configurações</span>
            </button>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center p-2 text-sm rounded-md w-full text-left hover:bg-secondary/50"
            >
              <LogOut className="mr-2 h-5 w-5" />
              <span>Sair</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
