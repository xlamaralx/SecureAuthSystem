import { useState, useEffect } from "react";
import { useTranslation } from "@/i18n";
import { 
  Dialog, 
  DialogClose, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { User } from "@shared/schema";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: Partial<User>) => void;
  user: User | null;
  isEditing: boolean;
}

export function UserFormModal({
  isOpen,
  onClose,
  onSave,
  user,
  isEditing
}: UserFormModalProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [authorized, setAuthorized] = useState(false);
  const [expirationDate, setExpirationDate] = useState("");
  
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPassword("");
      setRole(user.role as "admin" | "user");
      setAuthorized(user.authorized || false);
      setExpirationDate(user.expiresAt 
        ? new Date(user.expiresAt).toISOString().split("T")[0] 
        : "");
    } else {
      // Reset form when adding a new user
      setName("");
      setEmail("");
      setPassword("");
      setRole("user");
      setAuthorized(false);
      setExpirationDate("");
    }
  }, [user]);
  
  const handleSubmit = () => {
    setIsLoading(true);
    
    const userData: Partial<User> = {
      name,
      email,
      role,
      authorized,
      expiresAt: expirationDate ? new Date(expirationDate).toISOString() : null,
    };
    
    // Só incluímos a senha se estiver preenchida
    if (password) {
      userData.password = password;
    }
    
    onSave(userData);
    setIsLoading(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t('users.editUser') : t('users.addUser')}
          </DialogTitle>
          <DialogDescription>
            {t('users.subtitle')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('common.name')}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('common.name')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">{t('common.email')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('common.email')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">
              {isEditing ? `${t('common.password')} (${t('common.optional')})` : t('common.password')}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required={!isEditing}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">{t('common.role')}</Label>
            <Select value={role} onValueChange={(value) => setRole(value as "admin" | "user")}>
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
                checked={authorized}
                onCheckedChange={setAuthorized}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expiration-date">{t('common.expiration')}</Label>
            <Input
              id="expiration-date"
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t('common.cancel')}</Button>
          </DialogClose>
          <Button 
            onClick={handleSubmit}
            disabled={isLoading || !name || !email || (!isEditing && !password)}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('common.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}