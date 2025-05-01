import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/i18n";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { UserManagement } from "@/components/dashboard/user-management";
import { Redirect } from "wouter";

export default function UsersPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  
  // Se o usuário não estiver autenticado, redirecione para a página de login
  if (!user) {
    return <Redirect to="/auth" />;
  }
  
  // Redireciona para home se não for admin
  if (user.role !== "admin") {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">{t('users.title')}</h1>
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <h2 className="text-xl font-semibold">{t('common.unauthorized')}</h2>
              <p className="text-muted-foreground mt-2">
                {t('auth.pendingApproval')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{t('users.title')}</h1>
          <p className="text-muted-foreground">{t('users.subtitle')}</p>
        </div>
      </div>
      
      {/* Componente de gerenciamento de usuários */}
      <div className="mt-6">
        <UserManagement />
      </div>
    </div>
  );
}