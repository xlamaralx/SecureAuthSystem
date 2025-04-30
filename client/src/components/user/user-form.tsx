import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import { format, addYears } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: String!, $password: String!, $role: String!, $expiresAt: String) {
    createUser(name: $name, email: $email, password: $password, role: $role, expiresAt: $expiresAt) {
      id
      name
      email
      role
      expiresAt
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $name: String, $email: String, $role: String, $expiresAt: String) {
    updateUser(id: $id, name: $name, email: $email, role: $role, expiresAt: $expiresAt) {
      id
      name
      email
      role
      expiresAt
    }
  }
`;

const userSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  role: z.enum(["admin", "user"]),
  expiresAt: z.string(),
});

type UserFormValues = z.infer<typeof userSchema>;

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  expiresAt?: string | null;
};

type UserFormProps = {
  open: boolean;
  onClose: () => void;
  user?: User;
  onSuccess: () => void;
};

export function UserForm({ open, onClose, user, onSuccess }: UserFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [createUser] = useMutation(CREATE_USER, {
    onCompleted: () => {
      toast({
        title: "Success",
        description: "User created successfully",
      });
      onSuccess();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      onSuccess();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Get form for either create or update
  const form = useForm<UserFormValues>({
    resolver: zodResolver(
      user 
        ? userSchema.omit({ password: true }) 
        : userSchema
    ),
    defaultValues: {
      id: user?.id || "",
      name: user?.name || "",
      email: user?.email || "",
      role: (user?.role as "admin" | "user") || "user",
      expiresAt: user?.expiresAt || format(addYears(new Date(), 1), "yyyy-MM-dd"),
    },
    mode: "onChange",
  });

  // Reset form when user changes
  useEffect(() => {
    if (open) {
      form.reset({
        id: user?.id || "",
        name: user?.name || "",
        email: user?.email || "",
        role: (user?.role as "admin" | "user") || "user",
        expiresAt: user?.expiresAt || format(addYears(new Date(), 1), "yyyy-MM-dd"),
      });
    }
  }, [form, user, open]);

  const onSubmit = async (data: UserFormValues) => {
    setIsSubmitting(true);
    try {
      if (user) {
        // Update user
        await updateUser({ 
          variables: { 
            id: user.id,
            name: data.name,
            email: data.email,
            role: data.role,
            expiresAt: data.expiresAt,
          } 
        });
      } else {
        // Create user
        await createUser({ 
          variables: { 
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role,
            expiresAt: data.expiresAt,
          } 
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = user ? "Editar Usuário" : "Adicionar Usuário";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {!user && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Função</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma função" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">Usuário</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Data de Expiração</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
