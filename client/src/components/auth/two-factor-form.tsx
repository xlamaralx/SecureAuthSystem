import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const verificationSchema = z.object({
  code: z.string().length(6, "Code must be 6 digits"),
});

type VerificationFormValues = z.infer<typeof verificationSchema>;

type TwoFactorFormProps = {
  onBackToLogin: () => void;
  onResendCode: () => void;
};

export function TwoFactorForm({ onBackToLogin, onResendCode }: TwoFactorFormProps) {
  const { verifyLoginMutation, pendingEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: VerificationFormValues) => {
    if (!pendingEmail) {
      return;
    }
    
    setIsLoading(true);
    try {
      await verifyLoginMutation.mutateAsync({
        email: pendingEmail,
        code: data.code,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 bg-background-100 p-8 rounded-lg shadow-lg border border-border">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Verificação em duas etapas</h1>
        <p className="text-muted-foreground mt-1">Enviamos um código para seu email</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Código de verificação</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Digite o código de 6 dígitos" 
                    maxLength={6}
                    {...field} 
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="one-time-code"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !pendingEmail}
          >
            {isLoading ? "Verificando..." : "Verificar"}
          </Button>

          <div className="text-center space-y-2">
            <Button 
              type="button" 
              variant="link" 
              className="text-primary p-0" 
              onClick={onResendCode}
              disabled={isLoading || !pendingEmail}
            >
              Reenviar código
            </Button>
            <div>
              <Button 
                type="button" 
                variant="link" 
                className="text-primary p-0" 
                onClick={onBackToLogin}
              >
                Voltar ao login
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
