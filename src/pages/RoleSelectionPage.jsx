import { Card } from "../components/ui/card";
import { Users, Shield, BarChart3, Waves } from "lucide-react";
import { useNavigate } from "react-router-dom";

const roles = [
  {
    key: "citizen",
    title: "Citizen",
    description: "Report hazards, receive alerts, and help keep your community safe.",
    icon: <Users className="w-8 h-8 text-primary" aria-hidden="true" />,
    color: "focus:ring-primary",
  },
  {
    key: "official",
    title: "Official",
    description: "Coordinate emergency response and manage hazard events efficiently.",
    icon: <Shield className="w-8 h-8 text-success" aria-hidden="true" />,
    color: "focus:ring-success",
  },
  {
    key: "analyst",
    title: "Analyst",
    description: "Analyze data, monitor trends, and support decision-making.",
    icon: <BarChart3 className="w-8 h-8 text-[--color-analyst]" aria-hidden="true" />,
    color: "focus:ring-violet-500",
  },
];

export default function RoleSelectionPage() {
  const navigate = useNavigate();

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{ background: "var(--gradient-role)" }}
      aria-label="Role selection landing page"
    >
      <header className="mb-10 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-2">
          <Waves className="w-10 h-10 text-primary" aria-hidden="true" />
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Tarang</h1>
        </div>
        <span className="text-base text-text-secondary">Ocean Hazards Monitoring System — INCOIS</span>
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
            className={`card flex flex-col items-center p-6 transition-all duration-200 cursor-pointer hover:shadow-md focus-within:shadow-md ${role.color}`}
            onClick={() => navigate(`/login/${role.key}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate(`/login/${role.key}`);
              }
            }}
          >
            <div className="mb-4">{role.icon}</div>
            <h2 className="text-xl font-semibold text-text-primary mb-2 text-center">{role.title}</h2>
            <p className="text-sm text-text-secondary text-center leading-relaxed">{role.description}</p>
          </Card>
        ))}
      </section>
      <footer className="mt-10 text-xs text-text-muted text-center">
        &copy; {new Date().getFullYear()} INCOIS — Tarang Ocean Hazards Monitoring System
      </footer>
    </main>
  );
}
