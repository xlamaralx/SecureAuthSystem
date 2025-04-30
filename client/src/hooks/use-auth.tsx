import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import {
  useQuery,
  useMutation,
} from "@tanstack/react-query";
import { apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  expirationDate?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

interface TwoFactorCredentials {
  email: string;
  code: string;
}

interface ForgotPasswordCredentials {
  email: string;
}

interface ResetPasswordCredentials {
  token: string;
  password: string;
}

interface TwoFactorState {
  isRequired: boolean;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  twoFactorState: TwoFactorState;
  login: (credentials: LoginCredentials) => Promise<void>;
  verifyTwoFactor: (credentials: TwoFactorCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  forgotPassword: (credentials: ForgotPasswordCredentials) => Promise<void>;
  resetPassword: (credentials: ResetPasswordCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearTwoFactorState: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [twoFactorState, setTwoFactorState] = useState<TwoFactorState>({
    isRequired: false,
    email: "",
  });

  const {
    data: user,
    error,
    isLoading,
    refetch: refetchUser,
  } = useQuery<User | null, Error>({
    queryKey: ["/api/user"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/user", {
          credentials: "include",
        });
        
        if (res.status === 401) {
          return null;
        }
        
        if (!res.ok) {
          throw new Error(`${res.status}: ${res.statusText}`);
        }
        
        return await res.json();
      } catch (error) {
        console.error("Error fetching user:", error);
        return null;
      }
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json();
    },
    onSuccess: (data) => {
      if (data.requiresTwoFactor) {
        setTwoFactorState({
          isRequired: true,
          email: data.email,
        });
        toast({
          title: "Verification Required",
          description: "A verification code has been sent to your email",
        });
      } else {
        refetchUser();
        setLocation("/");
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const twoFactorMutation = useMutation({
    mutationFn: async (credentials: TwoFactorCredentials) => {
      const res = await apiRequest("POST", "/api/verify-2fa", credentials);
      return await res.json();
    },
    onSuccess: () => {
      setTwoFactorState({
        isRequired: false,
        email: "",
      });
      refetchUser();
      setLocation("/");
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const res = await apiRequest("POST", "/api/register", credentials);
      return await res.json();
    },
    onSuccess: () => {
      refetchUser();
      setLocation("/");
      toast({
        title: "Registration Successful",
        description: "Your account has been created",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (credentials: ForgotPasswordCredentials) => {
      const res = await apiRequest("POST", "/api/forgot-password", credentials);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Password Reset",
        description: data.message,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Request failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (credentials: ResetPasswordCredentials) => {
      const res = await apiRequest("POST", "/api/reset-password", credentials);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Password Reset",
        description: data.message,
      });
      setLocation("/auth");
    },
    onError: (error: Error) => {
      toast({
        title: "Password reset failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      setLocation("/auth");
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Redirect to auth page if no user is logged in
  useEffect(() => {
    if (user === null && !isLoading && !twoFactorState.isRequired && location.pathname !== '/auth') {
      setLocation('/auth');
    }
  }, [user, isLoading, twoFactorState, setLocation]);

  // Clear two-factor state
  const clearTwoFactorState = () => {
    setTwoFactorState({
      isRequired: false,
      email: "",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        twoFactorState,
        login: loginMutation.mutateAsync,
        verifyTwoFactor: twoFactorMutation.mutateAsync,
        register: registerMutation.mutateAsync,
        forgotPassword: forgotPasswordMutation.mutateAsync,
        resetPassword: resetPasswordMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
        clearTwoFactorState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
