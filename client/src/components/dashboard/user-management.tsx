import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/i18n";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserFormModal } from "@/components/dashboard/user-form-modal";
import { DeleteConfirmModal } from "@/components/dashboard/delete-confirm-modal";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { Check, Loader2, Pencil, Plus, Trash, X } from "lucide-react";
import { User } from "@shared/schema";

// Vamos criar um tipo mais específico que corresponda ao que estamos usando
type ExtendedUser = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  authorized: boolean;
  createdAt: string;
  expirationDate: string | null;
  isEditing?: boolean;
};

export function UserManagement() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userToEdit, setUserToEdit] = useState<ExtendedUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<ExtendedUser | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Buscar usuários do servidor
        const response = await fetch('/api/users');
        
        if (!response.ok) {
          throw new Error('Falha ao buscar usuários');
        }
        
        const data = await response.json();
        
        // Converter os dados para o formato ExtendedUser
        const formattedUsers: ExtendedUser[] = data.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          password: "",
          role: user.role,
          authorized: user.authorized,
          createdAt: user.createdAt,
          expirationDate: user.expirationDate,
        }));
        
        setUsers(formattedUsers);
      } catch (error) {
        toast({
          title: t('common.error'),
          description: String(error),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [t, toast]);

  const handleAddUser = async (userData: Partial<User>) => {
    setIsLoading(true);
    
    try {
      // Enviar solicitação para adicionar um usuário
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao adicionar usuário');
      }
      
      const newUser = await response.json();
      
      // Atualizar a lista de usuários com o novo usuário
      setUsers([...users, {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        password: "",
        role: newUser.role,
        authorized: newUser.authorized,
        createdAt: newUser.createdAt,
        expirationDate: newUser.expirationDate,
      }]);
      
      setShowAddUserModal(false);
      
      toast({
        title: t('users.userAdded'),
        description: newUser.name,
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (userData: Partial<User>) => {
    if (!userToEdit) return;
    
    setIsLoading(true);
    
    try {
      // Garantir que a data de expiração seja enviada como string
      const userDataForApi = {
        ...userData,
        // Se for uma data, converter para string, senão manter como está
        expirationDate: userData.expirationDate
      };
      
      // Enviar solicitação para atualizar um usuário
      const response = await fetch(`/api/users/${userToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDataForApi),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao atualizar usuário');
      }
      
      const updatedUserData = await response.json();
      
      // Atualizar o usuário na lista
      const updatedUser: ExtendedUser = {
        ...userToEdit,
        name: updatedUserData.name || userToEdit.name,
        email: updatedUserData.email || userToEdit.email,
        role: updatedUserData.role || userToEdit.role,
        authorized: updatedUserData.authorized ?? userToEdit.authorized,
        expirationDate: updatedUserData.expirationDate,
      };
      
      setUsers(users.map(u => u.id === userToEdit.id ? updatedUser : u));
      setUserToEdit(null);
      
      toast({
        title: t('users.userUpdated'),
        description: updatedUser.name,
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    setIsLoading(true);
    
    try {
      // Enviar solicitação para excluir um usuário
      const response = await fetch(`/api/users/${userToDelete.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Falha ao excluir usuário');
      }
      
      // Remover o usuário da lista
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setUserToDelete(null);
      
      toast({
        title: t('users.userDeleted'),
        description: userToDelete.name,
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAuthorization = async (userItem: ExtendedUser, authorized: boolean) => {
    setIsLoading(true);
    
    try {
      // Enviar solicitação para atualizar a autorização do usuário
      const response = await fetch(`/api/users/${userItem.id}/authorize`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ authorized }),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao atualizar autorização do usuário');
      }
      
      // Atualizar o usuário na lista
      const updatedUser = { ...userItem, authorized };
      setUsers(users.map(u => u.id === userItem.id ? updatedUser : u));
      
      toast({
        title: authorized ? t('users.userAuthorized') : t('users.userUnauthorized'),
        description: userItem.name,
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">{t('users.title')}</h2>
        <Button onClick={() => setShowAddUserModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t('users.addUser')}
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('common.name')}</TableHead>
                <TableHead>{t('common.email')}</TableHead>
                <TableHead>{t('common.role')}</TableHead>
                <TableHead>{t('common.authorized')}</TableHead>
                <TableHead>{t('common.createdAt')}</TableHead>
                <TableHead>{t('common.expiration')}</TableHead>
                <TableHead className="text-right">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(userItem => (
                <TableRow key={userItem.id}>
                  <TableCell className="font-medium">{userItem.name}</TableCell>
                  <TableCell>{userItem.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={userItem.role === "admin" ? "default" : "secondary"}
                    >
                      {userItem.role === "admin" 
                        ? t('users.adminRole') 
                        : t('users.userRole')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={userItem.authorized}
                        onCheckedChange={(checked) => handleToggleAuthorization(userItem, checked)}
                        disabled={user?.id === userItem.id}
                      />
                      <span>
                        {userItem.authorized ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(userItem.createdAt), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    {userItem.expirationDate ? (
                      format(new Date(userItem.expirationDate), 'dd/MM/yyyy')
                    ) : (
                      t('users.noExpirationDate')
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setUserToEdit(userItem)}
                        disabled={isLoading}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setUserToDelete(userItem)}
                        disabled={isLoading || userItem.id === user?.id}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhum usuário encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      <UserFormModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onSave={handleAddUser}
        user={null}
        isEditing={false}
      />
      
      <UserFormModal
        isOpen={!!userToEdit}
        onClose={() => setUserToEdit(null)}
        onSave={handleUpdateUser}
        user={userToEdit}
        isEditing={true}
      />
      
      <DeleteConfirmModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteUser}
        userName={userToDelete?.name || ""}
      />
    </>
  );
}