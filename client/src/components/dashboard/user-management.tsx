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

type ExtendedUser = User & {
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
        // Isso seria uma consulta para obter todos os usuários
        // Mock data por enquanto
        setUsers([
          {
            id: 1,
            name: "Admin User",
            email: "admin@example.com",
            password: "",
            role: "admin",
            authorized: true,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 2,
            name: "Normal User",
            email: "user@example.com",
            password: "",
            role: "user",
            authorized: true,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 3,
            name: "Pending User",
            email: "pending@example.com",
            password: "",
            role: "user",
            authorized: false,
            createdAt: new Date().toISOString(),
            expiresAt: null,
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = (userData: Partial<User>) => {
    setIsLoading(true);
    
    try {
      // Isso seria uma mutação para adicionar um usuário
      const newUser: ExtendedUser = {
        id: users.length + 1,
        name: userData.name || "",
        email: userData.email || "",
        password: userData.password || "",
        role: userData.role as "admin" | "user" || "user",
        authorized: userData.authorized || false,
        createdAt: new Date().toISOString(),
        expiresAt: userData.expiresAt || null,
      };
      
      setUsers([...users, newUser]);
      setShowAddUserModal(false);
      
      toast({
        title: t('users.userAdded'),
        description: userData.name,
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

  const handleUpdateUser = (userData: Partial<User>) => {
    if (!userToEdit) return;
    
    setIsLoading(true);
    
    try {
      // Isso seria uma mutação para atualizar um usuário
      const updatedUser: ExtendedUser = {
        ...userToEdit,
        ...userData,
      };
      
      setUsers(users.map(u => u.id === userToEdit.id ? updatedUser : u));
      setUserToEdit(null);
      
      toast({
        title: t('users.userUpdated'),
        description: userData.name,
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

  const handleDeleteUser = () => {
    if (!userToDelete) return;
    
    setIsLoading(true);
    
    try {
      // Isso seria uma mutação para excluir um usuário
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

  const handleToggleAuthorization = (userItem: ExtendedUser, authorized: boolean) => {
    setIsLoading(true);
    
    try {
      // Isso seria uma mutação para alternar a autorização do usuário
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
                    {userItem.expiresAt ? (
                      format(new Date(userItem.expiresAt), 'dd/MM/yyyy')
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