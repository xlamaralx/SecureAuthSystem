import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartPie, User, History, DollarSign, Users, Activity } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { format } from "date-fns";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

// Dados de exemplo para os gráficos
const barData = [
  { name: "Jan", total: 1200 },
  { name: "Feb", total: 900 },
  { name: "Mar", total: 1600 },
  { name: "Apr", total: 1800 },
  { name: "May", total: 2200 },
  { name: "Jun", total: 2600 },
  { name: "Jul", total: 1800 },
];

const lineData = [
  { name: "Seg", value: 400 },
  { name: "Ter", value: 300 },
  { name: "Qua", value: 500 },
  { name: "Qui", value: 280 },
  { name: "Sex", value: 590 },
  { name: "Sáb", value: 320 },
  { name: "Dom", value: 280 },
];

const pieData = [
  { name: "Usuários", value: 540, color: "#3b82f6" },
  { name: "Admins", value: 20, color: "#8b5cf6" },
  { name: "Pendentes", value: 45, color: "#f59e0b" },
];

// Componente de cartão de estatística
interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, description, icon }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-4 w-4 text-muted-foreground">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export function Welcome() {
  const { user } = useAuth();
  const { theme } = useTheme();

  // Format the date for display
  const formattedDate = user?.createdAt 
    ? format(new Date(user.createdAt), "dd/MM/yyyy")
    : "Unknown";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bem-vindo, {user?.name || "Usuário"}!</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Receita"
          value="$15,231.89"
          description="+20.1% desde o mês passado"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatCard
          title="Inscrições"
          value="+2350"
          description="+180.1% desde o mês passado"
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          title="Vendas"
          value="+12,234"
          description="+19% desde o mês passado"
          icon={<ChartPie className="h-4 w-4" />}
        />
        <StatCard
          title="Usuários Ativos"
          value="+573"
          description="+201 desde a última hora"
          icon={<Activity className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Receita Mensal</CardTitle>
            <CardDescription>
              Análise de receita mensal para o ano atual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
                      borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                      color: theme === 'dark' ? '#f9fafb' : '#111827',
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="total"
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividade de Usuários</CardTitle>
            <CardDescription>
              Usuários ativos por dia da semana
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={lineData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
                      borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                      color: theme === 'dark' ? '#f9fafb' : '#111827',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Distribuição de Usuários</CardTitle>
            <CardDescription>Por tipo de acesso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
                      borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                      color: theme === 'dark' ? '#f9fafb' : '#111827',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Informações do Perfil</CardTitle>
            <CardDescription>Detalhes da sua conta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Nome</p>
                  <p className="font-medium">{user?.name || "Usuário"}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="font-medium">{user?.email || "email@exemplo.com"}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Função</p>
                  <p className="font-medium">{user?.role === "admin" ? "Administrador" : "Usuário"}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Cadastrado em</p>
                  <p className="font-medium">{formattedDate}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div className="flex items-center">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></span>
                    <p className="font-medium">Ativo</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Autorização</p>
                  <div className="flex items-center">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></span>
                    <p className="font-medium">Autorizado</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
