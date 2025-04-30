import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

// Login schema
const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

// Registration schema
const registerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "Confirmar senha é obrigatório"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não correspondem",
  path: ["confirmPassword"],
});

// Forgot password schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

// Two-factor schema
const twoFactorSchema = z.object({
  code: z.string().length(6, "O código deve ter 6 dígitos"),
});

enum AuthView {
  LOGIN = "login",
  REGISTER = "register",
  FORGOT_PASSWORD = "forgot_password",
  TWO_FACTOR = "two_factor",
}

export default function AuthPage() {
  const { user, isLoading, twoFactorState, login, register, verifyTwoFactor, forgotPassword, resetPassword, clearTwoFactorState } = useAuth();
  const [location, setLocation] = useLocation();
  const [currentView, setCurrentView] = useState<AuthView>(AuthView.LOGIN);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const twoFactorForm = useForm<z.infer<typeof twoFactorSchema>>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: "",
    },
  });

  // Check for two-factor state
  useEffect(() => {
    if (twoFactorState.isRequired) {
      setCurrentView(AuthView.TWO_FACTOR);
    }
  }, [twoFactorState]);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !isLoading && currentView !== AuthView.TWO_FACTOR) {
      setLocation("/");
    }
  }, [user, isLoading, setLocation, currentView]);
  
  // Parse URL for password reset
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      // Handle password reset
      // This would be implemented with a specific reset password view
    }
  }, []);

  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true);
    try {
      await login(data);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (data: z.infer<typeof registerSchema>) => {
    setIsSubmitting(true);
    try {
      const { confirmPassword, ...registerData } = data;
      await register(registerData);
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (data: z.infer<typeof forgotPasswordSchema>) => {
    setIsSubmitting(true);
    try {
      await forgotPassword(data);
      setCurrentView(AuthView.LOGIN);
    } catch (error) {
      console.error("Forgot password error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyTwoFactor = async (data: z.infer<typeof twoFactorSchema>) => {
    setIsSubmitting(true);
    try {
      await verifyTwoFactor({
        email: twoFactorState.email,
        code: data.code,
      });
    } catch (error) {
      console.error("Two-factor verification error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!twoFactorState.email) return;
    
    setIsSubmitting(true);
    try {
      await login({
        email: twoFactorState.email,
        password: "", // Server will check for the email and regenerate the code without validating the password
      });
    } catch (error) {
      console.error("Resend code error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    clearTwoFactorState();
    setCurrentView(AuthView.LOGIN);
  };

  // If the user is already logged in, don't show the login page
  if (user && !isLoading && currentView !== AuthView.TWO_FACTOR) {
    return null;
  }

  // If still loading the user data, show a spinner
  if (isLoading && !twoFactorState.isRequired) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4">
      {currentView === AuthView.LOGIN && (
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Dashboard Admin</h1>
              <p className="text-muted-foreground mt-1">Faça login para acessar o sistema</p>
            </div>

            <form className="space-y-4" onSubmit={loginForm.handleSubmit(handleLogin)}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...loginForm.register("email")}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-red-500">{loginForm.formState.errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm p-0 h-auto"
                    onClick={() => setCurrentView(AuthView.FORGOT_PASSWORD)}
                  >
                    Esqueceu a senha?
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...loginForm.register("password")}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Entrar
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Não tem uma conta?</span>
                <Button
                  type="button"
                  variant="link"
                  className="ml-1 p-0 h-auto"
                  onClick={() => setCurrentView(AuthView.REGISTER)}
                >
                  Cadastre-se
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {currentView === AuthView.REGISTER && (
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Cadastro de usuário</h1>
              <p className="text-muted-foreground mt-1">Crie sua conta para acessar o sistema</p>
            </div>

            <form className="space-y-4" onSubmit={registerForm.handleSubmit(handleRegister)}>
              <div className="space-y-2">
                <Label htmlFor="register-name">Nome completo</Label>
                <Input
                  id="register-name"
                  type="text"
                  placeholder="Seu nome completo"
                  {...registerForm.register("name")}
                />
                {registerForm.formState.errors.name && (
                  <p className="text-sm text-red-500">{registerForm.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="seu@email.com"
                  {...registerForm.register("email")}
                />
                {registerForm.formState.errors.email && (
                  <p className="text-sm text-red-500">{registerForm.formState.errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-password">Senha</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="••••••••"
                  {...registerForm.register("password")}
                />
                {registerForm.formState.errors.password && (
                  <p className="text-sm text-red-500">{registerForm.formState.errors.password.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  {...registerForm.register("confirmPassword")}
                />
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500">{registerForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Cadastrar
              </Button>

              <div className="text-center text-sm">
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => setCurrentView(AuthView.LOGIN)}
                >
                  Já tem uma conta? Faça login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {currentView === AuthView.FORGOT_PASSWORD && (
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Recuperar senha</h1>
              <p className="text-muted-foreground mt-1">Enviaremos um link para seu email</p>
            </div>

            <form className="space-y-4" onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)}>
              <div className="space-y-2">
                <Label htmlFor="recovery-email">Email</Label>
                <Input
                  id="recovery-email"
                  type="email"
                  placeholder="seu@email.com"
                  {...forgotPasswordForm.register("email")}
                />
                {forgotPasswordForm.formState.errors.email && (
                  <p className="text-sm text-red-500">{forgotPasswordForm.formState.errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Enviar link de recuperação
              </Button>

              <div className="text-center text-sm">
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => setCurrentView(AuthView.LOGIN)}
                >
                  Voltar ao login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {currentView === AuthView.TWO_FACTOR && (
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Verificação em duas etapas</h1>
              <p className="text-muted-foreground mt-1">Enviamos um código para seu email</p>
            </div>

            <form className="space-y-4" onSubmit={twoFactorForm.handleSubmit(handleVerifyTwoFactor)}>
              <div className="space-y-2">
                <Label htmlFor="verification-code">Código de verificação</Label>
                <Input
                  id="verification-code"
                  type="text"
                  placeholder="Digite o código de 6 dígitos"
                  maxLength={6}
                  {...twoFactorForm.register("code")}
                />
                {twoFactorForm.formState.errors.code && (
                  <p className="text-sm text-red-500">{twoFactorForm.formState.errors.code.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Verificar
              </Button>

              <div className="flex justify-between text-sm">
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto"
                  onClick={handleResendCode}
                  disabled={isSubmitting}
                >
                  Reenviar código
                </Button>
                
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto"
                  onClick={handleBackToLogin}
                >
                  Voltar ao login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
