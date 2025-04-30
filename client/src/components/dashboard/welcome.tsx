import { Card, CardContent } from "@/components/ui/card";
import { ChartPie, User, History } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";

export function Welcome() {
  const { user } = useAuth();

  // Format the date for display
  const formattedDate = user?.createdAt 
    ? format(new Date(user.createdAt), "dd/MM/yyyy")
    : "Unknown";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bem-vindo, {user?.name}!</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Visão geral</h3>
              <span className="p-2 bg-primary/10 rounded-full text-primary">
                <ChartPie className="h-5 w-5" />
              </span>
            </div>
            <p className="text-muted-foreground">
              Bem-vindo ao painel administrativo. Este é seu ponto de acesso para todas as funcionalidades do sistema.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Seu perfil</h3>
              <span className="p-2 bg-primary/10 rounded-full text-primary">
                <User className="h-5 w-5" />
              </span>
            </div>
            <p className="text-muted-foreground">
              Você está logado como <span className="font-medium">{user?.role === "admin" ? "Admin" : "User"}</span>. 
              Cadastrado em: <span>{formattedDate}</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Atividades recentes</h3>
              <span className="p-2 bg-primary/10 rounded-full text-primary">
                <History className="h-5 w-5" />
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                <span className="text-muted-foreground">Login realizado com sucesso</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                <span className="text-muted-foreground">Acesso ao dashboard</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Dashboard</h3>
          </div>
          <div className="aspect-video relative bg-muted rounded-md overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80" 
              alt="Dashboard visualization" 
              className="w-full h-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
