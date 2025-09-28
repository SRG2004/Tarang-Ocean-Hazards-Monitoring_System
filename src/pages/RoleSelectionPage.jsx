import { Card } from "../components/ui/card";
import { Users, Shield, BarChart3, Waves, MessageCircle, Layout, FileText, Map, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

const quickActions = [
  {
    title: "Social Media",
    description: "Monitor real-time conversations",
    icon: MessageCircle,
    route: "/social-media",
    color: "text-blue-500"
  },
  {
    title: "My Dashboard",
    description: "Personalized overview",
    icon: Layout,
    route: "/dashboard",
    color: "text-gray-600"
  },
  {
    title: "Reports",
    description: "View and manage reports",
    icon: FileText,
    route: "/reports",
    color: "text-gray-600"
  },
  {
    title: "Map View",
    description: "Interactive hazard map",
    icon: Map,
    route: "/map",
    color: "text-gray-600"
  },
  {
    title: "Support & Alerts",
    description: "Notifications and help",
    icon: Bell,
    route: "/alerts",
    color: "text-red-500"
  }
];

const roles = [
  {
    key: "citizen",
    title: "Citizen",
    description: "Report hazards, view alerts, community updates",
    icon: <Users className="w-8 h-8 text-blue-500" aria-hidden="true" />,
    gradient: "bg-gradient-to-br from-gray-50 to-white",
    border: "border-gray-200",
    buttonText: "Enter as Citizen"
  },
  {
    key: "official",
    title: "Official",
    description: "Manage resources, dashboards, response allocation",
    icon: <Shield className="w-8 h-8 text-green-500" aria-hidden="true" />,
    gradient: "bg-gradient-to-br from-gray-50 to-white",
    border: "border-gray-200",
    buttonText: "Enter as Official"
  },
  {
    key: "analyst",
    title: "Analyst",
    description: "Access insights, trends, predictive models",
    icon: <BarChart3 className="w-8 h-8 text-blue-500" aria-hidden="true" />,
    gradient: "bg-gradient-to-br from-gray-50 to-white",
    border: "border-gray-200",
    buttonText: "Enter as Analyst"
  },
];

export default function RoleSelectionPage() {
  const navigate = useNavigate();

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-gray-50 to-white"
      aria-label="Role selection landing page"
    >
      <header className="mb-10 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-4">
          <Waves className="w-10 h-10 text-blue-500" aria-hidden="true" />
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Tarang</h1>
        </div>
        <span className="text-base text-gray-600 mb-6">Ocean Hazards Monitoring System &mdash; INCOIS</span>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Ocean Hazard Command Center</h2>
        <p className="text-gray-600 max-w-md">Access real-time hazard data, manage social media analytics, and monitor ocean safety activities</p>
      </header>

      {/* Quick Actions Row */}
      <section className="w-full max-w-6xl mb-12 grid grid-cols-1 md:grid-cols-5 gap-4" aria-label="Quick actions">
        {quickActions.map((action, index) => (
          <Card
            key={index}
            className="flex flex-col items-center p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer bg-white"
            onClick={() => navigate(action.route)}
            tabIndex={0}
            role="button"
            aria-label={`Go to ${action.title}`}
          >
            <action.icon className={`w-6 h-6 mb-2 ${action.color}`} />
            <h3 className="text-sm font-medium text-gray-900 mb-1">{action.title}</h3>
            <p className="text-xs text-gray-500 text-center">{action.description}</p>
          </Card>
        ))}
      </section>

      <section
        className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
        aria-label="Select your role"
      >
        {roles.map((role) => (
          <Card
            key={role.key}
            tabIndex={0}
            role="button"
            aria-label={`Select ${role.title} role`}
            className={`flex flex-col items-center p-6 rounded-xl shadow-sm transition-all duration-200 cursor-pointer outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 ${role.gradient} border ${role.border} hover:shadow-md hover:scale-[1.02]`}
            onClick={() => navigate(`/login/${role.key}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") navigate(`/login/${role.key}`);
            }}
          >
            <div className="mb-4">{role.icon}</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2 text-center">{role.title}</h2>
            <p className="text-sm text-gray-600 text-center mb-4">{role.description}</p>
            <button 
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/login/${role.key}`);
              }}
            >
              {role.buttonText}
            </button>
          </Card>
        ))}
      </section>
      <footer className="mt-10 text-xs text-gray-500 text-center">
        &copy; {new Date().getFullYear()} INCOIS &mdash; Tarang Ocean Hazards Monitoring System
      </footer>
    </main>
  );
}
