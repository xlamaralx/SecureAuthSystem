import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";
import { ThemeProvider } from "./hooks/use-theme";
import { LayoutProvider } from "./hooks/use-layout";
import { ApolloProvider } from "@apollo/client";
import { client } from "./lib/apollo-client";
// Implementaremos o suporte multilíngue posteriormente

// Vamos importar as novas páginas quando precisarmos delas
const ProfilePage = () => <div>Profile Page</div>;
const SettingsPage = () => <div>Settings Page</div>;
const UsersPage = () => <div>Users Page</div>;

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={DashboardPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <ProtectedRoute path="/settings" component={SettingsPage} />
      <ProtectedRoute path="/users" component={UsersPage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={client}>
        <ThemeProvider defaultTheme="dark">
          <LayoutProvider defaultLayout="sidebar">
            <AuthProvider>
              <TooltipProvider>
                <Toaster />
                <Router />
              </TooltipProvider>
            </AuthProvider>
          </LayoutProvider>
        </ThemeProvider>
      </ApolloProvider>
    </QueryClientProvider>
  );
}

export default App;
