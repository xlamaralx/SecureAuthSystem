import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const resetSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type ResetFormValues = z.infer<typeof resetSchema>;

type ForgotPasswordFormProps = {
  onBackToLogin: () => void;
};

export function ForgotPasswordForm({ onBackToLogin }: ForgotPasswordFormProps) {
  const { requestPasswordResetMutation } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ResetFormValues) => {
    setIsLoading(true);
    try {
      await requestPasswordResetMutation.mutateAsync(data);
      form.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 bg-background-100 p-8 rounded-lg shadow-lg border border-border">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Recuperar senha</h1>
        <p className="text-muted-foreground mt-1">Enviaremos um link para seu email</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="seu@email.com" 
                    {...field} 
                    autoComplete="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Enviando..." : "Enviar link de recuperação"}
          </Button>

          <div className="text-center text-sm">
            <Button 
              type="button" 
              variant="link" 
              className="text-primary p-0" 
              onClick={onBackToLogin}
            >
              Voltar ao login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
