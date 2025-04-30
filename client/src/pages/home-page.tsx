import { useEffect } from "react";
import { useLocation } from "wouter";
import DashboardPage from "./dashboard-page";

export default function HomePage() {
  const [, setLocation] = useLocation();

  // Redirect to the dashboard
  useEffect(() => {
    setLocation("/");
  }, [setLocation]);

  return <DashboardPage />;
}
