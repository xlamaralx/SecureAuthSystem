import { Home, User, Users, Settings, LogOut, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();

  const isActive = (path: string) => location === path;

  const handleLogout = async () => {
    await logout();
  };

  const handleNavigation = (path: string) => {
    setLocation(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 bg-background/80 z-50">
      <div className="bg-background-100 w-64 h-full p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Menu</h1>
          <button 
            onClick={onClose}
            className="p-2 rounded-md hover:bg-secondary/50" 
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => handleNavigation("/")}
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
                onClick={() => handleNavigation("/profile")}
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
                  onClick={() => handleNavigation("/users")}
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
                onClick={() => handleNavigation("/settings")}
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
      </div>
    </div>
  );
}
