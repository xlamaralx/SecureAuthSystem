import { useAuth } from "@/hooks/use-auth";
import { Welcome } from "@/components/dashboard/welcome";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto">
      <Welcome />
    </div>
  );
}
