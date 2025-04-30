import { useState, useEffect } from "react";
import { UserPlus, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { UserFormModal } from "./user-form-modal";
import { DeleteConfirmModal } from "./delete-confirm-modal";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  expirationDate?: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/users", {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsEditing(false);
    setIsFormModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditing(true);
    setIsFormModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleSaveUser = async (userData: Partial<User>) => {
    try {
      if (isEditing && selectedUser) {
        const response = await apiRequest(
          "PUT", 
          `/api/users/${selectedUser.id}`, 
          userData
        );
        
        if (!response.ok) {
          throw new Error("Failed to update user");
        }
        
        toast({
          title: "Success",
          description: "User updated successfully",
        });
      } else {
        const response = await apiRequest(
          "POST", 
          "/api/users", 
          userData
        );
        
        if (!response.ok) {
          throw new Error("Failed to create user");
        }
        
        toast({
          title: "Success",
          description: "User created successfully",
        });
      }
      
      fetchUsers(); // Refresh user list
      setIsFormModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save user",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    
    try {
      const response = await apiRequest(
        "DELETE", 
        `/api/users/${selectedUser.id}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      
      fetchUsers(); // Refresh user list
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const columns = [
    {
      key: "name" as keyof User,
      header: "Nome",
    },
    {
      key: "email" as keyof User,
      header: "Email",
    },
    {
      key: "role" as keyof User,
      header: "Função",
      cell: (user: User) => (
        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
          {user.role === "admin" ? "Admin" : "User"}
        </Badge>
      ),
    },
    {
      key: "createdAt" as keyof User,
      header: "Data Inclusão",
      cell: (user: User) => (
        <span>{format(new Date(user.createdAt), "dd/MM/yyyy")}</span>
      ),
    },
    {
      key: "expirationDate" as keyof User,
      header: "Data Expiração",
      cell: (user: User) => (
        <span>
          {user.expirationDate
            ? format(new Date(user.expirationDate), "dd/MM/yyyy")
            : "N/A"}
        </span>
      ),
    },
  ];

  const renderActions = (user: User) => (
    <div className="flex space-x-2">
      <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
        <Edit className="h-4 w-4 text-blue-500" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user)}>
        <Trash className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gerenciar Usuários</h1>
        <Button onClick={handleAddUser}>
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      <DataTable
        data={users}
        columns={columns}
        searchField="email"
        actions={renderActions}
      />

      <UserFormModal 
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
        isEditing={isEditing}
      />

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        userName={selectedUser?.name || ""}
      />
    </div>
  );
}
