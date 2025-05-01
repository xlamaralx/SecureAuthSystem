import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  expirationDate?: string;
  authorized?: boolean;
}

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
  isEditing,
}: UserFormModalProps) {
  const [formName, setFormName] = useState(user?.name || "");
  const [formEmail, setFormEmail] = useState(user?.email || "");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState(user?.role || "user");
  const [formAuthorized, setFormAuthorized] = useState(user?.authorized || false);
  const [formExpirationDate, setFormExpirationDate] = useState(
    user?.expirationDate 
      ? new Date(user.expirationDate).toISOString().split("T")[0]
      : ""
  );
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when modal opens
  const resetForm = () => {
    if (isEditing && user) {
      setFormName(user.name);
      setFormEmail(user.email);
      setFormPassword("");
      setFormRole(user.role);
      setFormAuthorized(user.authorized || false);
      setFormExpirationDate(
        user.expirationDate
          ? new Date(user.expirationDate).toISOString().split("T")[0]
          : ""
      );
    } else {
      setFormName("");
      setFormEmail("");
      setFormPassword("");
      setFormRole("user");
      setFormAuthorized(false);
      setFormExpirationDate("");
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      const userData: Partial<User> = {
        name: formName,
        email: formEmail,
        role: formRole as "admin" | "user",
        authorized: formAuthorized,
      };

      if (formPassword) {
        userData.password = formPassword;
      }

      if (formExpirationDate) {
        userData.expirationDate = new Date(formExpirationDate).toISOString();
      }

      await onSave(userData);
      resetForm();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
      if (open) resetForm();
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Usuário" : "Adicionar Usuário"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edite os detalhes do usuário abaixo"
              : "Preencha os detalhes para criar um novo usuário"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Nome completo"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              placeholder="email@exemplo.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">
              {isEditing ? "Senha (deixe em branco para manter a atual)" : "Senha"}
            </Label>
            <Input
              id="password"
              type="password"
              value={formPassword}
              onChange={(e) => setFormPassword(e.target.value)}
              placeholder="••••••••"
              required={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Função</Label>
            <Select value={formRole} onValueChange={setFormRole}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="user">Usuário</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiration-date">Data de Expiração</Label>
            <Input
              id="expiration-date"
              type="date"
              value={formExpirationDate}
              onChange={(e) => setFormExpirationDate(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="authorized">Autorizado</Label>
            <Switch
              id="authorized"
              checked={formAuthorized}
              onCheckedChange={setFormAuthorized}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={
              isLoading ||
              !formName ||
              !formEmail ||
              (!isEditing && !formPassword)
            }
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Salvar" : "Adicionar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}