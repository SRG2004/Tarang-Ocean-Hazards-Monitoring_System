import { Card } from "../components/ui/card";
import { Users, Shield, BarChart3, Waves } from "lucide-react";
import { useNavigate } from "react-router-dom";

const roles = [
  {
    key: "citizen",
    title: "Citizen",
    description: "Report hazards, receive alerts, and help keep your community safe.",
    icon: <Users className="w-8 h-8 text-blue-700" aria-hidden="true" />,
    gradient: "bg-gradient-to-br from-blue-100 via-blue-200 to-slate-100",
    border: "border-blue-300",
  },
  {
    key: "official",
    title: "Official",
    description: "Coordinate emergency response and manage hazard events efficiently.",
    icon: <Shield className="w-8 h-8 text-green-700" aria-hidden="true" />,
    gradient: "bg-gradient-to-br from-green-100 via-green-200 to-slate-100",
    border: "border-green-300",
  },
  {
    key: "analyst",
    title: "Analyst",
    description: "Analyze data, monitor trends, and support decision-making.",
    icon: <BarChart3 className="w-8 h-8 text-purple-700" aria-hidden="true" />,
    gradient: "bg-gradient-to-br from-purple-100 via-purple-200 to-slate-100",
    border: "border-purple-300",
  },
];

export default function RoleSelectionPage() {
  const navigate = useNavigate();

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{ background: "var(--gradient-background)" }}
      aria-label="Role selection landing page"
    >
      <header className="mb-10 flex flex-col items-center">
        <div className="flex items-center gap-2">
          <Waves className="w-10 h-10 text-blue-600" aria-hidden="true" />
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Tarang</h1>
        </div>
        <span className="text-base text-slate-500 mt-1">Ocean Hazards Monitoring System &mdash; INCOIS</span>
      </header>
      <section
        className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6"
        aria-label="Select your role"
      >
        {roles.map((role) => (
          <Card
            key={role.key}
            tabIndex={0}
            role="button"
            aria-label={`Select ${role.title} role`}
            className={`flex flex-col items-center justify-between p-6 rounded-xl shadow-md transition-all duration-200 cursor-pointer outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${role.key}-300 ${role.gradient} border ${role.border} hover:scale-105 hover:shadow-lg`}
            onClick={() => navigate(`/login/${role.key}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") navigate(`/login/${role.key}`);
            }}
          >
            <div className="mb-4">{role.icon}</div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">{role.title}</h2>
            <p className="text-sm text-slate-600 text-center">{role.description}</p>
          </Card>
        ))}
      </section>
      <footer className="mt-10 text-xs text-slate-400 text-center">
        &copy; {new Date().getFullYear()} INCOIS &mdash; Tarang Ocean Hazards Monitoring System
      </footer>
    </main>
  );
}
