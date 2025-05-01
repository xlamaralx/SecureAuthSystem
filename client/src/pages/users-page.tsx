import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/i18n";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogClose, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Check, Loader2, Pencil, Plus, Trash, X } from "lucide-react";
import { User } from "@shared/schema";

type ExtendedUser = User & {
  isEditing?: boolean;
};

export default function UsersPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [userToEdit, setUserToEdit] = useState<ExtendedUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<ExtendedUser | null>(null);

  // Form states for add/edit user
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState("user");
  const [formAuthorized, setFormAuthorized] = useState(false);
  const [formExpirationDate, setFormExpirationDate] = useState("");
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // This would be a query to get all users
        // Mock data for now
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        // Mock data for demonstration
        setUsers([
          {
            id: 1,
            name: "Admin User",
            email: "admin@example.com",
            password: "",
            role: "admin",
            authorized: true,
            createdAt: new Date().toISOString(),
            expirationDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 2,
            name: "Normal User",
            email: "user@example.com",
            password: "",
            role: "user",
            authorized: true,
            createdAt: new Date().toISOString(),
            expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 3,
            name: "Pending User",
            email: "pending@example.com",
            password: "",
            role: "user",
            authorized: false,
            createdAt: new Date().toISOString(),
            expirationDate: null,
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const resetFormFields = () => {
    setFormName("");
    setFormEmail("");
    setFormPassword("");
    setFormRole("user");
    setFormAuthorized(false);
    setFormExpirationDate("");
  };

  const handleEditUser = (user: ExtendedUser) => {
    setUserToEdit(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormPassword("");
    setFormRole(user.role);
    setFormAuthorized(user.authorized || false);
    setFormExpirationDate(user.expirationDate ? format(new Date(user.expirationDate), 'yyyy-MM-dd') : "");
  };

  const handleAddUser = async () => {
    setIsLoading(true);
    
    try {
      // This would be a mutation to add a user
      const newUser: ExtendedUser = {
        id: users.length + 1,
        name: formName,
        email: formEmail,
        password: formPassword,
        role: formRole as "admin" | "user",
        authorized: formAuthorized,
        createdAt: new Date().toISOString(),
        expirationDate: formExpirationDate ? new Date(formExpirationDate).toISOString() : null,
      };
      
      setUsers([...users, newUser]);
      setShowAddUserDialog(false);
      resetFormFields();
      
      toast({
        title: t('users.userAdded'),
        description: formName,
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

  const handleUpdateUser = async () => {
    if (!userToEdit) return;
    
    setIsLoading(true);
    
    try {
      // This would be a mutation to update a user
      const updatedUser: ExtendedUser = {
        ...userToEdit,
        name: formName,
        email: formEmail,
        password: formPassword || userToEdit.password,
        role: formRole as "admin" | "user",
        authorized: formAuthorized,
        expirationDate: formExpirationDate ? new Date(formExpirationDate).toISOString() : null,
      };
      
      setUsers(users.map(u => u.id === userToEdit.id ? updatedUser : u));
      setUserToEdit(null);
      resetFormFields();
      
      toast({
        title: t('users.userUpdated'),
        description: formName,
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
      // This would be a mutation to delete a user
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

  const handleToggleAuthorization = async (user: ExtendedUser, authorized: boolean) => {
    setIsLoading(true);
    
    try {
      // This would be a mutation to toggle user authorization
      const updatedUser = { ...user, authorized };
      setUsers(users.map(u => u.id === user.id ? updatedUser : u));
      
      toast({
        title: authorized ? t('users.userAuthorized') : t('users.userUnauthorized'),
        description: user.name,
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

  if (!user || user.role !== "admin") {
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
        <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('users.addUser')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('users.addUser')}</DialogTitle>
              <DialogDescription>
                {t('users.subtitle')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('common.name')}</Label>
                <Input
                  id="name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder={t('common.name')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">{t('common.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder={t('common.email')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">{t('common.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">{t('common.role')}</Label>
                <Select value={formRole} onValueChange={setFormRole}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('common.role')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">{t('users.adminRole')}</SelectItem>
                    <SelectItem value="user">{t('users.userRole')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="authorized">{t('common.authorized')}</Label>
                  <Switch
                    id="authorized"
                    checked={formAuthorized}
                    onCheckedChange={setFormAuthorized}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiration-date">{t('common.expiration')}</Label>
                <Input
                  id="expiration-date"
                  type="date"
                  value={formExpirationDate}
                  onChange={(e) => setFormExpirationDate(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">{t('common.cancel')}</Button>
              </DialogClose>
              <Button 
                type="submit" 
                onClick={handleAddUser}
                disabled={isLoading || !formName || !formEmail || !formPassword}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('common.save')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit User Dialog */}
        <Dialog open={!!userToEdit} onOpenChange={(open) => !open && setUserToEdit(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('users.editUser')}</DialogTitle>
              <DialogDescription>
                {userToEdit?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">{t('common.name')}</Label>
                <Input
                  id="edit-name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder={t('common.name')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-email">{t('common.email')}</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder={t('common.email')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-password">{t('common.password')}</Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder="Leave blank to keep current password"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-role">{t('common.role')}</Label>
                <Select value={formRole} onValueChange={setFormRole}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('common.role')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">{t('users.adminRole')}</SelectItem>
                    <SelectItem value="user">{t('users.userRole')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-authorized">{t('common.authorized')}</Label>
                  <Switch
                    id="edit-authorized"
                    checked={formAuthorized}
                    onCheckedChange={setFormAuthorized}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-expiration-date">{t('common.expiration')}</Label>
                <Input
                  id="edit-expiration-date"
                  type="date"
                  value={formExpirationDate}
                  onChange={(e) => setFormExpirationDate(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">{t('common.cancel')}</Button>
              </DialogClose>
              <Button 
                type="submit" 
                onClick={handleUpdateUser}
                disabled={isLoading || !formName || !formEmail}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('common.save')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Delete User Confirmation */}
        <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('users.deleteUser')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('users.deleteConfirmation')}
                <br />
                <strong>{userToDelete?.name}</strong> ({userToDelete?.email})
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteUser} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash className="mr-2 h-4 w-4" />
                )}
                {t('common.delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
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
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                        {user.role === "admin" ? t('users.adminRole') : t('users.userRole')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={user.authorized || false}
                          onCheckedChange={(checked) => handleToggleAuthorization(user, checked)}
                          aria-label={
                            user.authorized 
                              ? t('users.unauthorizeUser') 
                              : t('users.authorizeUser')
                          }
                        />
                        <span className={user.authorized ? "text-green-500" : "text-red-500"}>
                          {user.authorized ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.createdAt && format(new Date(user.createdAt), 'PP')}
                    </TableCell>
                    <TableCell>
                      {user.expirationDate 
                        ? format(new Date(user.expirationDate), 'PP')
                        : t('users.noExpirationDate')
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleEditUser(user)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon"
                          onClick={() => setUserToDelete(user)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}